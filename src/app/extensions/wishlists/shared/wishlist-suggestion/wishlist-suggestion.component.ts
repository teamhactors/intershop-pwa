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
  activeSlide = 0;

  constructor(private wishlistsFacade: WishlistsFacade) {}

  ngOnInit() {
    this.preferredWishlist$ = this.wishlistsFacade.preferredWishlist$;
  }

  /**
   * Set the active slide via index (used by the thumbnail indicator)
   * @param slideIndex The slide index number to set the active slide
   */
  setActiveSlide(slideIndex: number) {
    this.activeSlide = slideIndex;
  }

  /**
   * Check if the given slide index equals the active slide
   * @param slideIndex The slide index number to be checked if it is the active slide
   * @returns True if the given slide index is the active slide, false otherwise
   */
  isActiveSlide(slideIndex: number): boolean {
    return this.activeSlide === slideIndex;
  }
}
