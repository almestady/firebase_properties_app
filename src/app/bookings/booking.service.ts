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
    return this.http
      .get<{ [key: string]: Booking }>(
        `https://propertiestag-25d9d.firebaseio.com/bookings.json?orderBy="guestId"&equalTo="${
          this.authService.userId
        }"`
      )
      .pipe(
        map(bookingData => {
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

    return this.http
      .post<{ name: string }>(
        'https://propertiestag-25d9d.firebaseio.com/bookings.json',
        { ...newBooking, id: null }
      )
      .pipe(
        switchMap(resData => {
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
    return this.http
      .delete(
        `https://propertiestag-25d9d.firebaseio.com/bookings/${bookingId}.json`
      )
      .pipe(
        switchMap(() => {
          return this.bookings;
        }),
        take(1),
        tap(bookings => {
          this._bookings.next(bookings.filter(b => b.id !== bookingId));
        })
      );
  }
}
