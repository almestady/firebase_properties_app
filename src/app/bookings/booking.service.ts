import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Booking } from '../properties/property.model';
import { switchMap, take, tap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings() {
    return this._bookings.asObservable();
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  getBookings() {
    let fetchedUserId:String;
    return this.authService.userId.pipe(take(1),switchMap(userId => {
      if (!userId) {
        throw new Error('No user id found!');
      }
      fetchedUserId = userId;
      return this.authService.token;
    }),
    take(1), switchMap(token => {

      return this.http
        .get<{ [key: string]: Booking }>(
          `https://propertiestag-25d9d.firebaseio.com/bookings.json?orderBy="guestId"&equalTo="${fetchedUserId}"&auth=${token}`
        )
    }),map(bookingData => {
          const bookings = [];
          for (const key in bookingData) {
            if (bookingData.hasOwnProperty(key)) {
              bookings.push(
                {
                  id: key,
                  propertyId: bookingData[key].propertyId,
                  guestId: bookingData[key].guestId,
                  date: bookingData[key].date,
                  time: bookingData[key].time
                }
              );
            }
          }
          return bookings;
        }),
        tap(bookings => {
          this._bookings.next(bookings);
        })
      );
  }

  addBooking(newBooking: Booking) {
    let generatedId: string;
    return this.authService.token.pipe(take(1), switchMap(token => {

      return this.http
        .post<{ name: string }>(
          `https://propertiestag-25d9d.firebaseio.com/bookings.json?auth=${token}`,
          { ...newBooking, id: null }
        )
    }),switchMap(resData => {
          generatedId = resData.name;
          return this.bookings;
        }),
        take(1),
        tap(bookings => {
          newBooking.id = generatedId;
          this._bookings.next(bookings.concat(newBooking));
        })
      );
  }
 

  cancelBooking(bookingId: string) {
    return this.authService.token.pipe(take(1), switchMap(token => {

      return this.http
        .delete(
          `https://propertiestag-25d9d.firebaseio.com/bookings/${bookingId}.json?auth=${token}`
        )
    }),switchMap(() => {
          return this.bookings;
        }),
        take(1),
        tap(bookings => {
          this._bookings.next(bookings.filter(b => b.id !== bookingId));
        })
      );
  }
}
