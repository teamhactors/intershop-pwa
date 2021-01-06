import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RxState } from '@rx-angular/state';
import { isEqual } from 'lodash-es';
import { combineLatest, race } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, first, map, skip, startWith, switchMap } from 'rxjs/operators';

import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import { VariationProductView } from 'ish-core/models/product-view/product-view.model';
import {
  AnyProductViewType,
  ProductCompletenessLevel,
  ProductHelper,
  SkuQuantityType,
} from 'ish-core/models/product/product.model';
import { whenTruthy } from 'ish-core/utils/operators';

import { ShoppingFacade } from './shopping.facade';

declare type DisplayEval = ((product: AnyProductViewType) => boolean) | boolean;

export interface ProductContextDisplayProperties<T = DisplayEval> {
  readOnly: T;
  name: T;
  description: T;
  sku: T;
  inventory: T;
  price: T;
  promotions: T;
  quantity: T;
  variations: T;
  shipment: T;
  addToBasket: T;
  addToWishlist: T;
  addToOrderTemplate: T;
  addToCompare: T;
  addToQuote: T;
}

const canBeOrdered = (product: AnyProductViewType) =>
  !ProductHelper.isMasterProduct(product) && product.availability && product.inStock;

const canBeOrderedNotRetail = (product: AnyProductViewType) =>
  canBeOrdered(product) && !ProductHelper.isRetailSet(product);

const defaultDisplayProperties: ProductContextDisplayProperties<DisplayEval> = {
  readOnly: false,
  name: true,
  description: true,
  sku: true,
  inventory: product => !ProductHelper.isRetailSet(product) && !ProductHelper.isMasterProduct(product),
  price: true,
  promotions: true,
  quantity: canBeOrderedNotRetail,
  variations: p => ProductHelper.isVariationProduct(p) || ProductHelper.isMasterProduct(p),
  shipment: canBeOrderedNotRetail,
  addToBasket: canBeOrdered,
  addToWishlist: true,
  addToOrderTemplate: canBeOrdered,
  addToCompare: true,
  addToQuote: canBeOrdered,
};

interface ProductContext {
  sku: string;
  requiredCompletenessLevel: ProductCompletenessLevel;
  product: AnyProductViewType;
  productAsVariationProduct: VariationProductView;
  loading: boolean;

  displayProperties: Partial<ProductContextDisplayProperties<boolean>>;

  // variation handling
  variationCount: number;

  // compare
  isInCompareList: boolean;

  // quantity
  quantity: number;
  allowZeroQuantity: boolean;
  minQuantity: number;
  maxQuantity: number;
  quantityError: string;
  hasQuantityError: boolean;

  // child contexts
  parts: SkuQuantityType[];
  propagateActive: boolean;
  children: ProductContext[];
}

@Injectable()
export class ProductContextFacade extends RxState<ProductContext> {
  private privateConfig: Partial<ProductContextDisplayProperties>;

  set config(config: Partial<ProductContextDisplayProperties>) {
    this.privateConfig = config;
    if (this.get('product')) {
      this.set('displayProperties', () => this.computeDisplayProperties(this.get('product')));
    }
  }

