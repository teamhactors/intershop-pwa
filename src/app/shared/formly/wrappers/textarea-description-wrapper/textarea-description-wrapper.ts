import { Component, OnDestroy, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ish-textarea-description-wrapper',
  template: `
    <ng-template #fieldComponent></ng-template>
    <div *ngIf="description">
      <small class="form-text text-muted ng-star-inserted"> {{ description }} </small>
    </div>
  `,
})
export class TextareaDescriptionWrapperComponent extends FieldWrapper implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  description: string;

  constructor(private translate: TranslateService) {
    super();
  }

  ngOnInit() {
    this.formControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(
      value =>
        (this.description = this.translate.instant('textarea.max_limit', {
          0: Math.max(0, this.to.maxLength - value.length),
        }))
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
