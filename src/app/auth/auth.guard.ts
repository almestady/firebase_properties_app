import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment, Router, CanActivate, CanActivateChild } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, tap, switchMap, map } from 'rxjs/operators';
import { AuthService } from '../auth.service';
// import { TokenInterceptor } from '../token.interceptor';

@Injectable({
  providedIn: 'root'
})


export class AuthGuard implements CanActivate {
 
  constructor(private router: Router, private afAuth: AngularFireAuth) { }
 
  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      take(1),
      map(user => !!user),
      tap(authenticated => {
        if (!authenticated) {
          this.router.navigateByUrl('auth');
        }
      })
    ); 
  }
}


// export class AuthGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}
//   canActivate(): Observable<boolean> | Promise<boolean> | boolean {
//     console.log("Auth gard started")
//     return this.authService.userIsAuthenticated.pipe(
//       take(1),
//       switchMap(isAuthenticated => {
//         if (!isAuthenticated) {
//           return this.authService.autoLogin();
//         } else {
//           return of(isAuthenticated);
//         }
//       }),
//       tap(isAuthenticated => {
//         if (!isAuthenticated) {
//           this.router.navigateByUrl('/auth');
//         }
//       })
//     );
//   }
// }