  constructor(private shoppingFacade: ShoppingFacade, private translate: TranslateService) {
    super();

    this.set({
      requiredCompletenessLevel: ProductCompletenessLevel.List,
      propagateActive: true,
      allowZeroQuantity: false,
      displayProperties: {
        readOnly: true,
        addToBasket: true,
      },
    });

    this.connect(
      combineLatest([
        this.select('sku').pipe(whenTruthy()),
        this.select('requiredCompletenessLevel').pipe(whenTruthy()),
      ]).pipe(
        filter(([sku, level]) => !!sku && !!level),
        switchMap(([sku, level]) =>
          this.shoppingFacade.product$(sku, level).pipe(
            filter(p => ProductHelper.isReadyForDisplay(p, level)),
            map(product => ({
              product,
              loading: false,
              displayProperties: this.computeDisplayProperties(product),
            })),
            startWith({ loading: true })
          )
        )
      )
    );

    this.connect(
      'productAsVariationProduct',
      this.select('product').pipe(map(p => ProductHelper.isVariationProduct(p) && p))
    );

    this.connect(
      'isInCompareList',
      this.select('sku').pipe(switchMap(sku => this.shoppingFacade.inCompareProducts$(sku)))
    );

    this.connect(
      'minQuantity',
      combineLatest([this.select('product', 'minOrderQuantity'), this.select('allowZeroQuantity')]).pipe(
        map(([minOrderQuantity, allowZeroQuantity]) => (allowZeroQuantity ? 0 : minOrderQuantity))
      )
    );

    this.connect('maxQuantity', this.select('product', 'maxOrderQuantity'));

    this.connect(
      combineLatest([
        this.select('product'),
        this.select('minQuantity'),
        this.select('quantity').pipe(distinctUntilChanged()),
      ]).pipe(
        map(([product, minOrderQuantity, quantity]) => {
          if (product) {
            if (Number.isNaN(quantity)) {
              return this.translate.instant('product.quantity.integer.text');
            } else if (quantity < minOrderQuantity) {
              return this.translate.instant('product.quantity.greaterthan.text', { 0: product.minOrderQuantity });
            } else if (quantity > product.maxOrderQuantity) {
              return this.translate.instant('product.quantity.lessthan.text', { 0: product.maxOrderQuantity });
            }
          }
          return;
        }),
        map(quantityError => ({
          quantityError,
          hasQuantityError: !!quantityError,
        })),
        distinctUntilChanged(isEqual)
      )
    );

    this.connect(
      'hasQuantityError',
      this.select('children').pipe(
        map(
          children =>
            !children?.filter(x => !!x).length || children.filter(x => !!x).some(child => child.hasQuantityError)
        )
      )
    );

    this.connect(
      'quantity',
      this.select('product').pipe(
        whenTruthy(),
        map(p => p.minOrderQuantity),
        first()
      ),
      (state, minOrderQuantity) => (state.quantity ??= minOrderQuantity)
    );

    this.connect(
      'variationCount',
      this.select('sku').pipe(switchMap(sku => this.shoppingFacade.productVariationCount$(sku)))
    );

    this.connect(
      'parts',
      race(
        this.select('product').pipe(
          filter(ProductHelper.isProductBundle),
          map(p => p?.bundledProducts)
        ),
        this.select('product').pipe(
          filter(ProductHelper.isRetailSet),
          map(p => p?.partSKUs?.map(sku => ({ sku })))
        )
      )
    );
  }

  private computeDisplayProperties(product: AnyProductViewType) {
    return Object.entries(defaultDisplayProperties)
      .map(([k, v]) => [k, this.privateConfig?.[k] ?? v])
      .reduce((acc, [k, v]) => {
        acc[k] = typeof v === 'function' ? v(product) : v;
        return acc;
      }, {});
  }

  changeVariationOption(name: string, value: string) {
    this.set('sku', () =>
      ProductVariationHelper.findPossibleVariation(name, value, this.get('productAsVariationProduct'))
    );
  }

  addToBasket() {
    const childContexts = this.get('children') || this.get('parts');
    if (childContexts && !ProductHelper.isProductBundle(this.get('product'))) {
      childContexts
        .filter(x => !!x && !!x.quantity)
        .forEach(child => {
          this.shoppingFacade.addProductToBasket(child.sku, child.quantity);
        });
    } else {
      this.shoppingFacade.addProductToBasket(this.get('sku'), this.get('quantity'));
    }
  }

  toggleCompare() {
    this.shoppingFacade.toggleProductCompare(this.get('sku'));
  }

  addToCompare() {
    this.shoppingFacade.addProductToCompare(this.get('sku'));
  }

  propagate(index: number, childState: ProductContext) {
    this.set('children', state => {
      const current = [...(state.children || [])];
      current[index] = childState;
      return current;
    });
  }

  validDebouncedQuantityUpdate$(time = 800) {
    return this.select('quantity').pipe(
      debounceTime(time),
      filter(() => !this.get('hasQuantityError')),
      distinctUntilChanged(),
      skip(1)
    );
  }
}
