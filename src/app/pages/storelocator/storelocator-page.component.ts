import { AgmGeocoder, LatLng } from '@agm/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

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

  stores$: Observable<StoreLocation[]>;
  storeCoordinates$: Observable<LatLng[]>;

  constructor(private geoCoderService: AgmGeocoder, private http: HttpClient) {}

  ngOnInit(): void {
    this.stores$ = this.getStoresFromApi();

    this.storeCoordinates$ = this.stores$.pipe(
      map(stores => combineLatest(stores.map(store => this.geocodeStoreLocation(store)))),
      mergeMap(observable => observable)
    );
  }

  private getStoresFromApi(): Observable<StoreLocation[]> {
    return this.http
      .get(
        'http://demo-7-10-15-5.test.intershop.com/INTERSHOP/rest/WFS/inSPIRED-inTRONICS-Site/-;loc=en_US;cur=USD/stores'
      )
      .pipe(map(results => results.elements as StoreLocation[]));
  }

  private geocodeStoreLocation(store: StoreLocation) {
    return this.geoCoderService
      .geocode({
        address: store.address.concat(',', store.city, ',', store.country),
      })
      .pipe(map(results => results[0].geometry.location));
  }
}
