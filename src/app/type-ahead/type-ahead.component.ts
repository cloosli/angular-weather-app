import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { filter, switchMap, tap, } from 'rxjs/operators';
import { City } from '../models';


@Component({
  selector: 'app-type-ahead',
  templateUrl: './type-ahead.component.html',
  styleUrls: ['./type-ahead.component.scss']
})
export class TypeAheadComponent implements OnInit {
  results$: Observable<City[]>;
  offset$ = new Subject<string>();

  @Output() city: EventEmitter<any> = new EventEmitter();


  constructor(private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.results$ = this.search();
  }

  onKeyUp(event) {
    this.offset$.next(event.target.value.toLowerCase());
  }

  search() {
    return this.offset$.pipe(
      filter(val => !!val),
      switchMap(val => {
        const start = val;
        console.log(start);
        const end = start + '\uf8ff';
        return this.afs.collection<City>('ow_citylist', ref => ref
          .orderBy(`searchableIndex.${val}`).limit(5)
        )
          .valueChanges()
      }),
    );
  }

  handleClick(city) {
    this.city.emit(city);
  }
}
