import {Phone} from '../payments/payment/model/phone';
import {environment} from '../../environments/environment';
import {Client} from '../clients/list/client';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ClientPayment} from '../clients/client-payments-table/client-payment';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class ClientDataService {

    constructor(private http: HttpClient) { }

    phones(paymentId)   {
        return this.http.get<Phone []>(`${API_URL}/clients/${paymentId}/props`);
    }

    list() {
        return this.http.get<Client []> (`${API_URL}/clients`);
    }

    payments(id) {
        return this.http.get<ClientPayment []> (`${API_URL}/clients/${id}/payments`);
    }

}
