import {Phone} from '../payments/payment/model/phone';
import {environment} from '../../environments/environment';
import {Client} from '../clients/list/model/client';
import {HttpClient} from '@angular/common/http';

const API_URL = environment.apiUrl;

export class ClientDataService {

    constructor(private http: HttpClient) { }

    phones(id)   {
        return this.http.get<Phone []>(`${API_URL}/clients/${id}/props`);
    }

    list() {
        return this.http.get<Client []> (`${API_URL}/clients`);
    }
}
