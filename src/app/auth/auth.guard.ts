import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment, Router, CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
// import { TokenInterceptor } from '../token.interceptor';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    console.log("Auth gard started")
    return this.authService.userIsAuthenticated.pipe(take(1),tap(isAuthenticated => {
      if (!isAuthenticated) {
        this.router.navigateByUrl('/auth');
      }

    }));

     }
}
