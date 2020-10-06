import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Like } from '../properties/property.model';
import { switchMap, take, tap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private _likes = new BehaviorSubject<Like[]>([]);

  get likes() {
    return this._likes.asObservable();
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  getLikes() {
    return this.http
      .get<{ [key: string]: Like }>(
        `https://propertiestag-25d9d.firebaseio.com/likes.json`
      )
      .pipe(
        map(likeData => {
          const likes = [];
          for (const key in likeData) {
            if (likeData.hasOwnProperty(key)) {
              likes.push(
                {
                  id: key,
                  propertyId: likeData[key].propertyId,
                  guestId: likeData[key].guestId,
                  date: likeData[key].date,
                  time: likeData[key].time
                }
              );
            }
          }
          return likes;
        }),
        tap(likes => {
          this._likes.next(likes);
        })
      );
  }

  addLike(newLike: Like) {
    let generatedId: string;

    return this.http
      .post<{ name: string }>(
        'https://propertiestag-25d9d.firebaseio.com/likes.json',
        { ...newLike, id: null }
      )
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.likes;
        }),
        take(1),
        tap(likes => {
          newLike.id = generatedId;
          this._likes.next(likes.concat(newLike));
        })
      );
  }
 

  cancelLike(likeId: string) {
    return this.http
      .delete(
        `https://propertiestag-25d9d.firebaseio.com/likes/${likeId}.json`
      )
      .pipe(
        switchMap(() => {
          return this.likes;
        }),
        take(1),
        tap(likes => {
          this._likes.next(likes.filter(b => b.id !== likeId));
        })
      );
  }
}
