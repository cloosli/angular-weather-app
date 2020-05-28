import { Component, OnInit, ViewChild } from '@angular/core';
import { WeatherService } from '../weather.service';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { ForecastResponse } from '../models';

@Component({
  selector: 'app-local-forecast',
  templateUrl: './local-forecast.component.html',
  styleUrls: ['./local-forecast.component.scss']
})
export class LocalForecastComponent implements OnInit {

  lat: number;
  lng: number;
  forecast: ForecastResponse;
  loading = false;

  constructor(private weather: WeatherService) { }

  ngOnInit(): void { }

  loadGeoLocation() {
    if (this.isGeoLocationAvailable()) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;

        this.getForecast();
      }, (err) => console.error(err), { timeout: 5 * 1000 });
    }
  }

  isGeoLocationAvailable(): boolean {
    return !!navigator.geolocation;
  }

  getForecast() {
    this.loading = true;
    this.weather.getCurrentForecast(this.lat, this.lng)
      .pipe(
        tap(data => console.log(data)),
        tap(data => this.forecast = data),
        finalize(() => this.loading = false)
      ).subscribe();
  }

  /// Helper to make weather icons work
  /// better solution is to map icons to an object 
  weatherIcon(icon: string) {

    switch (icon) {
      // clear sky
      case '01d': return 'wi wi-day-sunny';
      case '01n': return 'wi wi-night-sunny';
      // few clouds
      case '02d': return 'wi wi-day-sunny-overcast';
      case '02n': return 'wi wi-night-sunny-overcast';
      // scattered clouds
      case '03d': return 'wi wi-day-cloudy-high';
      case '03n': return 'wi wi-night-cloudy-high';
      // broken clouds
      case '04d': return 'wi wi-day-cloudy';
      case '04n': return 'wi wi-night-cloudy';
      // shower rain
      case '09d': return 'wi wi-day-showers';
      case '09n': return 'wi wi-night-showers';
      // rain
      case '10d': return 'wi wi-day-rain';
      case '10n': return 'wi wi-night-rain';
      // thunderstorm
      case '11d': return 'wi wi-day-thunderstorm';
      case '11n': return 'wi wi-night-thunderstorm';
      // snow
      case '13d': return 'wi wi-day-snow';
      case '13n': return 'wi wi-night-snow';
      // mist
      case '50d': return 'wi wi-day-fog';
      case '50n': return 'wi wi-night-fog';
      default:
        return `wi wi-day-sunny`
    }
  }

  handleCity(city) {
    this.lat = city.coord.lat;
    this.lng = city.coord.lon;
    this.forecast = null;
    this.getForecast();
  }
}
