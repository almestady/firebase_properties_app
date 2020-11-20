import { Injectable, NgZone, OnDestroy } from '@angular/core';
import * as auth0 from 'auth0-js';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
// import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { Storage } from '@ionic/storage';
import { AUTH_CONFIG } from './auth/auth.config';
import Auth0Cordova from '@auth0/cordova';
(window as any).global = window;
declare let cordova: any;
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { BehaviorSubject, from, of, throwError } from 'rxjs';
// import { Observable } from '@mobiscroll/angular-lite/src/js/util/observable';
// import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { tap, catchError, concatMap, shareReplay, take, map, mergeMap } from 'rxjs/operators';
import { resolve } from 'url';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import createAuth0Client from '@auth0/auth0-spa-js';
import { NavController, Platform } from '@ionic/angular';

import { TokenDatabaseService } from './database/token-database.service';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { EmailValidator } from '@angular/forms';
// import { User } from './user.model';
import { Plugins } from '@capacitor/core'
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Message } from './services/chat.service';
import 'rxjs/add/observable/fromPromise';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean; 
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
}

@Injectable()
export class AuthService implements OnDestroy {
  private _user = new Observable<firebase.User>(null);
  private activeLogoutTimer: any;
  public signedIn: Observable<any>;
  public _userId = new BehaviorSubject<string>(null);
  // user: Observable<firebase.User>;

constructor(
  private http: HttpClient,
  public afs: AngularFirestore,
  public afAuth: AngularFireAuth
){

  this._user = afAuth.authState;
  this._user.subscribe(user => {
    this._userId.next(user.uid)
  })
  // this.signedIn = new Observable((subscriber) => {
  //           this.auth.onAuthStateChanged(subscriber);
  //       });
  // this.afAuth.onAuthStateChanged((user) => {
  //   if(user){
  //     this._user.next(user); 
  //     this._userId.next(user.uid);      
  //   }
  // });
}

get user(){
  return this._user
}



get userId(){
  return this._userId.asObservable()
}


// get userId() {
//   return this._user.asObservable().pipe(
//     map(user => {
//       if (user) {
//         return user.id;
//       } else {
//         return null;
//       }user
//     })
//   );
// }

get token(){
  return this._user.pipe(
    map(user => {
      if (user) {
        return user;
      } else {
        return null;
      }
    })
  );
}


get userIsAuthenticated() {
  return this._user.pipe(
    map(user => {
      if (user) {
        // return !!user.token;
      } else {
        return false;
      }
    })
  );
}


async signup({ email, password, displayName }): Promise<any> {
  const credential = await this.afAuth.createUserWithEmailAndPassword(
    email,
    password
  );

  const uid = credential.user.uid;
  
  return  from( this.afs.doc(
    `users/${uid}`
  ).set({
    uid,
    email: credential.user.email,
    displayName: credential.user.displayName
  }) )
}

// signup(email: string, password: string){
//   return this.http.post<AuthResponseData>
//   (`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
//    {email: email, password: password, returnSecureToken: true}
//    ).pipe(tap(this.setUserData.bind(this) ))
// }

// login(email: string, password: string) {
//  return  this.http.post<AuthResponseData>
//    (`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
//  {email:email, password: password, returnSecureToken: true} 
//  ).pipe(tap(this.setUserData.bind(this) ))

// }

 login(email: string, password: string) {
  try {
      if (!email || !password) throw new Error('Invalid email and/or password');
  return  from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(tap(data => {
    // this._user.next(data.user);
  }))
    // .subscribe(credintals => {
    //   this._userId.next(credintals.user.uid);
    //   console.log(credintals.user.uid)
    // })
      // return true;
  } catch (error) {
      console.log('Sign in failed', error);
      // return false;
  }
}

getMessages(){
  return this.afs.collection('messages').valueChanges({ idField: 'id' });
}

logout() {
  if(this.activeLogoutTimer){
    clearTimeout(this.activeLogoutTimer);
  }
  // this._user.next(null);
  Plugins.Storage.remove({key: 'authData'})
}

  private setUserData(userData: AuthResponseData) {
  
    const expirationTime = new Date(
      new Date().getTime() + (+userData.expiresIn * 1000)
      );
   const user =  {
    uid:userData.localId,
    email:userData.email,
    // userData.idToken,
    // expirationTime
   }
    // this._user.next(user);
    // this.autoLogout(user.tokenDuration);
    this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString(),  userData.email)
}

private storeAuthData
(
userId: string,
token: string,
tokenEpriationDate: string,
email: string
    ){
  const data =  JSON.stringify({userId: userId, token: token, tokenExpirationDate: tokenEpriationDate})
  Plugins.Storage.set({key:  'authData', value:data})
}

autoLogin(){
 return from(Plugins.Storage.get({key: 'authData'})).pipe(map(storedData => {
  if(!storedData || !storedData.value){
     return null; 
  }
  const parsedData = JSON.parse(storedData.value) as {token: string; tokenExpirationDate: string; userId: string; email: string}
  const expirationTime = new Date(parsedData.tokenExpirationDate);
  if(expirationTime <= new Date()){
    return;
  }
  // const user = new User(parsedData.userId, parsedData.email, parsedData.token, expirationTime)

  // return user;
  }),
  tap(user => {
    if(user){
      // this._user.next(user)
      this.autoLogout(user.tokenDuration);
    }
  }),
  map(user => {
    return !!user;
  })
  )
}

private autoLogout(duration: number) {
  if(this.activeLogoutTimer){
    clearTimeout(this.activeLogoutTimer);
  }
 this.activeLogoutTimer =  setTimeout(()=> {
     this.logout()
   }, duration)
}

ngOnDestroy(){
  if(this.activeLogoutTimer){
    clearTimeout(this.activeLogoutTimer);
  }
}

}