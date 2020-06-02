import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { LocalForecastComponent } from './local-forecast/local-forecast.component';
import { HttpClient } from '@angular/common/http';
import { asyncData } from 'testing/async-observable-helpers';
import { ForecastResponse } from './models';

describe('AppComponent', () => {
  let httpSpy;
  beforeEach(async(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpSpy.get.and.returnValue(asyncData({ city: { name: 'La Paz' } } as ForecastResponse));
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(() => {
      return { coords: { latitude: 33, longitude: -26 } };
    });

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: HttpClient, useValue: httpSpy },
      ],
      declarations: [
        AppComponent,
        LocalForecastComponent,
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'weather-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('weather-app');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Your Local Weather Forecast');
  });
});
