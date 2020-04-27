import {environment} from '../../environments/environment';
import {Payment} from '../payment/model/payment';
import {httpOptions} from '../settings';
import {RouterRegistry} from '../router/model/router-registry';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

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
        return this.http.post<Payment>(`${API_URL}/payments/${id}/transit`, httpOptions);
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

    validateAccount(profileId, account) {
        return this.http.get(`${API_URL}/profile/${profileId}/account/${account}`, httpOptions);
    }

    validateMsisdn(profileId, msisdn) {
        return this.http.get(`${API_URL}/profile/${profileId}/msisdn/${msisdn}`, httpOptions);
    }

    defer(payment, deferDate)  {
        const params = new HttpParams()
            .set('dt', deferDate);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            params: params
        };
        return this.http.post(`${API_URL}/payments/${payment.id}/defer`, payment.details, httpOptions);
    }

}
