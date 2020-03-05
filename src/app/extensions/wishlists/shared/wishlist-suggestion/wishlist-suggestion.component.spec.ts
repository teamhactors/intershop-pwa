import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { WishlistSuggestionComponent } from './wishlist-suggestion.component';

describe('Wishlist Suggestion Component', () => {
  let component: WishlistSuggestionComponent;
  let fixture: ComponentFixture<WishlistSuggestionComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WishlistSuggestionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistSuggestionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
