import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { AuthService } from '../auth.service';
import * as firebase from 'firebase/app';

export interface Rate{
  id: string;
  stars: number;
  userId: string;
  propertyId: string;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RatesService {

  
  
  private _rates = new BehaviorSubject<Rate[]>([]);
  private ratesCollection: AngularFirestoreCollection<Rate>;
  rates: Observable<Rate[]>;
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private afStorage: AngularFireStorage,
    public afs: AngularFirestore
  ) { 
    this.ratesCollection = this.afs.collection<Rate>('rates');
    this.rates = this.ratesCollection.valueChanges({ idField: 'id' }) as Observable<Rate[]>;
  }

  // get rates() {
  //   return this._rates.asObservable();
  // }

  getRates(){  
    // this.ratesCollection = this.afs.collection('rates');
    // (this.afs.collection('properties').valueChanges({ idField: 'id' }) as Observable<Property[]>).subscribe(
    (this.afs.collection('rates').valueChanges({ idField: 'id' }) as Observable<Rate[]>).subscribe(
      rates => {
        this._rates.next(rates);
      }
    );
  }

  addRate(rate: Rate){
    // const myRate = {...rate};
    return from(this.afs.collection('rates').add(rate));
  }

  cancelRate(rateId:string) {
    return from(this.afs.doc('rates/' + rateId).delete());
   }
  // calculateStars(propertyId: string){
  //   let no_of_5 = 0;
  //   let no_of_4 = 0;
  //   let no_of_3 = 0;
  //   let no_of_2 = 0;
  //   let no_of_1 = 0;
  
  //   let theRates: Rate[] = [];
  //   this.rates.subscribe(rates => {
  //     rates.forEach(rate => {
  //       if(rate.propertyId === propertyId){
  //         theRates.push(rate)
  //       }
  //     })
  //     theRates.forEach(rate => {
  //       if(rate.stars === 5){
  //         no_of_5 + 1;
  //       }
  //       if(rate.stars === 4){
  //         no_of_4 + 1;
  //       }
  //       if(rate.stars === 3){
  //         no_of_3 + 1;
  //       }
  //       if(rate.stars === 2){
  //         no_of_2 + 1;
  //       }
  //       if(rate.stars === 1){
  //         no_of_1 + 1;
  //       }
        
  //     })
  //   })
  //   let rate = (5*no_of_5 + 4*no_of_4 + 3*no_of_3 + 2*no_of_2 + 1*no_of_1) / (no_of_5+no_of_4+no_of_3+no_of_2+no_of_1)
  //   return of(rate);
  // }
}
