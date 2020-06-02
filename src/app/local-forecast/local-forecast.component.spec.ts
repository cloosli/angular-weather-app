import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LocalForecastComponent } from './local-forecast.component';
import { WeatherService } from '../weather.service';
import { asyncData } from 'testing/async-observable-helpers';

describe('LocalForecastComponent', () => {
  let component: LocalForecastComponent;
  let fixture: ComponentFixture<LocalForecastComponent>;
  let weatherSpy;

  beforeEach(async(() => {
    weatherSpy = jasmine.createSpyObj('WeatherService', ['getCurrentForecast']);
    weatherSpy.getCurrentForecast.and.returnValue(asyncData({}));

    TestBed.configureTestingModule({
      declarations: [LocalForecastComponent],
      providers: [
        { provide: WeatherService, useValue: weatherSpy }
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalForecastComponent);
    component = fixture.componentInstance;
    spyOn(component, 'isGeoLocationAvailable').and.returnValue(true);
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(() => {
      return { coords: { latitude: 50, longitude: -100 } };
    });

    expect(component).toBeTruthy();
    tick();
  }));
});
