
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'ish-search-box-product',
  templateUrl: './search-box-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxProductComponent implements OnInit, OnChanges {
  /**
   * The the search term leading to the displayed result.
   */
  @Input() productSku: string;
  product$: Observable<ProductView>;
  //private destroy$ = new Subject();

  constructor(private shoppingFacade: ShoppingFacade) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.deviceType) {
    }
  }

  ngOnInit() {
    this.product$ = this.shoppingFacade.product$(this.productSku, ProductCompletenessLevel.List);
  }

  public addToBasket() {
    this.shoppingFacade.addProductToBasket(this.productSku, 1)
  }

}
