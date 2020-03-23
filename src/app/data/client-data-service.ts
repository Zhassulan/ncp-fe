import {Phone} from '../payments/payment/model/phone';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Client} from '../clients/list/client';

const API_URL = environment.apiUrl;

export class ClientDataService {

    constructor(private http: HttpClient) { }

    phones(id)   {
        return this.http.get<Phone []>(`${API_URL}/client/${id}/phones`);
    }

    list() {
        return this.http.get<Client []> (`${API_URL}/clients`);
    }
}
