import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Payment} from '../payment/model/payment';
import {environment} from '../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class TemplateDataService {

    constructor(private http: HttpClient) {
    }

    findByCompany(profileId) {
        return this.http.get<Payment []>(`${API_URL}/templates/company/${profileId}`);
    }

}
