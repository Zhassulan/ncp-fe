import {HttpErrorResponse} from '@angular/common/http';
import {Message} from './message';
import * as HttpStatus from 'http-status-codes';
import {throwError} from 'rxjs';

export class HttpErrHandler {

    static handleError(error: HttpErrorResponse) {
        let errorMessage;
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
            errorMessage = Message.ERR.CLIENT;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
            switch (error.status) {
                case HttpStatus.NOT_FOUND:
                    errorMessage= Message.ERR.NOT_FOUND;
                    break;
                case HttpStatus.SERVICE_UNAVAILABLE:
                    errorMessage = Message.ERR.SERVICE;
                    break;
                case HttpStatus.INTERNAL_SERVER_ERROR:
                    errorMessage = Message.ERR.SERVICE;
                    break;
                case HttpStatus.FORBIDDEN:
                    errorMessage = Message.ERR.ACCESS_DENIED;
                    break;
                case HttpStatus.UNAUTHORIZED:
                    errorMessage = Message.ERR.AUTH;
                    break;
                default:
                    errorMessage = error.error;
                    break;
            }
            return throwError(errorMessage);
        }
        // Return an observable with a user-facing error message.
        return throwError(errorMessage);
    }

}
