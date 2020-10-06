import { Resolve, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot } from '@angular/router'
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root',
   })
export class AuthResolver implements Resolve<string> {
    
    constructor(private authService: AuthService) {
        }

        resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> | Promise<string> | string {
          return this.authService.id_token;
        }
}