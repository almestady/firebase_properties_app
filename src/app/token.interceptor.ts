// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
// import { AuthService } from './auth.service';
// // import { Observable } from 'rxjs/internal/Observable';
// import { Observable, throwError, of, BehaviorSubject, from } from 'rxjs';
// import {map, mergeMap, catchError, shareReplay, switchMap } from 'rxjs/operators';
// import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
// import { Storage } from '@ionic/storage';
// import { environment } from 'src/environments/environment';
// import { AlertController } from '@ionic/angular';

// import {  NgZone, Injectable, Injector } from '@angular/core';
// import { Router, ActivatedRoute, Data } from '@angular/router';
// import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
// import { AUTH_CONFIG } from './auth/auth.config';
// import Auth0Cordova from '@auth0/cordova';
// import * as auth0 from 'auth0-js';
// import { resolve } from 'url';
// import { Platform } from '@ionic/angular';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
// import { AuthResolver } from './auth-resolver.service';
// import { TokenDatabaseService, Token } from './database/token-database.service';
// import { async } from '@angular/core/testing';



// @Injectable({
//   providedIn: 'root',
//  }) 
// export class TokenInterceptor implements HttpInterceptor {
//   request: any;
//   // Variable to hold Auth0 client
//   private auth0Client$: Auth0Client;
//   // Variable to hold local userToken
//   private token:string;
//   private AUTH_HEADER = "Authorization";
  
//   access_token: string;
//   id_token: string;
//   expires_at: string;
//   user: any;
//   authState = new BehaviorSubject(false);
//   Auth0 = new auth0.WebAuth(AUTH_CONFIG);
//  Client = new Auth0Cordova(AUTH_CONFIG);
//   loggedIn: boolean;
//   loading = true;
//    tokens: Token[] = [];
//   // private authService: AuthService;

//   constructor(
//     private alertController: AlertController,
//     public router: Router,
//   public zone: NgZone,
//   private platform: Platform,
//   public safariViewController: SafariViewController,
//     public auth: AuthService,
//     private storage: Storage,
//     private inj: Injector,
//     private route: ActivatedRoute,
//     public authResolver: AuthResolver,
//     // private tokenDB: TokenDatabaseService 
//     ) {
//       console.log('Interceptor Constructor')
      
//       // this.tokenDB.getDatabaseState().subscribe(rdy => {
//       //   if (rdy) {
//       //     console.log('Ready State')
//       //     this.tokenDB.getToken().subscribe(tokens=> {
//       //       this.tokens = tokens;
//       //     })
//       //   }
//       // })
//     }
    
    
//     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      
//         //   this.tokenDB.getDatabaseState().subscribe(state=> console.log(state))
//         // if(request.url === 'https://almestady.auth0.com'){

//         //   request = request.clone({
//         //       setHeaders: { 
//         //         // Authorization: this.auth.createAuthHeaderValue()
//         //         Authorization: 'Bearer ' + this.tokenDB.tokens                            
//         //       }
            
//         // })
//         // }
//         // return next.handle(request)
         
           
        
//       // if (request.url === 'https://almestady.auth0.com/*') {
//       //   next.handle(request)
//       // }
//       if(this.auth.accessToken){
//           console.log('Accepted...', this.auth.accessToken )
//           return from(this.storage.get('accessToken')).pipe(
//             switchMap(token => {
//               // alert(this.auth.accessToken)
//               if (this.auth.accessToken) {
//                 request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + 
//                 this.auth.accessToken) });
//                 request = request.clone({ headers: request.headers.set('accept', 'application/json') });
//             }
//             if (!request.headers.has('Content-Type')) {
//               request = request.clone({ headers: request.headers.set('content-Type', 'application/json') });
//           }
//             return next.handle(request).pipe(
//               map((event: HttpEvent<any>) => {
//                   if (event instanceof HttpResponse) {
//                       // do nothing for now
//                   }
//                   return event;
//               }),
//               catchError((error: HttpErrorResponse) => {
//                   const status =  error.status;
//                   const reason = error && error.error.reason ? error.error.reason : '';
  
//                   this.presentAlert(status, reason);
//                   return throwError(error);
//               })
//           );
//             })
//           )
          
//           // request = request.clone({
//           //   setHeaders: { 
//           //     // Authorization: this.auth.createAuthHeaderValue()
//           //     Authorization: 'Bearer ' + this.auth.accessToken
//           //   }
//           // });
       
