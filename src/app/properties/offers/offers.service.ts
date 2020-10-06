import { Injectable } from '@angular/core';
import { PropertiesService } from '../properties.service';
import { Offer } from './offer.model';
import { Property } from '../property.model';
import { Like } from '../like.model';
import { BehaviorSubject, throwError } from 'rxjs';
import { take, map, retry, catchError } from 'rxjs/operators';
import { View } from '../view.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  apiURL = 'http://localhost:8080';
httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
// private _offers = new BehaviorSubject<Offer[]>();
  constructor(
    private propertyServices: PropertiesService,
    private http: HttpClient
    ) { }

  get offers() {
    // return this._offers.asObservable();
    const props = this.http.get<Offer[]>(this.apiURL + '/offers')
    console.log("Here is rsponse:...")
    console.log(props)
    return props;
  }

  getOffer(offerId: string) {
    // return this.offers.pipe(take(1), map(offers => {
    //    return {...offers.find(offer => offer.property.id === offerId)}
    // })); 
    const offer = this.http.get<Offer>(this.apiURL + '/offers/' + offerId)
  return offer; 
  }

  addOffer(offer: Offer) {
    // return this.offers.pipe(take(1)).subscribe(offers => {
    //    this._offers.next(offers.concat(offer));
    //  });

    return this.http.post<Offer>(this.apiURL + '/properties', 
    JSON.stringify(offer), this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
    ;
  }
  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
 }


  removeOffer() {}

}
