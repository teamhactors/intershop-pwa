import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { range } from 'lodash-es';
import { Observable, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

@Component({
  selector: 'ish-product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductQuantityComponent implements OnInit {
  @Input() type: 'input' | 'select' | 'counter' = 'counter';
  @Input() id = '';

  visible$: Observable<boolean>;
  quantity$: Observable<number>;
  min$: Observable<number>;
  max$: Observable<number>;
  hasQuantityError$: Observable<boolean>;
  quantityError$: Observable<string>;

  selectValues$: Observable<number[]>;

  cannotIncrease$: Observable<boolean>;
  cannotDecrease$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'quantity');
    this.quantity$ = this.context.select('quantity').pipe(filter(n => typeof n === 'number' && !isNaN(n)));
    this.min$ = this.context.select('minQuantity');
    this.max$ = this.context.select('maxQuantity');
    this.hasQuantityError$ = this.context.select('hasQuantityError');
    this.quantityError$ = this.context.select('quantityError');

    this.selectValues$ = combineLatest([this.min$, this.max$]).pipe(map(([min, max]) => range(min, max + 1)));

    this.cannotIncrease$ = combineLatest([this.max$, this.quantity$]).pipe(map(([max, quantity]) => quantity >= max));
    this.cannotDecrease$ = combineLatest([this.min$, this.quantity$]).pipe(map(([min, quantity]) => quantity <= min));
  }

  private setValue(value: number) {
    this.context.set('quantity', () => value);
  }

  private setNextValue(value: number) {
    const max = this.context.get('maxQuantity');
    const min = this.context.get('minQuantity');
    this.setValue(value > max ? max : value < min ? min : value);
  }

  increase() {
    this.setNextValue(this.context.get('quantity') + 1);
  }

  decrease() {
    this.setNextValue(this.context.get('quantity') - 1);
  }

  change(target: EventTarget) {
    // tslint:disable-next-line: no-string-literal
    this.setValue(+target['value']);
  }
}
