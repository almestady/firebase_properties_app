import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment, Router, CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { TokenInterceptor } from '../token.interceptor';

@Injectable({
  providedIn: 'root'
})

// export class AuthGuard implements CanActivate, CanActivateChild {
//   constructor(
//     private auth: AuthService,
//     private router: Router
//     ) {}

//   canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // console.log('Guard start')
    // if(this.auth.accessToken) {
    //   return true;
    // } else{
    //   // this.auth.login()
    //   return false;
    // }
    // return true;
  //  return this.auth.isAuthenticated()
  //    .then(
  //      (authenticate: boolean)=> {
  //         if(authenticate){
  //           return true;
  //         }else{
  //           this.router.navigate(['home'])
  //           return false;
  //         }
  //    })  
// }

// canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
//   return this.canActivate();
// }
// }

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    console.log("Auth gard started")
       if (!this.authService.userIsAuthenticated) {
         this.router.navigate(['/', 'auth']);
       }
       return this.authService.userIsAuthenticated;
     }
}
