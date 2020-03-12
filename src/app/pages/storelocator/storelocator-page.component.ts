import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-storelocator-page',
  styles: [
    `
      agm-map {
        height: 600px;
      }
    `,
  ],
  templateUrl: './storelocator-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorelocatorPageComponent {
  lat = 51.678418;
  lng = 7.809007;
}
