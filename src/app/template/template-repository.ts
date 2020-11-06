import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Template} from './model/template';
import {catchError} from 'rxjs/operators';
import {HttpErrHandler} from '../http-err-handler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class TemplateRepository {

    constructor(private http: HttpClient) {
    }

    findAllByCompany(profileId): Observable<Template []> {
        return this.http.get<Template []>(`${API_URL}/templates/company/${profileId}`).pipe(catchError(HttpErrHandler.handleError));
    }

    findById(id): Observable<Template> {
        return this.http.get<Template>(`${API_URL}/templates/${id}`).pipe(catchError(HttpErrHandler.handleError));
    }

}
