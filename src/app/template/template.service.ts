import {Injectable} from '@angular/core';
import {Template} from './model/template';
import {HttpClient} from '@angular/common/http';
import {from, Observable, Subject} from 'rxjs';
import {TemplateRepository} from './template-repository';
import {Payment} from '../payment/model/payment';
import {ClientProfile} from '../clients/clientProfile';
import {map} from 'rxjs/operators';
import {ClientRepository} from '../clients/client-repository';
import {ClientService} from '../clients/client.service';

@Injectable({providedIn: 'root'})
export class TemplateService {

    templates: Template [];

    constructor(private http: HttpClient,
                private repository: TemplateRepository) {
    }

    findAllByProfileId(profileId: number): Observable<Template []> {
        return this.repository.findAllByCompany(profileId).pipe(map(x => this.templates = x));
    }

    findById(id: number): Observable<Template> {
        return this.findInRepo(id);
    }

    private findInRepo(id: number): Observable<Template> {
        return this.repository.findById(id);
    }

    delete(id: number): Observable<any> {
        return this.repository.delete(id);
    }

}
