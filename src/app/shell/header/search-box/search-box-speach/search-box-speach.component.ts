import { ChangeDetectionStrategy, EventEmitter, Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { RxSpeechRecognitionService, resultList } from '@kamiazya/ngx-speech-recognition';

/**
 * The search box container component
 *
 * prepares all data for the search box
 * uses input to display the search box
 *
 * @example
 * <ish-search-box [configuration]="{placeholder: 'search.searchbox.instructional_text' | translate}"></ish-search-box>
 */
@Component({
  selector: 'ish-search-box-speach',
  templateUrl: './search-box-speach.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxSpeachComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  inputFocused: boolean;
  message = '';

  @Output() onListening = new EventEmitter<string>();

  constructor(public service: RxSpeechRecognitionService) {}

  ngOnInit() {}

  listen() {
    this.service
      .listen()
      .pipe(resultList)
      .subscribe((list: SpeechRecognitionResultList) => {
        this.message = list.item(0).item(0).transcript;
        console.log('RxComponent:onresult', this.message, list);
        this.onListening.emit(this.message);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  blur() {
    this.inputFocused = false;
  }

  focus() {
    this.inputFocused = true;
  }
}
