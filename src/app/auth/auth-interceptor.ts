import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/internal/operators';
import {NotificationsService} from 'angular2-notifications';
import {AuthService} from './auth.service';
import {MatSnackBar} from '@angular/material';
import {msgs} from '../settings';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router,
                private notifService: NotificationsService,
                private authService: AuthService,
                private snackBar: MatSnackBar) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this.openSnack(msgs.msgNoRights);
                    this.authService.logout();
                    this.router.navigate(['login']);
                }
                return throwError(error);
            })
        );
    }

    openSnack(msg) {
        this.snackBar.open(msg, null,{ duration: 5000});
    }

}

