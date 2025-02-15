import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductListingView } from 'ish-core/models/product-listing/product-listing.model';
import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';
import { SuggestService } from 'ish-core/services/suggest/suggest.service';
import { whenTruthy } from 'ish-core/utils/operators';

interface SearchBoxConfiguration {
  /**
   * text for search button on search box, icon is used if no text is provided
   */
  buttonText?: string;
  /**
   * placeholder text for search input field
   */
  placeholder?: string;
  /**
   * if autoSuggest is set to true auto suggestion is provided for search box, else no auto suggestion is provided
   */
  autoSuggest?: boolean;
  /**
   * configures the number of suggestions if auto suggestion is provided
   */
  maxAutoSuggests?: number;
  /**
   * configure search box icon
   */
  icon?: IconName;
  /**
   * show last search term as search box value
   */
  showLastSearchTerm?: boolean;
}

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
  selector: 'ish-search-box',
  templateUrl: './search-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  constructor(private shoppingFacade: ShoppingFacade, private router: Router, private searchService: SuggestService) {}
  get usedIcon(): IconName {
    return this.configuration?.icon || 'search';
  }
  productListingView$: Observable<ProductListingView>;

  /**
   * the search box configuration for this component
   */
  @Input() configuration?: SearchBoxConfiguration;

  searchResults$: Observable<SuggestTerm[]>;
  inputSearchTerms$ = new ReplaySubject<string>(1);
  activeIndex = -1;
  inputFocused: boolean;
  searchTerm$: Observable<string>;

  private destroy$ = new Subject();

  selectedFile: ImageSnippet;

  currentLat: any;
  currentLong: any;
  captures: Array<any> = [];

  ngOnInit() {
    this.getLatLang();
    // initialize with searchTerm when on search route
    this.shoppingFacade.searchTerm$
      .pipe(
        map(x => (x ? x : '')),
        takeUntil(this.destroy$)
      )
      .subscribe(term => this.inputSearchTerms$.next(term));

    // suggests are triggered solely via stream
    this.searchResults$ = this.shoppingFacade.searchResults$(this.inputSearchTerms$);
    this.searchResults$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(result => {
      if (result.length > 0) {
        this.shoppingFacade.searchProducts$(result[0].term);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  blur() {
    this.inputFocused = false;
    this.activeIndex = -1;
  }

  focus() {
    this.inputFocused = true;
  }

  searchSuggest(source: string | EventTarget) {
    // tslint:disable-next-line: no-string-literal
    this.inputSearchTerms$.next(typeof source === 'string' ? source : source['value']);
  }

  submitSearch(suggestedTerm: string) {
    if (!suggestedTerm) {
      return false;
    }

    // remove focus when switching to search page
    this.inputFocused = false;

    if (this.activeIndex !== -1) {
      // something was selected via keyboard
      this.searchResults$.pipe(take(1), takeUntil(this.destroy$)).subscribe(results => {
        this.router.navigate(['/search', results[this.activeIndex].term]);
      });
    } else {
      this.router.navigate(['/search', suggestedTerm]);
    }

    // prevent form submission
    return false;
  }

  selectSuggestedTerm(index: number) {
    this.searchResults$.pipe(take(1), takeUntil(this.destroy$)).subscribe(results => {
      if (
        (this.configuration && this.configuration.maxAutoSuggests && index > this.configuration.maxAutoSuggests - 1) ||
        index < -1 ||
        index > results.length - 1
      ) {
        return;
      }
      this.activeIndex = index;
    });
  }
  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.searchService.postImage(this.selectedFile.file).subscribe(data => {
        this.inputSearchTerms$.next(data[0]);
        this.submitSearch(data[0]);
      });
    });

    reader.readAsDataURL(file);
  }
  getLatLang() {
    navigator.geolocation.getCurrentPosition(position => {
      this.currentLat = position.coords.latitude;
      this.currentLong = position.coords.longitude;
      this.searchService.determineWeather(this.currentLat, this.currentLong);
    });
  }

  captureImageFromCamera() {
    const video = document.getElementById('video') as HTMLVideoElement;

    // Get access to the camera!
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        video.srcObject = stream;
        video.play();
        const cameraElem = document.querySelector('.camera-div') as HTMLElement;
        cameraElem.style.display = 'block';
      });
    }
  }
  takePhoto() {
    // Trigger photo take
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const video = document.getElementById('video') as HTMLVideoElement;

    context.drawImage(video, 0, 0, 640, 480);
    const image = canvas.toDataURL('image/png');
    this.captures.push(image);
    const blob = this.dataURItoBlob(image);
    const imagefile = new File([blob], 'fileName.jpeg', {
      type: "'image/jpeg'",
    });
    console.log(image);
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      const track = stream.getTracks()[0]; // if only one media track
      track.stop();
    });
    const cameraElem = document.querySelector('.camera-div') as HTMLElement;
    cameraElem.style.display = 'none';
    this.searchService.postImage(imagefile).subscribe(data => {
      this.inputSearchTerms$.next(data[0]);
      this.submitSearch(data[0]);
    });
  }

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  afterListening(mesg: string) {
    this.submitSearch(mesg);
  }
}

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
