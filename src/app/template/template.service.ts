import {Injectable} from '@angular/core';
import {Template} from './model/template';
import {HttpClient} from '@angular/common/http';
import {TemplateRepository} from './template-repository';
import {AppService} from '../app.service';
import {NotificationsService} from 'angular2-notifications';

@Injectable({providedIn: 'root'})
export class TemplateService {

  profileId;
  templates: Template [];

  constructor(private http: HttpClient,
              private repository: TemplateRepository,
              private appService: AppService,
              private notif: NotificationsService) {
  }

  findAllByProfileId(id) {
    return this.repository.findAllByCompany(id);
  }

  findById(id) {
    return this.repository.findById(id);
  }

  delete(id) {
    return this.repository.delete(id);
  }

  deleteDetail(templateId, detailId) {
    return this.repository.deleteDetail(templateId, detailId);
  }

  create(profileId, name) {
    return this.repository.create(profileId, name);
  }


}
