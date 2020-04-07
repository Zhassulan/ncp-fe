import {Phone} from '../payments/payment/model/phone';
import {environment} from '../../environments/environment';
import {Client} from '../clients/list/model/client';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

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
}
