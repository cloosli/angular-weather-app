import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap, take, timeout } from 'rxjs/operators';
import { ForecastResponse } from './models';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  readonly ROOT_URL = `${environment.apiUrl}/forecast`;

  getCurrentForecast(lat: number, lng: number): Observable<ForecastResponse> {
    if (!lat || !lng) {
      throw Error('invalid arguments');
    }
    const id = `forecast_${Math.abs(lat + lng)}`;

    let params = new HttpParams();
    params = params.set('lat', lat.toString());
    params = params.set('lng', lng.toString());

    return this.http.get<ForecastResponse>(this.ROOT_URL, { params })
      .pipe(
        timeout(12 * 1000),
      );
  }
}
