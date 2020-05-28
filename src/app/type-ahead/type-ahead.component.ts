import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { filter, switchMap, tap, startWith, map, debounceTime, distinctUntilChanged, } from 'rxjs/operators';
import { City } from '../models';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-type-ahead',
  templateUrl: './type-ahead.component.html',
  styleUrls: ['./type-ahead.component.scss']
})
export class TypeAheadComponent implements OnInit {

  @Output() city: EventEmitter<any> = new EventEmitter();

  filteredOptions$: Observable<City[]>;
  inputFormControl: FormControl;

  option: City;

  constructor(private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.inputFormControl = new FormControl();

    this.filteredOptions$ = this.inputFormControl.valueChanges
      .pipe(
        startWith(''),
        filter(text => !!text && text.length >= 3),
        map(text => text.toLowerCase()),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(text => {
          return this.afs.collection<City>('ow_citylist', ref => ref
            .orderBy(`searchableIndex.${text}`).limit(5)
          )
            .valueChanges()
        }),
      );
  }

  handleClick(city) {
    this.city.emit(city);
  }
}
