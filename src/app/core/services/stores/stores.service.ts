import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StoreLocation } from 'ish-core/models/storelocation/storelocation.model';
import { ApiService } from 'ish-core/services/api/api.service';

/**
 * The Stores Service handles the interaction with the 'stores' REST API.
 */
@Injectable({ providedIn: 'root' })
export class StoresService {
  constructor(private apiService: ApiService) {}

  getStores(): Observable<StoreLocation[]> {
    return this.apiService
      .get<{ elements: StoreLocation[]; type: string }>(`stores`)
      .pipe(map(response => response.elements as StoreLocation[]));
  }
}
