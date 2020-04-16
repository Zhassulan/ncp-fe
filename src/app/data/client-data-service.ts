import {Phone} from '../payments/payment/model/phone';
import {environment} from '../../environments/environment';
import {Client} from '../clients/list/client';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ClientPayment} from '../clients/client-payments-table/client-payment';
import {RegistryReportItem} from '../registry/model/registry-report-item';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class ClientDataService {

    constructor(private http: HttpClient) { }

    phones(paymentId)   {
        return this.http.get<Phone []>(`${API_URL}/clients/${paymentId}/props`);
    }

    propsBin(paymentId)   {
        return this.http.get<Phone []>(`${API_URL}/clients/${paymentId}/props/bin`);
    }

    all() {
        return this.http.get<Client []> (`${API_URL}/clients`);
    }

    mobipay() {
        return this.http.get<Client []> (`${API_URL}/clients/mobipay`);
    }

    payments(id) {
        return this.http.get<ClientPayment []> (`${API_URL}/clients/${id}/payments`);
    }

    paymentsRange(id, start, end) {
        const params = new HttpParams()
            .set('start', start)
            .set('end', end);
        return this.http.get<ClientPayment []> (`${API_URL}/clients/${id}/payments/range`, {params});
    }

}
