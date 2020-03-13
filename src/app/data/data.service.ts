import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
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
import {Payment} from '../payments/payment/model/payment';
import {Phone} from '../client/model/phone';

const API_URL_ROOT = environment.apiUrlRoot;
const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root',
})
export class DataService {
    
    constructor(private http: HttpClient) { }

    /*errorHandler(error: HttpErrorResponse) {
        return throwError(error.message || ' Ошибка сервера.');
    }
    */

    /**
     *  Аутентификация
     * @param {User} userObj
     * @returns {Observable<RestResponse>}
     */
    login(userName, userPassword) {
        //return this.http.post(API_URL_ROOT + '/auth/login', new User(userName, userPassword, null), httpOptions).pipe(catchError(this.errorHandler));
        return this.http.post(`${API_URL_ROOT}/auth/login`, new User(userName, userPassword, null), httpOptions);
    }

    authorize(userObj: User): Observable<RestResponse> {
        return this.http.post <RestResponse>(`${API_URL_ROOT}/auth/authorization`, userObj, httpOptions);
    }

    /**
     * Получить все платежи NCP
     * @param {DateRange} dr
     * @returns {Observable<NcpPayment[]>}
     */
    payments(start, end) {
        const params = new HttpParams()
            .set('start', start)
            .set('end', end);
        return this.http.get<Payment []>(`${API_URL}/payments`, {params});
    }

    /**
     * Получить платежи из файла (быстрее для отладки), предварительно можно заготовить за какой день выгрузив из payments
     * @returns {Observable<any>}
     */
    public getNcpPaymentsJson(): Observable<any> {
        return this.http.get('./assets/payments.json');
    }

    /**
     * Перевести платёж на транзитный счёт NCP
     * @param {number} id
     * @returns {Observable<RestResponse>}
     */
    paymentToTransit(id: number): Observable<RestResponse> {
        return this.http.post <RestResponse>(`${API_URL}/payment/${id}/transit`, new RequestPostPayment(PaymentActions.TO_TRANSIT), httpOptions);
    }

    /**
     * Удалить платёж на транзитном счету
     * @param {number} id
     * @param {string} user
     * @returns {Observable<RestResponse>}
     */
    deleteTransitPayment(id: number, user: string): Observable<RestResponse> {
        return this.http.delete <RestResponse>(API_URL + `/payment/${id}/transit`);
    }

    /**
     * Отправить на загрузку и парсинг форму разноски в формате Excel по оборудованию, пример в папке проекта docs
     * @param {FormData} formData
     * @returns {Observable<any>}
     */
    postFilePayment(formData: FormData): Observable<any> {
        return this.http.post<FilePayment>(`${API_URL}/equipment/upload`, formData);
    }

    /**
     * разнести платёж
     * @param {PaymentParamEq} params
     * @returns {Observable<RestResponse>}
     */
    distribute(id, details) {
        return this.http.post(`${API_URL}/payment/${id}/distribute`, details, httpOptions);
    }

    /**
     * Получит платёж
     * @param {number} id
     * @returns {Observable<RestResponse>}
     */
    getPayment(id: number) {
        return this.http.get<Payment>(`${API_URL}/payment/${id}/`, httpOptions);
    }

    /**
     * получить записи оборудования по платежу
     * @param {number} id
     * @returns {Observable<RestResponse>}
     */
    getPaymentEquipments(id: number): Observable<RestResponse> {
        return this.http.get<RestResponse>(`${API_URL}/payment/${id}/equipments`, httpOptions);
    }

    /**
     * Получить информацию по оборудованию, а именно, inv code, название и стоимость (первый платёж)
     * @param {String} icc
     * @returns {Observable<any>}
     */
    getBercutEquipmentInfoByIcc(icc: String): Observable<RestResponse> {
        return this.http.post<RestResponse>(`${API_URL}/equipment/${icc}`, httpOptions);
    }

    /**
     * Сверка названия, суммы первоначального платежа по списку (при разноске с до полями оборудования) с биллингом
     * @param {IccSum[]} iccList
     * @returns {Observable<RestResponse>}
     */
    checkEquipmentParams(iccList: EquipmentCheckParam []): Observable<RestResponse> {
        return this.http.post<RestResponse>(`${API_URL}/equipments/check`, iccList, httpOptions);
    }

    getPaymentStatus(id): Observable<RestResponse> {
        return this.http.post<RestResponse>(`${API_URL}/payment/${id}/status`, httpOptions);
    }

    paymentBlocked(id): Observable<RestResponse> {
        return this.http.post<RestResponse>(`${API_URL}/payment/${id}/blocked`, httpOptions);
    }

    getAllRegistries(): Observable<RestResponse> {
        return this.http.post<RestResponse>(`${API_URL}/registry/all`, httpOptions);
    }

    getRegistry(id): Observable<RestResponse> {
        return this.http.post<RestResponse>(`${API_URL}/registry/${id}`, httpOptions);
    }

    getVersion(): Observable<Version> {
        return this.http.get<Version>(`${API_URL}/ver`, httpOptions);
    }

    getRegistriesByRange(start, end, bin): Observable<any> {
        const params = new HttpParams()
            .set('start', start)
            .set('end', end)
            .set('bin', bin);
        return this.http.get<RestResponse>(`${API_URL}/registry/range`, {params});
    }

    validateAccount(profileId, account) {
        return this.http.get(`${API_URL}/profile/${profileId}/account/${account}`, httpOptions);
    }

    validateMsisdn(profileId, msisdn) {
        return this.http.get(`${API_URL}/profile/${profileId}/msisdn/${msisdn}`, httpOptions);
    }

    deferPayment(payment)  {
        return this.http.post(`${API_URL}/payment/defer`, payment, httpOptions);
    }

    getClientPhones(id)   {
        return this.http.get<Phone []>(`${API_URL}/client/${id}/phones`);
    }

}
