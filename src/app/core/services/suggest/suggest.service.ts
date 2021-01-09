import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

/**
 * The Suggest Service handles the interaction with the 'suggest' REST API.
 */
@Injectable({ providedIn: 'root' })
export class SuggestService {
  constructor(private apiService: ApiService, private http: HttpClient) {}

  /**
   * Returns a list of suggested search terms matching the given search term.
   * @param searchTerm  The search term to get suggestions for.
   * @returns           List of suggested search terms.
   */
  search(searchTerm: string): Observable<SuggestTerm[]> {
    const params = new HttpParams().set('SearchTerm', searchTerm);
    return this.apiService.get('suggest', { params }).pipe(unpackEnvelope<SuggestTerm>());
  }

  postImage(image: File): Observable<string[]> {
    const formData = new FormData();
    formData.append('file', image);
    return this.http.post<any>('http://ee3f6a195ed0.ngrok.io/search/aws/image', formData);
  }

  determineWeather(lat: any, longi: any) {
    const urlParams: URLSearchParams = new URLSearchParams();
    let val = lat + ', ' + longi;
    console.log('Latlong to be sent ' + val);
    urlParams.append('Latlong', val);
    this.http
      .get<any>('http://ee3f6a195ed0.ngrok.io/search/weather/current?' + urlParams.toString())
      .subscribe(weather => {
        console.log('returned weather is ' + weather.CurrentWeather);
        localStorage.setItem('weather', 'Partly cloudy');
      });
  }
}
