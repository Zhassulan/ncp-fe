import {HttpErrorResponse} from '@angular/common/http';
import * as HttpStatus from 'http-status-codes';
import {throwError} from 'rxjs';
import {MSG} from '../settings';

export class HandleErr {

    static handleError(error: HttpErrorResponse){
        if (error.status == HttpStatus.NOT_FOUND ||
            error.status == HttpStatus.SERVICE_UNAVAILABLE) return throwError(MSG.serviceErr);
        return throwError(error);
    }

}
