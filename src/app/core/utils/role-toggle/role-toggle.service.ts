import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { getUserRoles } from 'ish-core/store/customer/authorization';
import { whenTruthy } from 'ish-core/utils/operators';

export function checkRole(roleIds: string[], roleId: string): boolean {
  if (roleId === 'always') {
    return true;
  } else if (roleId === 'never') {
    return false;
  } else {
    return roleIds.includes(roleId);
  }
}

@Injectable({ providedIn: 'root' })
export class RoleToggleService {
  private roleIds$: Observable<string[]>;

  constructor(store: Store) {
    this.roleIds$ = store.pipe(select(getUserRoles)).pipe(map(roles => roles.map(role => role.roleId)));
  }

  hasRole(roleId: string): Observable<boolean> {
    // special case shortcut
    if (roleId === 'always' || roleId === 'never') {
      return of(checkRole([], roleId));
    }
    return this.roleIds$.pipe(
      // wait for permissions to be loaded
      whenTruthy(),
      map(roleIds => checkRole(roleIds, roleId))
    );
  }
}
