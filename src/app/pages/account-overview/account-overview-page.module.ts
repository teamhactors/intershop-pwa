import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { WishlistsModule } from '../../extensions/wishlists/wishlists.module';

import { AccountOverviewPageComponent } from './account-overview-page.component';
import { AccountOverviewComponent } from './account-overview/account-overview.component';

@NgModule({
  imports: [SharedModule, WishlistsModule],
  declarations: [AccountOverviewComponent, AccountOverviewPageComponent],
})
export class AccountOverviewPageModule {
  static component = AccountOverviewPageComponent;
}