//           // return next.handle(request)
//         }
//     //     return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
//     //       // Auto logout if 401 response returned from api
//     //       if (error.status === 401) {
//     //         console.log('UNAUTHORIZED')
//     //       }
//     //       return throwError(error);
//     //     }));
//     }
//     async presentAlert(status, reason) {
//       const alert = await this.alertController.create({
//           header: status + ' Error',
//           subHeader: 'Subtitle',
//           message: reason,
//           buttons: ['OK']
//       });

//       await alert.present();
//   }
      
//     }
    
    
    
    
    
    
    
    
    
//     //  async setAccessToken() {
//     //     this.Client.subscribe(async (client: Auth0Client) => {
//     //       this.token = await client.getTokenSilently();
//     //     });   
//     //   }
// //   async getAuth0Token () {
    
// //        this.auth0Client$ = await this.auth.Client;

// //        const token = await this.auth0Client$.getTokenSilently();
// //        console.log(token)
// //       // const token = await this.auth.storage.get('access_token')
// //        await this.storeToken( token );
// //        await this.getToken();
// //      }

// //      /**
// // //   * Sets the token in local storage
// // //   */
// // async storeToken ( token: string ) {
// //  await this.storage.set( 'userToken', token );
// // }

// // async getToken () {
// // this.token = await this.auth.storage.get( 'userToken' );
// // }

// // async getLogin(){
// // // setTimeout(function () {
// //   console.log('Timeout Login....');
  
// //   await this.auth.login()
// //   await this.auth.storage.get('profile')
// //   // this.timeout();
// //   // }, 3000);
// // }
//   // async getTok(){
//   //   if(!this.auth.authState.value){
//   //     await this.auth.login()
//   //     await this.auth.getToken().then(token => {
  
//   //       this.token = token
//   //     }
//   //     )
//   //   }
//   // }
      
//   // setAccessToken() {
//   //   this.auth0Client$.subscribe(async (client: Auth0Client) => {
//   //     this.AccessToken = await client.getTokenSilently();});   
//   // }

// // import { Injectable } from '@angular/core';
// // import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
// // import { AuthService } from './auth/auth.service';
// // // import { Observable } from 'rxjs/internal/Observable';
// // import { Observable, throwError, of, BehaviorSubject, from } from 'rxjs';
// // import { mergeMap, catchError, shareReplay } from 'rxjs/operators';
// // import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
// // import { Storage } from '@ionic/storage';
// // import { environment } from 'src/environments/environment';

// // @Injectable()
// // export class TokenInterceptor implements HttpInterceptor {
// //   request: any;
// //   // Variable to hold Auth0 client
// //   private auth0Client: Auth0Client;
// //   // Variable to hold local userToken
// //   private token:string;
// //   private AUTH_HEADER = "Authorization";

 
// //   constructor(
// //     public auth: AuthService,
// //     public storage: Storage
// //     ) {
      
// //     }

// //    async setAccessToken() {
// //       this.auth.Client.subscribe(async (client: Auth0Client) => {
// //         this.token = await client.getTokenSilently();});   
// //     }

// //     async getAuth0Token () {
      
// //         //  this.auth0Client = await this.auth.Client;
// //        this.setAccessToken()
// //          const token = await this.auth0Client.getTokenSilently();
// //          console.log(token)
// //         // const token = await this.auth.storage.get('access_token')
// //          await this.storeToken( token );
// //          await this.getToken();
// //        }

