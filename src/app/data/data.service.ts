import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {NcpPayment} from '../payments/model/ncp-payment';
import {Observable} from 'rxjs';
import {DateRange} from './date-range';
import {RestResponse} from './rest-response';
import {httpOptions} from '../settings';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {FilePayment} from '../equipment/model/file-payment';
import {RawPayment} from '../payments/model/raw-payment';
import {PaymentParam} from '../payments/model/payment-param';
import {PaymentDetail} from '../payments/model/payment-detail';
import {NcpPaymentDetails} from '../payments/model/ncp-payment-details';
import {Equipment} from '../payments/model/equipment';
import {PaymentParamEq} from '../payments/model/payment-param-eq';

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

    postFilePayment(formData: FormData): Observable<any> {
        return this._http.post<FilePayment>(environment.urlUploadEquipment, formData).catch(this.errorHandler);
    }

    newRawPayment(payment: RawPayment): Observable<RestResponse> {
        return this._http.post<RestResponse>(environment.urlNewRawPayment, payment, httpOptions).catch(this.errorHandler);
    }

    getNcpPaymentByRawId(id: number): Observable<RestResponse>   {
        return this._http.post<RestResponse>(environment.urlGetNcpPaymentByRawId + '?id=' + id, httpOptions).catch(this.errorHandler);
    }

    getPaymentDetails(paymentId: number): Observable<RestResponse>   {
        return this._http.post<RestResponse>(environment.urlGetPaymentDetails + '?id=' + paymentId, httpOptions).catch(this.errorHandler);
    }

    distributePayment(params: PaymentParamEq): Observable<RestResponse>  {
        return this._http.post<RestResponse>(environment.urlDistributePayment, params, httpOptions).catch(this.errorHandler);
    }

    newPaymentDetail(detail: NcpPaymentDetails): Observable<RestResponse>   {
        return this._http.post<RestResponse>(environment.urlNewPaymentDetail, detail, httpOptions).catch(this.errorHandler);
    }

    /**
     * Добавить новую запись хранения доп полей для оборудования
     * @param {number} paymentDetailId
     * @param {Equipment} equipment
     * @returns {Observable<RestResponse>}
     */
    newEquipment(paymentDetailId: number, equipment: Equipment): Observable<RestResponse>   {
        return this._http.post<RestResponse>(environment.urlNewEquipment + '?id=' + paymentDetailId, equipment, httpOptions).catch(this.errorHandler);
    }

    getPayment(id: number): Observable<RestResponse>   {
        return this._http.post<RestResponse>(environment.urlGetPayment + '?id=' + id, httpOptions).catch(this.errorHandler);
    }

    getPaymentEquipments(id: number): Observable<RestResponse>   {
        return this._http.post<RestResponse>(environment.urlGetPaymentEquipments + '?id=' + id, httpOptions).catch(this.errorHandler);
    }

}
