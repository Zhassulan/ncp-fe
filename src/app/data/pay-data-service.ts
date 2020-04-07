
import {environment} from '../../environments/environment';
import {Payment} from '../payments/payment/model/payment';

import {RestResponse} from './rest-response';
import {RequestPostPayment} from './request-post-payment';
import {httpOptions, PaymentActions} from '../settings';
import {RouterRegistry} from '../router/model/router-registry';
import {EquipmentCheckParam} from '../payments/model/equipment-check-param';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {Equipment} from '../payments/model/equipment';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class PayDataService {

    constructor(private http: HttpClient) { }

    all(start, end) {
        const params = new HttpParams()
            .set('start', start)
            .set('end', end);
        return this.http.get<Payment []>(`${API_URL}/payments`, { params });
    }

    public json() {
        return this.http.get<Payment []>('./assets/payments.json');
    }

    transit(id) {
        return this.http.post<Payment>(`${API_URL}/payments/${id}/transit`, new RequestPostPayment(PaymentActions.TO_TRANSIT), httpOptions);
    }

    transitDel(id) {
        return this.http.delete<Payment>(API_URL + `/payments/${id}/transit`);
    }

    routerRegistry(formData: FormData) {
        return this.http.post<RouterRegistry>(`${API_URL}/payments/router/registry`, formData);
    }

    distribute(id, details) {
        return this.http.post(`${API_URL}/payments/${id}/distribution`, details, httpOptions);
    }

    findById(id: number) {
        return this.http.get<Payment>(`${API_URL}/payments/${id}/`, httpOptions);
    }

    equipments(id: number):Observable<any>{
        return this.http.get<Equipment []>(`${API_URL}/payment/${id}/equipments`, httpOptions);
    }

    bercutEquipmentInfoByIcc(icc: String) {
        return this.http.post(`${API_URL}/equipment/${icc}`, httpOptions);
    }

    checkEquipmentParams(iccList: EquipmentCheckParam []) {
        return this.http.post(`${API_URL}/equipments/check`, iccList, httpOptions);
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
