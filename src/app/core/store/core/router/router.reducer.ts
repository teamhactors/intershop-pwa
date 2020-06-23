import { Data, Params } from '@angular/router';
import { ROUTER_CANCEL, ROUTER_ERROR, ROUTER_NAVIGATED, ROUTER_NAVIGATION } from '@ngrx/router-store';

export interface RouterState {
  url: string;
  params: Params;
  queryParams: Params;
  data: Data;
}

/**
 * temporarily copied from ngrx sources
 */
export function routerReducer(state, action) {
  // Allow compilation with strictFunctionTypes - ref: #1344
  /** @type {?} */
  const routerAction = /** @type {?} */ action;
  switch (routerAction.type) {
    case ROUTER_NAVIGATED:
    case ROUTER_NAVIGATION:
    case ROUTER_ERROR:
    case ROUTER_CANCEL:
      return {
        state: routerAction.payload.routerState,
        navigationId: routerAction.payload.event.id,
      };
    default:
      return /** @type {?} */ state;
  }
}
