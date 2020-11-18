import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Like } from '../properties/property.model';
import { switchMap, take, tap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private _likes = new BehaviorSubject<Like[]>([]);

  private likesCollection: AngularFirestoreCollection<Like>;
  likes: Observable<Like[]>;

  // get likes() {
  //   return this._likes.asObservable();
  // }

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private afStorage: AngularFireStorage,
    public afs: AngularFirestore
  ) { 
    this.likesCollection = this.afs.collection<Like>('likes');
    this.likes = this.likesCollection.valueChanges({ idField: 'id' }) as Observable<Like[]>;
  }
  
  getLikes() {
    return this.afs.collection('likes').valueChanges({ idField: 'id' }) as Observable<Like[]>;
  }
  
addLike(like: Like){
  const myLike = {...like};
    return from(this.afs.collection('likes').add(myLike));
}
  
// updateProperty(property: Property) {
//   // convert object of type Employee to JSON object
//   // because Firestore understand JSON
//   const employeeObject = {...property};
//   this.afs.doc('properties/' + property.id).update(property);
// }

cancelLike(likeId:string) {
 return from(this.afs.doc('likes/' + likeId).delete());
}
  // getLikes() {
  //   return this.authService.token.pipe(take(1), switchMap(token => {

  //     return this.http
  //       .get<{ [key: string]: Like }>(
  //         `https://propertiestag-25d9d.firebaseio.com/likes.json?auth=${token}`
  //       )
  //   }),map(likeData => {
  //         const likes = [];
  //         for (const key in likeData) {
  //           if (likeData.hasOwnProperty(key)) {
  //             likes.push(
  //               {
  //                 id: key,
  //                 propertyId: likeData[key].propertyId,
  //                 guestId: likeData[key].guestId,
  //                 date: likeData[key].date,
  //                 time: likeData[key].time
  //               }
  //             );
  //           }
  //         }
  //         return likes;
  //       }),
  //       tap(likes => {
  //         this._likes.next(likes);
  //       })
  //     );
  // }

  // addLike(newLike: Like) {
  //   let generatedId: string;
  //  return this.authService.token.pipe(take(1), switchMap(token => {

  //    return this.http
  //      .post<{ name: string }>(
  //        `https://propertiestag-25d9d.firebaseio.com/likes.json?auth=${token}`,
  //        { ...newLike, id: null }
  //      )
  //  }),switchMap(resData => {
  //         generatedId = resData.name;
  //         return this.likes;
  //       }),
  //       take(1),
  //       tap(likes => {
  //         newLike.id = generatedId;
  //         this._likes.next(likes.concat(newLike));
  //       })
  //     );
  // }
 

  // cancelLike(likeId: string) {
  //   return this.authService.token.pipe(take(1), switchMap(token => {

  //     return this.http
  //       .delete(
  //         `https://propertiestag-25d9d.firebaseio.com/likes/${likeId}.json?auth=${token}`
  //       )
  //   }),switchMap(() => {
  //         return this.likes;
  //       }),
  //       take(1),
  //       tap(likes => {
  //         this._likes.next(likes.filter(b => b.id !== likeId));
  //       })
  //     );
  // }
}
