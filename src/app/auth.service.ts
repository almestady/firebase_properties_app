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
import { tap, catchError, concatMap, shareReplay  } from 'rxjs/operators';
import { resolve } from 'url';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import createAuth0Client from '@auth0/auth0-spa-js';
import { NavController, Platform } from '@ionic/angular';

import { TokenDatabaseService } from './database/token-database.service';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { EmailValidator } from '@angular/forms';

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
  private _userIsAuthenticated = false;
  private _userId = null;

   
constructor(
  private http: HttpClient
){}

get userId() {
  return this._userId;
}

get userIsAuthenticated() {
  return this._userIsAuthenticated;
}

signup(email: string, password: string){
  return this.http.post<AuthResponseData>
  (`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
   {email: email, password: password, returnSecureToken: true}
   )
}
login(email: string, password: string) {
  
 return  this.http.post<AuthResponseData>
   (`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
 {email:email, password: password} )

}

logout() {
  this._userIsAuthenticated = false;
}

  // auth0Client$ = (from(
  //   createAuth0Client({
  //     domain: 'almestady.auth0.com',
  //     client_id: '9mIsLa8Ta2P9BuQexn4pqAL6bJyERyKQ',
  //     redirect_uri: `${window.location.origin}`,
  //     audience: 
  //   })
  // ) as Observable<Auth0Client>).pipe(
  //   shareReplay(1), // Every subscription receives the same shared value
  //   catchError(err => throwError(err))
  //   );

//  private auth0Client$ = (from(
//     createAuth0Client({
      
//       // Needed for Auth0Cordova (capitalization: Id):
//       client_id: '9mIsLa8Ta2P9BuQexn4pqAL6bJyERyKQ',
//       domain: 'almestady.auth0.com',
//       redirect_uri: `${window.location.origin}`,
//       audience:'https://properties-golang-api'
//   })) ).pipe(
//     shareReplay(1), // Every subscription receives the same shared value
//     catchError(err => throwError(err)));
// // // lock = new Auth0Lock(AUTH_CONFIG.clientId, AUTH_CONFIG.domain);




// private _userIsAuthinticated = true;
// private _userId = 'aaa';

// Auth0 = new auth0.WebAuth(AUTH_CONFIG);
//   Client = new Auth0Cordova(AUTH_CONFIG);
 
 
//   loggedIn: boolean;
//   loading = true;
  
// constructor(
//   private platform: Platform,
//   private sqlite: SQLite,
//   private sqlitePorter: SQLitePorter,
//   private http: HttpClient,
//   public navCtrl: NavController,
//   public router: Router,
//   public zone: NgZone,
//   private storage: Storage ,
//   public safariViewController: SafariViewController
//   // private tokenDB: TokenDatabaseService
//   ) { 
//     //  this.tokenDB = new TokenDatabaseService(platform,sqlite, sqlitePorter, http)

//     console.log('AuthService Constructor')
//     // this.user = this.storage.getItem('profile')
//     this.storage.get('profile').then(user => this.user = user);
//     // this.accessToken = this.storage.getItem('accessToken')
//     this.storage.get('accessToken').then(token => this.accessToken = token);
//     // this.expires_at = this.storage.getItem('expires_at')
//     this.storage.get('expires_at').then(exp => {
//       if(exp){

//         this.loggedIn = Date.now() < JSON.parse(exp);
//         this.loading = false;
//       }
//     }); 
// }

// public accessToken: string;
//   id_token: string;
//   expires_at: string;
//   user: any;
//   token:any = null;

//   auth0 = new auth0.WebAuth({
//     clientID: environment.clientId,
//     domain: environment.domain,
//     responseType: 'token id_token',
//     audience: environment.audience,
//     redirectUri: environment.callback,
//     scope: 'openid'
//   });

//   authState = new BehaviorSubject(false);
//   tokenValue = new BehaviorSubject('')

//   get userId() {
//     return this._userId;
//   }

//  public setToken(){
//    this.storage.get('accessToken').then(token => {

//      this.token = token
//    })
//  }
  
//   isAuthenticated(){
//     const expiresAt = JSON.parse(this.expires_at || '{}');
//     return new Date().getTime() < expiresAt;
//     // const promise = new Promise(
//     //   (resolve, reject) => {
//     //     this.login()
//     //   }
//     //   )
//     //   return promise;
//     }
    
    
//     public login(): void {
//       this.auth0.authorize();
//     }
                
