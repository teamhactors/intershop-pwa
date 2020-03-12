import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { StorelocatorPageComponent } from './storelocator-page.component';

const storelocatorPageRoutes: Routes = [{ path: '', component: StorelocatorPageComponent }];

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      apiKey: '<Google Maps API Key>',
    }),
    RouterModule.forChild(storelocatorPageRoutes),
    SharedModule,
  ],
  declarations: [StorelocatorPageComponent],
})
export class StorelocatorPageModule {}
