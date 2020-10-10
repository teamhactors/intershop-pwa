import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.model';

export interface ProductTileComponentConfiguration {
  readOnly: boolean;
  displayName: boolean;
  displayVariations: boolean;
  displayPrice: boolean;
  displayPromotions: boolean;
  displayAddToBasket: boolean;
  displayAddToWishlist: boolean;
  displayAddToOrderTemplate: boolean;
  displayAddToCompare: boolean;
  displayAddToQuote: boolean;
}

@Component({
  selector: 'ish-product-tile',
  templateUrl: './product-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTileComponent implements OnChanges {
  @Input() configuration: Partial<ProductTileComponentConfiguration> = {};
  @Input() product: ProductView | VariationProductView | VariationProductMasterView;
  @Input() quantity: number;
  @Input() category: CategoryView;
  @Output() productToBasket = new EventEmitter<number>();

  variationCount$: Observable<number>;

  isMasterProduct = ProductHelper.isMasterProduct;
  isVariationProduct = ProductHelper.isVariationProduct;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnChanges() {
    this.variationCount$ = this.shoppingFacade.productVariationCount$(this.product?.sku);
  }

  addToBasket() {
    this.productToBasket.emit(this.quantity || this.product.minOrderQuantity);
  }
}
