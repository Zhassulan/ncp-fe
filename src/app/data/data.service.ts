import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {NcpPayment} from '../model/ncp-payment';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/internal/operators';
import {DateRange} from '../date-range';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root',
})
export class DataService {

    baseEndpoint: string = environment.baseEndpoint;

    constructor(private _http: HttpClient) {
    }

    getNcpPayments(dr: DateRange): Observable <NcpPayment []> {
        return this._http.post<NcpPayment []>(this.baseEndpoint + 'ncpPayments', dr, httpOptions);
    }

    public getNcpPaymentsJson(): Observable<any> {
        return this._http.get("./assets/payments.json")
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    };

}


