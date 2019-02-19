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
import {NcpPaymentDetails} from '../payments/model/ncp-payment-details';
import {Equipment} from '../payments/model/equipment';
import {PaymentParamEq} from '../payments/model/payment-param-eq';

@Injectable()
export class DataService {

    constructor(private _http: HttpClient) {
    }

    /**
     *  Перехватчик ошибки от http метода
     * @param {HttpErrorResponse} error
     * @returns {Observable<never>}
     */
    errorHandler(error: HttpErrorResponse)  {
        return Observable.throwError(error.message || "Ошибка сервера.");
    }

    /**
     * Получить все платежи NCP
     * @param {DateRange} dr
     * @returns {Observable<NcpPayment[]>}
     */
    getNcpPayments(dr: DateRange): Observable <NcpPayment []> {
        return this._http.post<NcpPayment []>(environment.urlGetNcpPaymentsRange, dr, httpOptions).catch(this.errorHandler);
    }

    /**
     * Получить платежи из файла (быстрее для отладки), предварительно можно заготовить за какой день выгрузив из getNcpPayments
     * @returns {Observable<any>}
     */
    public getNcpPaymentsJson(): Observable<any> {
        return this._http.get("./assets/payments.json").catch(this.errorHandler);
    }

    /**
     * Перевести платёж на транзитный счёт NCP
     * @param {number} id
     * @returns {Observable<RestResponse>}
     */
    paymentToTransit(id: number): Observable <RestResponse> {
        return this._http.post <RestResponse> (environment.urlPaymentToTransit + '?id=' + id, httpOptions).catch(this.errorHandler);
    }

    /**
     * Удалить платёж на транзитном счету
     * @param {number} id
     * @param {string} user
     * @returns {Observable<RestResponse>}
     */
    deleteTransitPayment(id: number, user: string) : Observable <RestResponse> {
        return this._http.post <RestResponse> (environment.urlDeleteTransitPayment + '?id=' + id + '&user=' + user, httpOptions).catch(this.errorHandler);
    }

    /**
     * Отправить на загрузку и парсинг форму разноски в формате Excel по оборудованию, пример в папке проекта docs
     * @param {FormData} formData
     * @returns {Observable<any>}
     */
    postFilePayment(formData: FormData): Observable<any> {
        return this._http.post<FilePayment>(environment.urlUploadEquipment, formData).catch(this.errorHandler);
    }

    /**
     * создать грязный платёж
     * @param {RawPayment} payment
     * @returns {Observable<RestResponse>}
     */
    newRawPayment(payment: RawPayment): Observable<RestResponse> {
        return this._http.post<RestResponse>(environment.urlNewRawPayment, payment, httpOptions).catch(this.errorHandler);
    }

    /**
     * Получить платёж по ID грязного платежа
     * @param {number} id
     * @returns {Observable<RestResponse>}
     */
    getNcpPaymentByRawId(id: number): Observable<RestResponse>   {
        return this._http.post<RestResponse>(environment.urlGetNcpPaymentByRawId + '?id=' + id, httpOptions).catch(this.errorHandler);
    }

    /**
     * получить детали платежа
     * @param {number} paymentId
     * @returns {Observable<RestResponse>}
     */
    getPaymentDetails(paymentId: number): Observable<RestResponse>   {
        return this._http.post<RestResponse>(environment.urlGetPaymentDetails + '?id=' + paymentId, httpOptions).catch(this.errorHandler);
    }

    /**
     * разнести платёж
     * @param {PaymentParamEq} params
     * @returns {Observable<RestResponse>}
     */
    distributePayment(params: PaymentParamEq): Observable<RestResponse>  {
        return this._http.post<RestResponse>(environment.urlDistributePayment, params, httpOptions).catch(this.errorHandler);
    }

    /**
     * Создать деталь платежа
     * @param {NcpPaymentDetails} detail
     * @returns {Observable<RestResponse>}
     */
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

    /**
     * Получит платёж
     * @param {number} id
     * @returns {Observable<RestResponse>}
     */
    getPayment(id: number): Observable<RestResponse>   {
        return this._http.post<RestResponse>(environment.urlGetPayment + '?id=' + id, httpOptions).catch(this.errorHandler);
    }

    /**
     * получить записи оборудования по платежу
     * @param {number} id
     * @returns {Observable<RestResponse>}
     */
    getPaymentEquipments(id: number): Observable<RestResponse>   {
        return this._http.post<RestResponse>(environment.urlGetPaymentEquipments + '?id=' + id, httpOptions).catch(this.errorHandler);
    }

    /**
     * получить информацию о дилере и складе на данный момент по ICC сим карты
     * @param {string} icc
     * @returns {Observable<RestResponse>}
     */
    getDealerInfo(icc: string): Observable<RestResponse>   {
        return this._http.post<RestResponse>(environment.urlGetDealerInfoByIcc + '?icc=' + icc, httpOptions).catch(this.errorHandler);
    }

}
