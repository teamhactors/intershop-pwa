import { AgmGeocoder, LatLng } from '@agm/core';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { StoreLocation } from 'ish-core/models/storelocation/storelocation.model';

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
export class StorelocatorPageComponent implements OnInit {
  mapCenterLat = 50.927223;
  mapCenterLng = 11.586111;

  stores: StoreLocation[];

  storeResults$: Observable<LatLng[]>;

  constructor(private geoCoderService: AgmGeocoder) {
    this.stores = [
      {
        name: 'Store Berlin',
        postalCode: '14482',
        city: 'Potsdam',
        country: 'Germany',
        address: 'Marlene-Dietrich-Allee 44',
      },
      {
        name: 'Factory Outlet B5',
        postalCode: '14641',
        city: 'Wustermark',
        country: 'Germany',
        address: 'Alter Spandauer Weg 1',
      },
      {
        name: 'Oceanside Paradies Store',
        postalCode: '17252',
        city: 'Mirow',
        country: 'Germany',
        address: 'Wesenberger Chaussee 22',
      },
    ];
  }

  ngOnInit(): void {
    this.storeResults$ = combineLatest(this.stores.map(store => this.geocodeStoreLocation(store)));
  }

  private geocodeStoreLocation(store: StoreLocation) {
    return this.geoCoderService
      .geocode({
        address: store.address.concat(',', store.city, ',', store.country),
      })
      .pipe(map(results => results[0].geometry.location));
  }
}
