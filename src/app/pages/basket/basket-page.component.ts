import { isPlatformServer } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Observable, combineLatest, merge, of } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';

@Component({
  selector: 'ish-basket-page',
  templateUrl: './basket-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketPageComponent implements OnInit {
  basket$: Observable<BasketView>;
  basketLoading$: Observable<boolean>;
  basketError$: Observable<HttpError>;
  routingInProgress$: Observable<boolean>;

  constructor(
    private checkoutFacade: CheckoutFacade,
    private appFacade: AppFacade,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
    this.basketLoading$ = this.checkoutFacade.basketLoading$;
    this.basketError$ = this.checkoutFacade.basketError$;
    if (isPlatformServer(this.platformId)) {
      // SSR response should always display loading animation
      this.routingInProgress$ = of(true);
    } else {
      this.routingInProgress$ = merge(
        of(true),
        combineLatest([this.appFacade.routingInProgress$, this.checkoutFacade.basketLoading$]).pipe(
          map(([a, b]) => a || b),
          debounceTime(1000)
        )
      );
    }
  }

  deleteBasketItem(itemId: string) {
    this.checkoutFacade.deleteBasketItem(itemId);
  }

  updateBasketItem(formValue: LineItemUpdate) {
    this.checkoutFacade.updateBasketItem(formValue);
  }

  nextStep() {
    this.checkoutFacade.continue(1);
  }
}