// //        /**
// // //   * Sets the token in local storage
// // //   */
// //  async storeToken ( token: string ) {
// //    await this.storage.set( 'userToken', token );
// //  }
// // //  /**
// // //   * pulls local storage token and sets it in userToken
// // //   */
// //  async getToken () {
// //    this.token = await this.auth.access_token;
// //  }


 
// //   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
// // this.getToken()
// //     // return this.auth.getTokenSilently$().pipe(
// //     //   mergeMap(token => {
// //     //     const tokenReq = request.clone({
// //     //       setHeaders: { Authorization: 'Bearer ' + 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik16UTBORUZCTkRFd00wRkROVGN3UTBJelFqY3lRekJFUXpVeFFUZ3lRa0V4TmpkRk5qUXdRUSJ9.eyJpc3MiOiJodHRwczovL2FsbWVzdGFkeS5hdXRoMC5jb20vIiwic3ViIjoiWHNMdkZqRldhSmZMYnpEeTZicmhuZ3VJS2hJaGhwaGFAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcHJvcGVydGllcy1nb2xhbmctYXBpIiwiaWF0IjoxNTk0NzkwNDIzLCJleHAiOjE1OTQ4NzY4MjMsImF6cCI6IlhzTHZGakZXYUpmTGJ6RHk2YnJobmd1SUtoSWhocGhhIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.B6IvsSKqWd8RSyNwDVBGoiaYI9udWm8cEjStfu8295UnzjadbBxp9l71WqG7z6EXMLSifLqAsVOuJ9sUxjcNRhil5YHjEzDNEDx1ouu4dMbf-mwrajEKIXuVwayKbUCwRPkMBFfVHeZF2-dta5X9p7NUVsyoYY44yxPZ-HLocvtp2psOPefyo0-gtSgt1YhTlsTsecfZTgKwepJNVGM1FMZakWXJpnwkC8nQmvmnqU2VdBOFIIJoGrcD_18SWtRwrdLI8m2FvnkVk9aj-NTsEJUt1dGy-UPE3AIgNe_gYC172mgP_zZm9Kat7GN8RGujnQ0lEuTumqshCk6I-1Bj_A' }
// //     //     });
// //     //     return next.handle(tokenReq);
// //     //   }),
// //     //   catchError(err => throwError(err))
// //     //   )

// //     // if(request.url === 'home'){return next.handle(request);}
// //     // this.setAccessToken()
// //     // if (!request.headers.has('Content-Type')) {
// //     //   request = request.clone({
// //     //     headers: request.headers.set('Content-Type', 'application/json')
// //     //   });
// //     // }
// // // if( request.url ===  'properties/tabs') {
// //       // this.auth.tokenValue.subscribe(token => {
// //       // if(this.auth.access_token){
// //         request = request.clone({
// //           setHeaders: { 
// //             // Authorization: 'Bearer ' + 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik16UTBORUZCTkRFd00wRkROVGN3UTBJelFqY3lRekJFUXpVeFFUZ3lRa0V4TmpkRk5qUXdRUSJ9.eyJpc3MiOiJodHRwczovL2FsbWVzdGFkeS5hdXRoMC5jb20vIiwic3ViIjoiWHNMdkZqRldhSmZMYnpEeTZicmhuZ3VJS2hJaGhwaGFAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcHJvcGVydGllcy1nb2xhbmctYXBpIiwiaWF0IjoxNTk0ODc4NTIwLCJleHAiOjE1OTQ5NjQ5MjAsImF6cCI6IlhzTHZGakZXYUpmTGJ6RHk2YnJobmd1SUtoSWhocGhhIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.OqubFX1-itr2i7bKmLQG4_NvksW135gIVNI5DOgNjLfk1ieukDtozm7R-fmXikAFMgsMiW0mIeTYu4e6M1LlorGU6kBAm4wDH1VuA4KBJjEyYiRprXMakCF3GW-Eo6RSf064owI_rlvXURYCqb6HSf69ZWePmpEkRsuC_23cf9tH-4aCM1p_nMruD8DkMa1u0tMHj-FkVOSq9MVm8q8XNEZWxeygA6B3mmSowXZaviIkpUKoYLMnN2_kZ78zthVCsZg6a-QpsRLib9ZPb5aqA7p0GvF_qaSZaYt5m7LlTuzWRMy23wOSFBnLFvtAegPqD-ORiOx5Lu3oDUS0TKTSNg'
            
// //             Authorization: 'Bearer ' + this.auth.tokenValue.value
// //           }
// //         });
// //       // }else{
// //         // this.auth.login()
// //       // }
// //       // })
// //     // }
// //       return next.handle(request)
// //     }
    
    
    


// // private refreshAccessToken(): Observable<any> {
// //   return of("secret token");
// // }

// // private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
// //   // If we do not have a token yet then we should not set the header.
// //   // Here we could first retrieve the token from where we store it.
// //   if (!this.token) {
// //     return request;
// //   }
// //   // If you are calling an outside domain then do not add the token.
// //   if (!request.url.match(/www.mydomain.com\//)) {
// //     return request;
// //   }
// //   return request.clone({
// //     headers: request.headers.set(this.AUTH_HEADER, "Bearer " + this.token)
// //   });
// // }
// // }
