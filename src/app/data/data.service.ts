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
import {FilePayment} from '../payments/payment/equipment/model/file-payment';
import {PaymentParamEq} from '../payments/model/payment-param-eq';
import {EquipmentCheckParam} from '../payments/model/equipment-check-param';
import {User} from '../auth/model/user';

const API_URL = environment.apiUrl;

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

    login(userObj: User): Observable <RestResponse> {
        return this._http.post <RestResponse>(API_URL + '/auth/login', userObj, httpOptions).catch(this.errorHandler);
    }

    authorize(userObj: User): Observable <RestResponse>  {
        return this._http.post <RestResponse>(API_URL + '/auth/authorization', userObj, httpOptions).catch(this.errorHandler);
    }

    /**
     * Получить все платежи NCP
     * @param {DateRange} dr
     * @returns {Observable<NcpPayment[]>}
     */
    getNcpPayments(dr: DateRange): Observable <RestResponse> {
        return this._http.post<RestResponse>(API_URL + '/exdata/payments', dr, httpOptions).catch(this.errorHandler);
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
        return this._http.post <RestResponse> (API_URL + `/exdata/payment/${id}/transit/transfer`, httpOptions).catch(this.errorHandler);
    }

    /**
     * Удалить платёж на транзитном счету
     * @param {number} id
     * @param {string} user
     * @returns {Observable<RestResponse>}
     */
    deleteTransitPayment(id: number, user: string) : Observable <RestResponse> {
        return this._http.post <RestResponse> (API_URL + `/exdata/payment/${id}/transit/delete`, httpOptions).catch(this.errorHandler);
    }

    /**
     * Отправить на загрузку и парсинг форму разноски в формате Excel по оборудованию, пример в папке проекта docs
     * @param {FormData} formData
     * @returns {Observable<any>}
     */
    postFilePayment(formData: FormData): Observable<any> {
        return this._http.post<FilePayment>(API_URL + '/exdata/equipment/upload', formData).catch(this.errorHandler);
    }

    /**
     * получить детали платежа
     * @param {number} paymentId
     * @returns {Observable<RestResponse>}
     */
    getPaymentDetails(id: number): Observable<RestResponse>   {
        return this._http.post<RestResponse>(API_URL + `/exdata/payment/${id}/details`, httpOptions).catch(this.errorHandler);
    }

    /**
     * разнести платёж
     * @param {PaymentParamEq} params
     * @returns {Observable<RestResponse>}
     */
    distributePayment(params: PaymentParamEq): Observable<RestResponse>  {
        return this._http.post<RestResponse>(API_URL + '/exdata/payment/distribute', params, httpOptions).catch(this.errorHandler);
    }

    /**
     * Получит платёж
     * @param {number} id
     * @returns {Observable<RestResponse>}
     */
    getPayment(id: number): Observable<RestResponse>   {
        return this._http.post<RestResponse>(API_URL + `/exdata/payment/${id}/`, httpOptions).catch(this.errorHandler);
    }

    /**
     * получить записи оборудования по платежу
     * @param {number} id
     * @returns {Observable<RestResponse>}
     */
    getPaymentEquipments(id: number): Observable<RestResponse>   {
        return this._http.post<RestResponse>(API_URL + `/exdata/payment/${id}/equipments`, httpOptions).catch(this.errorHandler);
    }

    /**
     * Получить информацию по оборудованию, а именно, inv code, название и стоимость (первый платёж)
     * @param {String} icc
     * @returns {Observable<any>}
     */
    getBercutEquipmentInfoByIcc(icc:String):  Observable<RestResponse>   {
        return this._http.post<RestResponse>(API_URL + `/exdata/equipment/${icc}`, httpOptions).catch(this.errorHandler);
    }

    /**
     * Сверка названия, суммы первоначального платежа по списку (при разноске с до полями оборудования) с биллингом
     * @param {IccSum[]} iccList
     * @returns {Observable<RestResponse>}
     */
    checkEquipmentParams(iccList: EquipmentCheckParam []):  Observable<RestResponse> {
        return this._http.post<RestResponse>(API_URL + '/exdata/equipments/check', iccList, httpOptions).catch(this.errorHandler);
    }

    getPaymentStatus(id): Observable<RestResponse> {
        return this._http.post<RestResponse>(API_URL + `/exdata/payment/${id}/status`, httpOptions).catch(this.errorHandler);
    }

    paymentBlocked(id): Observable<RestResponse> {
        return this._http.post<RestResponse>(API_URL + `/exdata/payment/${id}/blocked`, httpOptions).catch(this.errorHandler);
    }

    getAllRegistries(): Observable<RestResponse> {
        return this._http.post<RestResponse>(API_URL + `/exdata/registry/all`, httpOptions).catch(this.errorHandler);
    }


}
