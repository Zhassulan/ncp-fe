import {Phone} from '../payment/model/phone';
import {environment} from '../../environments/environment';
import {Client} from '../clients/list/client';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Payment} from '../payment/model/payment';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class ClientDataService {

    constructor(private http: HttpClient) { }

    props(bin, profileId)   {
        const params = new HttpParams()
            .set('profileId', profileId);
        return this.http.get<number>(`${API_URL}/clients/${bin}/props`, {params});
    }

    all() {
        return this.http.get<Client []> (`${API_URL}/clients`);
    }

    payments(id) {
        return this.http.get<Payment []> (`${API_URL}/clients/${id}/payments`);
    }

    paymentsRange(id, start, end) {
        const params = new HttpParams()
            .set('start', start)
            .set('end', end);
        return this.http.get<Payment []> (`${API_URL}/clients/${id}/payments/range`, {params});
    }


    phones(bin, value, limit)   {
        const params = new HttpParams()
            .set('limit', limit);
        return this.http.get<string []>(`${API_URL}/clients/${bin}/phones/${value}`, {params});
    }

    accounts(bin, value, limit)   {
        const params = new HttpParams()
            .set('limit', limit);
        return this.http.get<string []>(`${API_URL}/clients/${bin}/accounts/${value}`, {params});
    }

}
