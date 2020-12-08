import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { AnyProductViewType, ProductHelper } from 'ish-core/models/product/product.model';

export interface ProductRowComponentConfiguration {
  readOnly: boolean;
  quantityLabel: string;
  displayName: boolean;
  displayDescription: boolean;
  displaySKU: boolean;
  displayInventory: boolean;
  displayPrice: boolean;
  displayPromotions: boolean;
  displayQuantity: boolean;
  displayVariations: boolean;
  displayShipment: boolean;
  displayAddToBasket: boolean;
  displayAddToWishlist: boolean;
  displayAddToOrderTemplate: boolean;
  displayAddToCompare: boolean;
  displayAddToQuote: boolean;
}

@Component({
  selector: 'ish-product-row',
  templateUrl: './product-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductRowComponent implements OnInit {
  @Input() configuration: Partial<ProductRowComponentConfiguration> = {};
  @Input() category?: CategoryView;

  product$: Observable<AnyProductViewType>;
  quantity$: Observable<number>;

  isMasterProduct = ProductHelper.isMasterProduct;
  isVariationProduct = ProductHelper.isVariationProduct;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
    this.quantity$ = this.context.select('quantity');
  }
}
