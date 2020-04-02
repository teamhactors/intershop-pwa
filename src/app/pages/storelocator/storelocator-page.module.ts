import { AgmCoreModule, AgmGeocoder } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { environment } from '../../../environments/environment';

import { StorelocatorPageComponent } from './storelocator-page.component';

const storelocatorPageRoutes: Routes = [{ path: '', component: StorelocatorPageComponent }];

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      apiKey: environment.gmapsApiKey,
    }),
    CommonModule,
    RouterModule.forChild(storelocatorPageRoutes),
    SharedModule,
  ],
  declarations: [StorelocatorPageComponent],
  providers: [AgmGeocoder],
})
export class StorelocatorPageModule {}
