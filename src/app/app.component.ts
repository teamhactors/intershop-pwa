import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { CookieLawContainerComponent } from 'angular2-cookie-law';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

/**
 * The App Component provides the application frame for the single page application.
 * In addition to the page structure (header, main section, footer)
 * it holds the global functionality to present a cookie acceptance banner.
 */
@Component({
  selector: 'ish-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:ccp-no-intelligence-in-components
export class AppComponent implements OnInit {
  @ViewChild('cookieLaw', { static: false }) private cookieLaw: CookieLawContainerComponent;

  isBrowser: boolean;
  wrapperClasses$: Observable<string[]>;
  deviceType$: Observable<DeviceType>;

  constructor(private appFacade: AppFacade, @Inject(PLATFORM_ID) platformId: string) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.showLoadingStats();
  }

  ngOnInit() {
    this.deviceType$ = this.appFacade.deviceType$;
    this.wrapperClasses$ = this.appFacade.appWrapperClasses$;
  }

  dismiss() {
    this.cookieLaw.dismiss();
  }

  showLoadingStats() {
    if (this.isBrowser && window.performance && window.performance.timing) {
      const timings = window.performance.timing;
      if (timings.loadEventStart) {
        const ttfb = timings.responseStart - timings.connectStart;
        const domComplete = timings.domContentLoadedEventEnd - timings.connectStart;
        const load = timings.loadEventStart - timings.connectStart;
        // tslint:disable-next-line:no-console
        console.log('window.performance', { ttfb, domComplete, load }, window.performance);
      } else {
        setTimeout(() => {
          this.showLoadingStats(); // retry in next tick, because loadEventStart is empty
        }, 0);
      }
    }
  }
}
