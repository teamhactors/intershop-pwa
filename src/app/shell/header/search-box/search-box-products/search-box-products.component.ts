
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductListingView } from 'ish-core/models/product-listing/product-listing.model';
import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'ish-search-box-products',
  templateUrl: './search-box-products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxProductsComponent implements OnInit, OnChanges {
  /**
   * The the search term leading to the displayed result.
   */
  @Input() searchTerm: string;
  productListingView$: Observable<ProductListingView>;
  private destroy$ = new Subject();
  searchResults$: Observable<SuggestTerm[]>;

  constructor(private shoppingFacade: ShoppingFacade) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.searchTerm) {
      this.searchResults$ = this.shoppingFacade.existSearchResults$(changes.searchTerm.currentValue);
      this.searchResults$.pipe(whenTruthy(),
        takeUntil(this.destroy$)).subscribe(result => {
          if (result.length > 0) {
            this.shoppingFacade.searchProducts$(result[0].term);
            this.productListingView$ = this.shoppingFacade.productListingView$({ type: 'search', value: result[0].term }).pipe(takeUntil(this.destroy$));
          }
        });

    }
  }

  ngOnInit() {
  }

}
