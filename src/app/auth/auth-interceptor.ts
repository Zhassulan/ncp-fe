import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/internal/operators';
import {NotificationsService} from 'angular2-notifications';
import {AuthService} from './auth.service';
import * as HttpStatus from 'http-status-codes';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router,
                private notifService: NotificationsService,
                private authService: AuthService
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === HttpStatus.UNAUTHORIZED) {
                    this.authService.logout();
                    this.router.navigate(['login']);
                }
                return throwError(error);
            })
        );
    }

}

