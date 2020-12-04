import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Template} from './model/template';
import {catchError} from 'rxjs/operators';
import {HttpErrHandler} from '../http-err-handler';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {httpOptions} from '../settings';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class TemplateRepository {

    constructor(private http: HttpClient) {
    }

    findAllByCompany(profileId): Observable<Template []> {
        console.log(`Loading templates by profile ID ${profileId}..`);
        return this.http.get<Template []>(`${API_URL}/templates/company/${profileId}`).pipe(catchError(HttpErrHandler.handleError));
    }

    findById(id): Observable<Template> {
        return this.http.get<Template>(`${API_URL}/templates/${id}`).pipe(catchError(HttpErrHandler.handleError));
    }

    delete(id): Observable<any> {
        return this.http.delete(`${API_URL}/templates/${id}`).pipe(catchError(HttpErrHandler.handleError));
    }

    deleteDetail(id): Observable<any> {
        return this.http.delete(`${API_URL}/templates/details/${id}`).pipe(catchError(HttpErrHandler.handleError));
    }

    create(profileId, name): Observable<Template> {
        return this.http.post<Template>(`${API_URL}/templates`, { profileId: profileId, name: name}, httpOptions).pipe(catchError(HttpErrHandler.handleError));
    }

}
