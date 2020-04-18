import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Client} from '../clients/list/client';
import {HttpClient} from '@angular/common/http';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class MobipayDataService {

    constructor(private http: HttpClient) {    }

    clients() {
        return this.http.get<Client []>(`${API_URL}/mobipay/clients`);
    }

    partners() {
      return this.http.get<Client []>(`${API_URL}/mobipay/partners`);
    }

}
