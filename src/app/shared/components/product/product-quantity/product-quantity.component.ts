import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { AnyProductViewType } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-product-quantity',
  templateUrl: './product-quantity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductQuantityComponent implements OnInit {
  @Input() type: 'input' | 'select' | 'counter' = 'input';
  @Input() id = '';

  product$: Observable<AnyProductViewType>;
  quantity$: Observable<number>;
  minOrderQuantity$: Observable<number>;
  hasQuantityError$: Observable<boolean>;
  quantityError$: Observable<string>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
    this.quantity$ = this.context.select('quantity');
    this.minOrderQuantity$ = this.context.select('minQuantity');
    this.hasQuantityError$ = this.context.select('hasQuantityError');
    this.quantityError$ = this.context.select('quantityError');
  }

  change(target: EventTarget) {
    // tslint:disable-next-line: no-string-literal
    this.context.set('quantity', () => target['valueAsNumber']);
  }
}
