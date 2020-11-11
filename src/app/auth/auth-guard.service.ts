import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({ providedIn: 'root', })
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService) {   }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authService.getUser();
        return user.length > 0;
    }

}
