import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {NcpPayment} from '../model/ncp-payment';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/internal/operators';
import {DateRange} from './date-range';
import {RestResponse} from './rest-response';
import {httpOptions} from '../settings';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {FilePayment} from '../equipment/model/file-payment';

@Injectable()
export class DataService {

    constructor(private _http: HttpClient) {
    }

    errorHandler(error: HttpErrorResponse)  {
        return Observable.throwError(error.message || "Ошибка сервера.");
    }

    getNcpPayments(dr: DateRange): Observable <NcpPayment []> {
        return this._http.post<NcpPayment []>(environment.urlGetNcpPaymentsRange, dr, httpOptions).catch(this.errorHandler);
    }

    public getNcpPaymentsJson(): Observable<any> {
        return this._http.get("./assets/payments.json").catch(this.errorHandler);
    }

    paymentToTransit(id: number): Observable <RestResponse> {
        return this._http.post <RestResponse> (environment.urlPaymentToTransit + '?id=' + id, httpOptions).catch(this.errorHandler);
    }

    deleteTransitPayment(id: number, user: string) : Observable <RestResponse> {
        return this._http.post <RestResponse> (environment.urlDeleteTransitPayment + '?id=' + id + '&user=' + user, httpOptions).catch(this.errorHandler);
    }

    postFilePayment(formData: FormData): Observable<FilePayment> {
        return this._http.post<FilePayment>(environment.urlUploadEquipment, formData, {reportProgress: true}).catch(this.errorHandler);
    }

}


