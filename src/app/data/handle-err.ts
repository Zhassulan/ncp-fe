import {HttpErrorResponse} from '@angular/common/http';
import * as HttpStatus from 'http-status-codes';
import {throwError} from 'rxjs';
import {MSG} from '../settings';

export class HandleErr {

    static intercept(error: HttpErrorResponse){
        let errCpy = JSON.parse(JSON.stringify(error));
        switch (error.status) {
            case HttpStatus.NOT_FOUND:
                errCpy.message = MSG.notFound;
                return throwError(errCpy);
                break;
            case HttpStatus.SERVICE_UNAVAILABLE:
                errCpy.message = MSG.errService;
                return throwError(errCpy);
                break;
            case HttpStatus.FORBIDDEN:
                errCpy.message = MSG.accessDenied;
                return throwError(errCpy);
                break;
            default:
                errCpy.message = error.error;
                break;
        }
        return throwError(errCpy);
    }

}
