import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {NcpPayment} from '../payments/model/ncp-payment';
import {Observable} from 'rxjs';
import {DateRange} from './date-range';
import {RestResponse} from './rest-response';
import {httpOptions, PaymentActions} from '../settings';
import {FilePayment} from '../payments/payment/equipment/model/file-payment';
import {PaymentParamEq} from '../payments/model/payment-param-eq';
import {EquipmentCheckParam} from '../payments/model/equipment-check-param';
import {User} from '../auth/model/user';
import {Version} from '../version';
import {RequestPostPayment} from './request-post-payment';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root',
})
export class DataService {

    constructor(private httpClient: HttpClient) { }

    /**
     *  Перехватчик ошибки от http метода
     * @param {HttpErrorResponse} error
     * @returns {Observable<never>}
     */
    errorHandler(error: HttpErrorResponse) {
        //return Observable.throwError(error.message || 'Ошибка сервера.');
        return null;
    }

    /**
     *  Аутентификация
     * @param {User} userObj
     * @returns {Observable<RestResponse>}
     */
    login(userName, userPassword) {
        const body = new HttpParams()
            .set('username', userName)
            .set('password', userPassword);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };
        return this.httpClient.post(API_URL + '/auth/login', body.toString(), httpOptions);
    }

    authorize(userObj: User): Observable<RestResponse> {
        return this.httpClient.post <RestResponse>(API_URL + '/auth/authorization', userObj, httpOptions);
    }

    /**
     * Получить все платежи NCP
     * @param {DateRange} dr
     * @returns {Observable<NcpPayment[]>}
     */
    getNcpPayments(dr: DateRange): Observable <any> {
        const params = new HttpParams()
            .set('startDate', dr.startDate)
            .set('endDate', dr.endDate);
        return this.httpClient.get(API_URL + '/payments', {params});
    }

    /**
     * Получить платежи из файла (быстрее для отладки), предварительно можно заготовить за какой день выгрузив из getNcpPayments
     * @returns {Observable<any>}
     */
    public getNcpPaymentsJson(): Observable<any> {
        return this.httpClient.get('./assets/payments.json');
    }

    /**
     * Перевести платёж на транзитный счёт NCP
     * @param {number} id
     * @returns {Observable<RestResponse>}
     */
    paymentToTransit(id: number): Observable<RestResponse> {
        return this.httpClient.post <RestResponse>(API_URL + `/payments/${id}`, new RequestPostPayment(PaymentActions.TO_TRANSIT), httpOptions);
    }

    /**
     * Удалить платёж на транзитном счету
     * @param {number} id
     * @param {string} user
     * @returns {Observable<RestResponse>}
     */
    deleteTransitPayment(id: number, user: string): Observable<RestResponse> {
        return this.httpClient.post <RestResponse>(API_URL + `/payment/${id}`, {"payment_action":"from_transit"}, httpOptions);
    }

    /**
     * Отправить на загрузку и парсинг форму разноски в формате Excel по оборудованию, пример в папке проекта docs
     * @param {FormData} formData
     * @returns {Observable<any>}
     */
    postFilePayment(formData: FormData): Observable<any> {
        return this.httpClient.post<FilePayment>(API_URL + '/equipment/upload', formData);
    }

    /**
     * получить детали платежа
     * @param {number} paymentId
     * @returns {Observable<RestResponse>}
     */
    getPaymentDetails(id: number): Observable<RestResponse> {
        return this.httpClient.post<RestResponse>(API_URL + `/payment/${id}/details`, httpOptions);
    }

    /**
     * разнести платёж
     * @param {PaymentParamEq} params
     * @returns {Observable<RestResponse>}
     */
    distributePayment(params: PaymentParamEq): Observable<RestResponse> {
        return this.httpClient.post<RestResponse>(API_URL + '/payment/distribute', params, httpOptions);
    }

    /**
     * Получит платёж
     * @param {number} id
     * @returns {Observable<RestResponse>}
     */
    getPayment(id: number): Observable<RestResponse> {
        return this.httpClient.post<RestResponse>(API_URL + `/payment/${id}/`, httpOptions);
    }

    /**
     * получить записи оборудования по платежу
     * @param {number} id
     * @returns {Observable<RestResponse>}
     */
    getPaymentEquipments(id: number): Observable<RestResponse> {
        return this.httpClient.post<RestResponse>(API_URL + `/payment/${id}/equipments`, httpOptions);
    }

    /**
     * Получить информацию по оборудованию, а именно, inv code, название и стоимость (первый платёж)
     * @param {String} icc
     * @returns {Observable<any>}
     */
    getBercutEquipmentInfoByIcc(icc: String): Observable<RestResponse> {
        return this.httpClient.post<RestResponse>(API_URL + `/equipment/${icc}`, httpOptions);
    }

    /**
     * Сверка названия, суммы первоначального платежа по списку (при разноске с до полями оборудования) с биллингом
     * @param {IccSum[]} iccList
     * @returns {Observable<RestResponse>}
     */
    checkEquipmentParams(iccList: EquipmentCheckParam []): Observable<RestResponse> {
        return this.httpClient.post<RestResponse>(API_URL + '/equipments/check', iccList, httpOptions);
    }

    getPaymentStatus(id): Observable<RestResponse> {
        return this.httpClient.post<RestResponse>(API_URL + `/payment/${id}/status`, httpOptions);
    }

    paymentBlocked(id): Observable<RestResponse> {
        return this.httpClient.post<RestResponse>(API_URL + `/payment/${id}/blocked`, httpOptions);
    }

    getAllRegistries(): Observable<RestResponse> {
        return this.httpClient.post<RestResponse>(API_URL + `/registry/all`, httpOptions);
    }

    getRegistry(id): Observable<RestResponse> {
        return this.httpClient.post<RestResponse>(API_URL + `/registry/${id}`, httpOptions);
    }

    getVersion(): Observable<Version> {
        return this.httpClient.get<Version>(API_URL + '/ver', httpOptions);
    }

    getRegistriesByRange(startDate, endDate, bin): Observable<any> {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            params:
                new HttpParams().set('start_date', startDate).append('end_date', endDate).append('bin', bin)
        };
        return this.httpClient.get <RestResponse>(
            API_URL + '/registry/range', options);
    }

}
