import {Injectable} from '@angular/core';
import {Template} from './model/template';
import {HttpClient} from '@angular/common/http';
import {TemplateRepository} from './template-repository';
import {AppService} from '../app.service';
import {NotificationsService} from 'angular2-notifications';

@Injectable({providedIn: 'root'})
export class TemplateService {

  templates: Template [];

  constructor(private http: HttpClient,
              private repository: TemplateRepository,
              private appService: AppService,
              private notif: NotificationsService) {
  }

  findAllByProfileId(id) {
    this.appService.setProgress(true);
    this.repository.findAllByCompany(id).subscribe(
        data => this.templates = data,
        error => {
          this.appService.setProgress(false);
          this.notif.error(error);
        },
        () => this.appService.setProgress(false));
  }

  getById(id): Template {
    return this.templates.find(x => x.id == id);
  }

  delete(id) {
    this.appService.setProgress(true);
    this.repository.delete(id).subscribe(
        data => this.templates.splice(this.templates.findIndex(x => x.id == id), 1),
        error => {
          this.appService.setProgress(false);
          this.notif.error(error);
        }, () => this.appService.setProgress(false));
  }

  deleteDetail(id) {
    this.appService.setProgress(true);
    this.repository.deleteDetail(id).subscribe(
        data => this.templates.splice(this.templates.findIndex(x => x.id == id), 1),
        error => {
          this.appService.setProgress(false);
          this.notif.error(error);
        }, () => this.appService.setProgress(false));
  }


}
