import {Injectable} from '@angular/core';
import {Template} from './model/template';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TemplateRepository} from './template-repository';

@Injectable({
    providedIn: 'root'
})
export class TemplateService {

    private _templates : Template [];

    constructor(private http: HttpClient,
                private repository: TemplateRepository) {
    }

    findAllByProfileId(profileId): Observable<Template []> {
        return this.repository.findAllByCompany(profileId);
    }

    get templates(): Template[] {
        return this._templates;
    }

    set templates(value: Template[]) {
        this._templates = value;
    }

    getById(id): Template {
        return this._templates.find(x => x.id === id);
    }

    findById(id): Observable<Template> {
        return this.repository.findById(id);
    }

}
