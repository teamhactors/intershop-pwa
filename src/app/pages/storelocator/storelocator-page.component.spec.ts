import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { StorelocatorPageComponent } from './storelocator-page.component';

describe('StorelocatorPageComponent', () => {
  let component: StorelocatorPageComponent;
  let fixture: ComponentFixture<StorelocatorPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StorelocatorPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorelocatorPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
