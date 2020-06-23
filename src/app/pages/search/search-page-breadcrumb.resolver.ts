import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';

@Injectable({ providedIn: 'root' })
export class SearchPageBreadcrumbResolver implements Resolve<BreadcrumbItem[]> {
  constructor(private translateService: TranslateService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.translateService.get('search.breadcrumbs.your_search.label').pipe(
      map(translation => `${translation} ${route.paramMap.get('searchTerm')}`),
      map(text => [{ text }])
    );
  }
}