//   // get userId() {
//   //   if(this.user.user_id){

//   //     return this.user.user_id;
//   //   }else{
//   //     return '';
//   //   }
//   // }

//   public handleAuthentication(): void {
//     this.auth0.parseHash((err, authResult) => {
//       if (err) { console.log(err); }
//       if (!err && authResult && authResult.accessToken && authResult.idToken) {
//         window.location.hash = ''; 
//         this.setSession(authResult);  
//       }
//       // this.navCtrl.navigateBack('/properties/tabs');
//       this.router.navigate(['/properties/tabs']);
//     });
//   }

//   private setSession(authResult): void {
//     // Set the time that the Access Token will expire at
//     const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
//     this.storage.set('accessToken', authResult.accessToken)
//     this.accessToken = authResult.accessToken;
//     this.id_token = authResult.idToken;
//     this.expires_at = expiresAt;
//     this.authState.next(true);

//   //   this.tokenDB.getDatabaseState().subscribe(rdy => {
//   //     if (rdy) {
//   //       this.tokenDB.saveToken(this.accessToken).then(
//   //         token => {
//   //           console.log('access_token saved')
//   //           console.log(token)
//   //           // this.accessToken = '';
//   //         }
//   //       )
//   //     }
//   // })
//   }
  
//   public logout(): void {
//     this.accessToken = null;
//     this.id_token = null;
//     this.expires_at = null;
//     // Go back to the home route
//     this.router.navigate(['/']);
//   }
  
  
//   public createAuthHeaderValue(): string {
//     return 'Bearer ' + this.storage.get('accessToken');
//   }
  
  
}




    // this.Client.userInfo(this.accessToken, (err, profile) => {
    //   if (err) {
    //     throw err;
    //   }
    //   this.storage.set('profile', profile).then(val =>
    //     this.zone.run(() => this.user = profile)
    //   );
    // });
    // public isAuthenticated(): boolean {
    //   // Check whether the current time is past the
    //   // Access Token's expiry time
    //   const expiresAt = JSON.parse(this.expires_at || '{}');
    //   return Date.now() < expiresAt;
    // }
   
    // get userIsAuthinticated() {
    //   return this._userIsAuthinticated;
    // }
    // login() {
    //   this._userIsAuthinticated = true;
    // }
  
    // logout() {
    //   this._userIsAuthinticated = false;
    // }
// setAccessToken() {
                //   this.Client.subscribe(async (client: Auth0Client) => {
                //     this.accessToken = await client.getTokenSilently();});   
                // }
              
                
                // getTokenSilently$(options?){
                //   return this.auth0Client$.pipe(
                //     concatMap((client: Auth0Client) => from(client.getTokenSilently(options)))
                //   );
                //   // return this.auth0Client$.pipe(
                //   //   concatMap((client: Auth0Client) => from(client.getTokenSilently(options)))
                //   // );
                // }
               
              //   getTokenSilently$(options?): Observable<string>{
              //     return this.Client.pipe(
              //     concatMap((client: Auth0Client) => from(client.getTokenSilently(options))));
              //  }
              
              //   public get currentAuthTokenValue(){
              //     return this.tokenValue.value;
              // }

// login() {
//   this.loading = true;
//   const options = {
//     scope: 'openid profile offline_access'
//   };
//   // Authorize login request with Auth0: open login page and get auth results
//   this.Client.authorize(options, (err, authResult) => {
//     if (err) {
//       this.zone.run(() => this.loading = false);
//       throw err;
//     }
//     // Set access token
//     this.storage.set('accessToken', authResult.accessToken);
//     this.accessToken = authResult.accessToken;
//     // Set access token expiration
//     const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
//     this.storage.set('expires_at', expiresAt);
//     // Set logged in
//     this.loading = false;
//     this.loggedIn = true;
//     // Fetch user's profile info
//     this.Auth0.client.userInfo(this.accessToken, (err, profile) => {
//       if (err) {
//         throw err;
//       }
//       this.storage.set('profile', profile).then(val =>
//         this.zone.run(() => this.user = profile)
//       );
//     });
//   });
// }