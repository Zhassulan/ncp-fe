import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Payment} from '../payments/payment/model/payment';
import {Observable} from 'rxjs';
import {RestResponse} from './rest-response';
import {RequestPostPayment} from './request-post-payment';
import {httpOptions, PaymentActions} from '../settings';
import {FilePayment} from '../payments/payment/equipment/model/file-payment';
import {EquipmentCheckParam} from '../payments/model/equipment-check-param';

const API_URL = environment.apiUrl;

export class PayDataService {

    constructor(private http: HttpClient) { }

    all(start, end) {
        const params = new HttpParams()
            .set('start', start)
            .set('end', end);
        return this.http.get<Payment []>(`${API_URL}/payments`, { params });
    }

    public json(): Observable<any> {
        return this.http.get('./assets/payments.json');
    }

    toTransit(id): Observable<RestResponse> {
        return this.http.post <RestResponse>(`${API_URL}/payment/${id}/transit`, new RequestPostPayment(PaymentActions.TO_TRANSIT), httpOptions);
    }

    fromTransit(id, user): Observable<RestResponse> {
        return this.http.delete <RestResponse>(API_URL + `/payment/${id}/transit`);
    }

    postFile(formData: FormData): Observable<any> {
        return this.http.post<FilePayment>(`${API_URL}/equipment/upload`, formData);
    }

    distribute(id, details) {
        return this.http.post(`${API_URL}/payment/${id}/distribute`, details, httpOptions);
    }

    get(id: number) {
        return this.http.get<Payment>(`${API_URL}/payment/${id}/`, httpOptions);
    }

    equipments(id: number): Observable<RestResponse> {
        return this.http.get<RestResponse>(`${API_URL}/payment/${id}/equipments`, httpOptions);
    }

    bercutEquipmentInfoByIcc(icc: String): Observable<RestResponse> {
        return this.http.post<RestResponse>(`${API_URL}/equipment/${icc}`, httpOptions);
    }

    checkEquipmentParams(iccList: EquipmentCheckParam []): Observable<RestResponse> {
        return this.http.post<RestResponse>(`${API_URL}/equipments/check`, iccList, httpOptions);
    }

    registries(): Observable<RestResponse> {
        return this.http.post<RestResponse>(`${API_URL}/registry/all`, httpOptions);
    }

    getRegistry(id): Observable<RestResponse> {
        return this.http.post<RestResponse>(`${API_URL}/registry/${id}`, httpOptions);
    }

    registriesRange(start, end, bin): Observable<any> {
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

    defer(payment)  {
        return this.http.post(`${API_URL}/payment/defer`, payment, httpOptions);
    }

}
