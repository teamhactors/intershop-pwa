import { Component, OnDestroy, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { Observable, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ish-hide-if-no-options-wrapper',
  template: ` <ng-template #fieldComponent></ng-template> `,
})
export class HideIfNoOptionsWrapperComponent extends FieldWrapper implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  // private subscription: Subscription;

  constructor() {
    super();
  }

  ngOnInit() {
    (this.to.options as Observable<any[]>).pipe(startWith([]), takeUntil(this.destroy$)).subscribe(options => {
      console.log(options);
      this.field.hide = options?.length < 1;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
