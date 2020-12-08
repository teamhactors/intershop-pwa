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

interface ProductContext {
  sku: string;
  requiredCompletenessLevel: ProductCompletenessLevel;
  product: AnyProductViewType;
  productAsVariationProduct: VariationProductView;
  variationCount: number;
  loading: boolean;
  isInCompareList: boolean;
  quantity: number;
  allowZeroQuantity: boolean;
  minQuantity: number;
  quantityError: string;
  hasQuantityError: boolean;
  parts: SkuQuantityType[];
  propagateActive: boolean;
  children: ProductContext[];
}

@Injectable()
export class ProductContextFacade extends RxState<ProductContext> {
  constructor(private shoppingFacade: ShoppingFacade, private translate: TranslateService) {
    super();

    this.set({
      requiredCompletenessLevel: ProductCompletenessLevel.List,
      propagateActive: true,
      allowZeroQuantity: false,
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
            map(product => ({ product, loading: false })),
            startWith({ loading: true })
          )
        )
      )
    );

    this.connect('productAsVariationProduct', this.select('product').pipe(filter(ProductHelper.isVariationProduct)));

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

    // this.hold(this.$, ctx => console.log(ctx));
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
