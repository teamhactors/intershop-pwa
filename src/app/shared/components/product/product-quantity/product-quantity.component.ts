import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

@Component({
  selector: 'ish-product-quantity',
  templateUrl: './product-quantity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductQuantityComponent implements OnInit {
  @Input() type: 'input' | 'select' | 'counter' = 'input';
  @Input() id = '';

  visible$: Observable<boolean>;
  quantity$: Observable<number>;
  min$: Observable<number>;
  max$: Observable<number>;
  hasQuantityError$: Observable<boolean>;
  quantityError$: Observable<string>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'quantity');
    this.quantity$ = this.context.select('quantity');
    this.min$ = this.context.select('minQuantity');
    this.max$ = this.context.select('product', 'maxOrderQuantity');
    this.hasQuantityError$ = this.context.select('hasQuantityError');
    this.quantityError$ = this.context.select('quantityError');
  }

  change(target: EventTarget) {
    // tslint:disable-next-line: no-string-literal
    this.context.set('quantity', () => target['valueAsNumber']);
  }
}
