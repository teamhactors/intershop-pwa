import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Contact } from 'ish-core/models/contact/contact.model';
import { User } from 'ish-core/models/user/user.model';
import { FormlyService } from 'ish-shared/formly/formly.service';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

/**
 * The Contact Form Component show the customer a form to contact the shop
 *
 * @example
 * <ish-contact-form [subjects]="contactSubjects" (request)="sendRequest($event)"></ish-contact-form>
 */
@Component({
  selector: 'ish-contact-form',
  templateUrl: './contact-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent implements OnInit {
  /** Possible subjects to show to the customer in a select box. */
  @Input() subjects: Observable<string[]>;
  @Input() user: User;
  /** The contact request to send. */
  @Output() request = new EventEmitter<Contact>();

  subjectOptions: Observable<SelectOption[]>;

  /** The form for customer message to the shop. */
  submitted = false;
  contactForm = new FormGroup({});
  model: Contact = {
    name: '',
    email: '',
    phone: '',
    order: '',
    subject: undefined,
    comment: '',
  };

  fields: FormlyFieldConfig[] = [];

  constructor(private formly: FormlyService) {}

  ngOnInit() {
    this.subjectOptions = this.subjects.pipe(
      startWith([]),
      map(subjects => this.mapSubjectOptions(subjects))
    );
    this.fields = [
      this.formly.createInputField({
        key: 'name',
        label: 'helpdesk.contactus.name.label',
        required: true,
        errorMessages: { required: 'helpdesk.contactus.name.error' },
      }),
      this.formly.createEmailField({
        key: 'email',
        label: 'helpdesk.contactus.email.label',
        required: true,
        errorMessages: { required: 'helpdesk.contactus.email.error', email: 'helpdesk.contactus.email.error' },
      }),
      this.formly.createInputField({
        key: 'phone',
        label: 'helpdesk.contactus.phone.label',
        required: true,
        errorMessages: { required: 'helpdesk.contactus.phone.error' },
      }),
      this.formly.createInputField({ key: 'order', label: 'helpdesk.contactus.order.label' }),
      this.formly.createSelectField(
        {
          key: 'subject',
          label: 'helpdesk.contactus.subject.label',
          required: true,
          errorMessages: { required: 'helpdesk.contactus.subject.error' },
        },
        this.subjectOptions
      ),
      this.formly.createTextAreaField({
        key: 'comment',
        label: 'helpdesk.contactus.comments.label',
        required: true,
        errorMessages: { required: 'helpdesk.contactus.comments.error' },
      }),
    ];
    this.initForm();
  }

  /** emit contact request, when for is valid or mark form as dirty, when form is invalid */
  submitForm() {
    if (this.contactForm.valid) {
      const contact: Contact = this.model;

      this.request.emit(contact);
    } else {
      markAsDirtyRecursive(this.contactForm);
      this.submitted = true;
    }
  }

  /** map subjects to select box options */
  private mapSubjectOptions(subjects: string[]): SelectOption[] {
    return subjects.map(subject => ({ value: subject, label: subject }));
  }

  private initForm() {
    this.model.name = this.user && `${this.user.firstName} ${this.user.lastName}`;
    this.model.email = this.user && this.user.email;
    this.model.phone = this.user && (this.user.phoneBusiness || this.user.phoneMobile || this.user.phoneHome);
  }

  /** return boolean to set submit button enabled/disabled */
  get formDisabled(): boolean {
    return this.contactForm.invalid && this.submitted;
  }
}
