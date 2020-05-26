import { TestBed } from '@angular/core/testing';

import { WeatherService } from './weather.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { asyncData } from 'testing/async-observable-helpers';
import { ForecastResponse } from './models';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpSpy;

  const expectedForecast = { city: { name: 'La Paz' } } as ForecastResponse;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpSpy.get.and.returnValue(asyncData(expectedForecast));

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpSpy },
      ]
    });
    service = TestBed.inject(WeatherService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the http.get function', (done) => {
    service.getCurrentForecast(1, 2).subscribe(r => {
      expect(r).toEqual(expectedForecast);
      expect(httpSpy.get).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
