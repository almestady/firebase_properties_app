import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment, Router, CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
// import { TokenInterceptor } from '../token.interceptor';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    console.log("Auth gard started")
       if (!this.authService.userIsAuthenticated) {
         this.router.navigateByUrl('auth');
       }
       return this.authService.userIsAuthenticated;
     }
}
