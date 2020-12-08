import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductRowComponentConfiguration } from 'ish-shared/components/product/product-row/product-row.component';
import { ProductTileComponentConfiguration } from 'ish-shared/components/product/product-tile/product-tile.component';

export type ProductItemContainerConfiguration = ProductTileComponentConfiguration &
  ProductRowComponentConfiguration & { displayType: 'tile' | 'row' };

export const DEFAULT_CONFIGURATION: Readonly<ProductItemContainerConfiguration> = {
  readOnly: false,
  quantityLabel: '',
  displayName: true,
  displayDescription: true,
  displaySKU: true,
  displayInventory: true,
  displayQuantity: true,
  displayPrice: true,
  displayPromotions: true,
  displayVariations: true,
  displayShipment: false,
  displayAddToBasket: true,
  displayAddToWishlist: true,
  displayAddToOrderTemplate: true,
  displayAddToCompare: true,
  displayAddToQuote: true,
  displayType: 'tile',
};

/**
 * The Product Item Component renders the product either as 'tile' or 'row'.
 * The 'tile' rendering is the default if no value is provided for the displayType.
 */
@Component({
  selector: 'ish-product-item',
  templateUrl: './product-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductItemComponent implements OnInit, OnChanges {
  /**
   * The optional Category context.
   */
  @Input() category?: CategoryView;
  /**
   * configuration
   */
  @Input() configuration: Partial<ProductItemContainerConfiguration> = DEFAULT_CONFIGURATION;

  product$: Observable<ProductView>;
  loading$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
    this.loading$ = this.context.select('loading');
  }

  ngOnChanges(changes: SimpleChanges) {
    this.mergeConfiguration(changes);
  }

  private mergeConfiguration(changes: SimpleChanges) {
    if (changes.configuration && changes.configuration.firstChange) {
      const oldConfig = this.configuration || {};
      // tslint:disable-next-line:no-assignement-to-inputs
      this.configuration = { ...DEFAULT_CONFIGURATION, ...oldConfig };
    }
  }

  get isTile() {
    return !!this.configuration && this.configuration.displayType === 'tile';
  }

  get isRow() {
    return !this.isTile;
  }
}
