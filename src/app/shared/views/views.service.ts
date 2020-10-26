import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { switchMap, take, tap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
import { View } from 'src/app/properties/property.model';

@Injectable({
  providedIn: 'root'
})
export class ViewsService {
  private _views = new BehaviorSubject<View[]>([]);

  get views() {
    return this._views.asObservable();
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  getViews() {
    return this.authService.token.pipe(take(1), switchMap(token => {

      return this.http
        .get<{ [key: string]: View }>(
          `https://propertiestag-25d9d.firebaseio.com/views.json?auth=${token}`
        )
    }),
        map(viewData => {
          const views = [];
          for (const key in viewData) {
            if (viewData.hasOwnProperty(key)) {
              views.push(
                {
                  id: key,
                  propertyId: viewData[key].propertyId,
                  guestId: viewData[key].guestId,
                  date: viewData[key].date,
                  time: viewData[key].time
                }
              );
            }
          }
          return views;
        }),
        tap(views => {
          this._views.next(views);
        })
      );
  }

  addView(newView: View) {
    let generatedId: string;
return this.authService.token.pipe(take(1),switchMap(token => {

  return this.http
    .post<{ name: string }>(
      `https://propertiestag-25d9d.firebaseio.com/views.json?auth=${token}`,
      { ...newView, id: null }
    )
}),switchMap(resData => {
          generatedId = resData.name;
          return this.views;
        }),
        take(1),
        tap(views => {
          newView.id = generatedId;
          this._views.next(views.concat(newView));
        })
      );
  }
 

  cancelView(viewId: string) {
    return this.authService.token.pipe(take(1), switchMap(token => {

      return this.http
        .delete(
          `https://propertiestag-25d9d.firebaseio.com/views/${viewId}.json?auth=${token}`
        )
    }),switchMap(() => {
          return this.views;
        }),
        take(1),
        tap(views => {
          this._views.next(views.filter(b => b.id !== viewId));
        })
      );
  }
}