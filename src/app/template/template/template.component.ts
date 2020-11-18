import {Component, OnInit} from '@angular/core';
import {Template} from '../model/template';
import {ActivatedRoute} from '@angular/router';
import {TemplateService} from '../template.service';
import {NotificationsService} from 'angular2-notifications';
import {ClientProfile} from '../../clients/clientProfile';
import {ClientService} from '../../clients/client.service';

@Component({
    selector: 'app-template',
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

    constructor(private route: ActivatedRoute,
                private templateService: TemplateService,
                private notifService: NotificationsService,
                private clntService: ClientService) {
    }

    private _template: Template;

    get template(): Template {
        return this._template;
    }

    set template(value: Template) {
        this._template = value;
    }

    get profile(): ClientProfile {
        return this.clntService.clientProfile;
    }

    ngOnInit(): void {
        this.template = this.templateService.getById(this.route.snapshot.params['id']);
    }

}

