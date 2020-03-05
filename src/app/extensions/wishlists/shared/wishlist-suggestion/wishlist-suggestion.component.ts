import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { Wishlist } from '../../models/wishlist/wishlist.model';

@Component({
  selector: 'ish-wishlist-suggestion',
  templateUrl: './wishlist-suggestion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistSuggestionComponent implements OnInit {
  preferredWishlist$: Observable<Wishlist>;

  constructor(private wishlistsFacade: WishlistsFacade) {}

  ngOnInit() {
    this.preferredWishlist$ = this.wishlistsFacade.preferredWishlist$;
  }
}
