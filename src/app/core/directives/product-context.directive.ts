import {
  Directive,
  DoCheck,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  SkipSelf,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { ProductContextDisplayProperties, ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { AnyProductViewType, ProductCompletenessLevel, SkuQuantityType } from 'ish-core/models/product/product.model';

class IshProductContextContext {
  constructor(public context: ProductContextFacade) {}

  get product(): AnyProductViewType {
    return this.context.get('product');
  }

  get quantity(): number {
    return this.context.get('quantity');
  }
}

@Directive({
  selector: '[ishProductContext]',
  providers: [ProductContextFacade],
})
export class ProductContextDirective implements OnInit, OnChanges, DoCheck {
  @Input() completeness: 'List' | 'Detail' = 'List';
  @Input() propagateIndex: number;

  @Output() skuChange = this.context.select('sku');
  @Output() quantityChange = this.context.select('quantity');

  constructor(
    @SkipSelf() @Optional() private parentContext: ProductContextFacade,
    private context: ProductContextFacade,
    private viewContainer: ViewContainerRef,
    @Optional() private template: TemplateRef<IshProductContextContext>
  ) {
    this.context.hold(this.context.$, () => this.propagate());
  }

  @Input()
  set ishProductContext(sku: string) {
    this.context.set('sku', () => sku);
  }

  @Input()
  set sku(sku: string) {
    this.context.set('sku', () => sku);
  }

  @Input()
  set ishProductContextQuantity(quantity: number) {
    this.context.set('quantity', () => quantity);
  }

  @Input()
  set quantity(quantity: number) {
    this.context.set('quantity', () => quantity);
  }

  @Input()
  set allowZeroQuantity(allowZeroQuantity: boolean) {
    this.context.set('allowZeroQuantity', () => allowZeroQuantity);
  }

  @Input()
  set parts(parts: SkuQuantityType[]) {
    this.context.set('parts', () => parts);
  }

  @Input()
  set configuration(config: Partial<ProductContextDisplayProperties>) {
    this.context.config = config;
  }

  private propagate() {
    if (this.propagateIndex !== undefined) {
      if (!this.parentContext) {
        throw new Error('cannot propagate without parent context');
      }
      this.parentContext.propagate(
        this.propagateIndex,
        this.context.get('propagateActive') ? this.context.get() : undefined
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.propagateActive) {
      this.propagate();
    }
  }

  ngDoCheck() {
    if (this.template) {
      this.viewContainer.get(0).markForCheck();
    }
  }

  ngOnInit() {
    if (this.template) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.template, new IshProductContextContext(this.context));
    }

    this.context.set('requiredCompletenessLevel', () =>
      this.completeness === 'List' ? ProductCompletenessLevel.List : ProductCompletenessLevel.Detail
    );
  }
}
