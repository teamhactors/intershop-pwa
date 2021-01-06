import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { omit, pick } from 'lodash-es';
import { EMPTY, of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ProductView, VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';

import { ProductContextFacade } from './product-context.facade';
import { ShoppingFacade } from './shopping.facade';

function pickQuantityFields(context: ProductContextFacade) {
  return pick(
    context.get(),
    Object.keys(context.get()).filter(k => k.toLocaleLowerCase().includes('quantity'))
  );
}

describe('Product Context Facade', () => {
  let context: ProductContextFacade;
  let shoppingFacade: ShoppingFacade;

  beforeEach(() => {
    shoppingFacade = mock(ShoppingFacade);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [ProductContextFacade, { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    });

    context = TestBed.inject(ProductContextFacade);
  });

  it('should be created', () => {
    expect(context).toBeTruthy();
    expect(context.get()).toMatchInlineSnapshot(`
      Object {
        "allowZeroQuantity": false,
        "displayProperties": Object {
          "addToBasket": true,
          "readOnly": true,
        },
        "propagateActive": true,
        "requiredCompletenessLevel": 2,
      }
    `);
    expect(context.get('loading')).toBeFalsy();
  });

  describe('loading', () => {
    it('should set loading state when accessing product', () => {
      when(shoppingFacade.product$(anything(), anything())).thenReturn(EMPTY);
      context.set('sku', () => '123');

      expect(context.get('loading')).toBeTrue();
    });
  });

  describe('with a normal product', () => {
    beforeEach(() => {
      when(shoppingFacade.product$(anything(), anything())).thenReturn(
        of({
          sku: '123',
          completenessLevel: ProductCompletenessLevel.Detail,
          minOrderQuantity: 10,
          maxOrderQuantity: 100,
        } as ProductView)
      );

      context.set('sku', () => '123');
    });

    it('should update context for retrieved product', () => {
      expect(context.get('product')).toMatchInlineSnapshot(`
        Object {
          "completenessLevel": 3,
          "maxOrderQuantity": 100,
          "minOrderQuantity": 10,
          "sku": "123",
        }
      `);

      expect(omit(context.get(), 'displayProperties', 'product')).toMatchInlineSnapshot(`
        Object {
          "allowZeroQuantity": false,
          "hasQuantityError": false,
          "loading": false,
          "maxQuantity": 100,
          "minQuantity": 10,
          "productAsVariationProduct": false,
          "propagateActive": true,
          "quantity": 10,
          "quantityError": undefined,
          "requiredCompletenessLevel": 2,
          "sku": "123",
        }
      `);
    });

    it('should not set stream for variation product', () => {
      expect(context.get('productAsVariationProduct')).toBeFalsy();
    });

    describe('quantity handling', () => {
      it('should start with min order quantity for product', () => {
        expect(pickQuantityFields(context)).toMatchInlineSnapshot(`
          Object {
            "allowZeroQuantity": false,
            "hasQuantityError": false,
            "maxQuantity": 100,
            "minQuantity": 10,
            "quantity": 10,
            "quantityError": undefined,
          }
        `);
      });

      it('should go to error with zero quantity', () => {
        context.set('quantity', () => 0);
        expect(pickQuantityFields(context)).toMatchInlineSnapshot(`
          Object {
            "allowZeroQuantity": false,
            "hasQuantityError": true,
            "maxQuantity": 100,
            "minQuantity": 10,
            "quantity": 0,
            "quantityError": "product.quantity.greaterthan.text",
          }
        `);
      });

      it('should not go to error with zero quantity if allowed', () => {
        context.set('allowZeroQuantity', () => true);
        context.set('quantity', () => 0);
        expect(pickQuantityFields(context)).toMatchInlineSnapshot(`
          Object {
            "allowZeroQuantity": true,
            "hasQuantityError": false,
            "maxQuantity": 100,
            "minQuantity": 0,
            "quantity": 0,
            "quantityError": undefined,
          }
        `);
      });

      it('should go to error if max order quantity is exceeded', () => {
        context.set('quantity', () => 1000);
        expect(pickQuantityFields(context)).toMatchInlineSnapshot(`
          Object {
            "allowZeroQuantity": false,
            "hasQuantityError": true,
            "maxQuantity": 100,
            "minQuantity": 10,
            "quantity": 1000,
            "quantityError": "product.quantity.lessthan.text",
          }
        `);
      });

      it('should go to error if quantity is NaN', () => {
        context.set('quantity', () => NaN);
        expect(pickQuantityFields(context)).toMatchInlineSnapshot(`
          Object {
            "allowZeroQuantity": false,
            "hasQuantityError": true,
            "maxQuantity": 100,
            "minQuantity": 10,
            "quantity": NaN,
            "quantityError": "product.quantity.integer.text",
          }
        `);
      });

      it('should go to error if quantity is null', () => {
        // tslint:disable-next-line: no-null-keyword
        context.set('quantity', () => null);
        expect(pickQuantityFields(context)).toMatchInlineSnapshot(`
          Object {
            "allowZeroQuantity": false,
            "hasQuantityError": true,
            "maxQuantity": 100,
            "minQuantity": 10,
            "quantity": null,
            "quantityError": "product.quantity.greaterthan.text",
          }
        `);
      });
    });
  });

  describe('with a retail set', () => {
    beforeEach(() => {
      when(shoppingFacade.product$(anything(), anything())).thenReturn(
        of(({
          sku: '123',
          completenessLevel: ProductCompletenessLevel.Detail,
          minOrderQuantity: 1,
          maxOrderQuantity: 100,
          type: 'RetailSet',
          partSKUs: ['p1', 'p2'],
        } as unknown) as ProductView)
      );

      context.set('sku', () => '123');
    });

    it('should set parts property for retail set', () => {
      expect(context.get('parts')).toMatchInlineSnapshot(`
        Array [
          Object {
            "sku": "p1",
          },
          Object {
            "sku": "p2",
          },
        ]
      `);
    });

    it('should not set stream for variation product', () => {
      expect(context.get('productAsVariationProduct')).toBeFalsy();
    });
  });

  describe('with a bundle', () => {
    beforeEach(() => {
      when(shoppingFacade.product$(anything(), anything())).thenReturn(
        of(({
          sku: '123',
          completenessLevel: ProductCompletenessLevel.Detail,
          minOrderQuantity: 1,
          maxOrderQuantity: 100,
          type: 'Bundle',
          bundledProducts: [
            { sku: 'p1', quantity: 1 },
            { sku: 'p2', quantity: 2 },
          ],
        } as unknown) as ProductView)
      );

      context.set('sku', () => '123');
    });

    it('should set parts property for bundle', () => {
      expect(context.get('parts')).toMatchInlineSnapshot(`
        Array [
          Object {
            "quantity": 1,
            "sku": "p1",
          },
          Object {
            "quantity": 2,
            "sku": "p2",
          },
        ]
      `);
    });

    it('should not set stream for variation product', () => {
      expect(context.get('productAsVariationProduct')).toBeFalsy();
    });
  });

  describe('with a variation product', () => {
    beforeEach(() => {
      when(shoppingFacade.product$(anything(), anything())).thenReturn(
        of({
          sku: '123',
          completenessLevel: ProductCompletenessLevel.Detail,
          minOrderQuantity: 1,
          maxOrderQuantity: 100,
          type: 'VariationProduct',
        } as VariationProductView)
      );

      context.set('sku', () => '123');
    });

    it('should set stream for variation product', () => {
      expect(context.get('productAsVariationProduct')).toMatchInlineSnapshot(`
        Object {
          "completenessLevel": 3,
          "maxOrderQuantity": 100,
          "minOrderQuantity": 1,
          "sku": "123",
          "type": "VariationProduct",
        }
      `);

      expect(context.get('productAsVariationProduct')).toEqual(context.get('product'));
    });
  });
});
