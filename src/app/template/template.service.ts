import {Injectable} from '@angular/core';
import {Template} from './model/template';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class TemplateService {

    private _templates : Template [];

    constructor(private http: HttpClient) {
    }

    findAllByCompany(profileId): Observable<Template []> {
        return this.http.get<Template []>(`${API_URL}/templates/company/${profileId}`);
    }

    get templates(): Template[] {
        return this._templates;
    }

    set templates(value: Template[]) {
        this._templates = value;
    }

    findById(id): Template {
        return this.templates.find(value => value.id == id);
    }

}
