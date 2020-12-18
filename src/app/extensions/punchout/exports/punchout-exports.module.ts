import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: { feature: 'punchout', location: import('../store/punchout-store.module') },
      multi: true,
    },
  ],
  declarations: [],
  exports: [],
})
export class PunchoutExportsModule {}
