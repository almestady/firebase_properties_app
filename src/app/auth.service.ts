import { Injectable, NgZone } from '@angular/core';
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
import { BehaviorSubject, from, throwError } from 'rxjs';
import { Observable } from '@mobiscroll/angular-lite/src/js/util/observable';
// import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { tap, catchError, concatMap, shareReplay, take, map } from 'rxjs/operators';
import { resolve } from 'url';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import createAuth0Client from '@auth0/auth0-spa-js';
import { NavController, Platform } from '@ionic/angular';

import { TokenDatabaseService } from './database/token-database.service';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { EmailValidator } from '@angular/forms';
import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean; 
}



@Injectable()
export class AuthService {
  private _user = new BehaviorSubject<User>(null);
  
   
constructor(
  private http: HttpClient
){}


get userId() {
  return this._user.asObservable().pipe(
    map(user => {
      if (user) {
        return user.id;
      } else {
        return null;
      }
    })
  );
}

get userIsAuthenticated() {
  return this._user.asObservable().pipe(
    map(user => {
    if(user){
      return !!user.token
    } else {
      return false;
    }
  }
    )
    ) 
}


signup(email: string, password: string){
  return this.http.post<AuthResponseData>
  (`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
   {email: email, password: password, returnSecureToken: true}
   ).pipe(tap(this.setUserData.bind(this) ))
}

login(email: string, password: string) {
 return  this.http.post<AuthResponseData>
   (`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
 {email:email, password: password} 
 ).pipe(tap(this.setUserData.bind(this) ))

}

logout() {
  this._user.next(null);
}

  private setUserData(userData: AuthResponseData) {
  
    const expirationTime = new Date(
      new Date().getTime() + (+userData.expiresIn * 1000)
      );

    this._user.next(
      new User(
        userData.localId,
        userData.email,
        userData.idToken,
        expirationTime
        )
      )
}

}