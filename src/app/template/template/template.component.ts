import {Component, Input, OnInit} from '@angular/core';
import {Template} from '../model/template';
import {ActivatedRoute} from '@angular/router';
import {TemplateService} from '../template.service';
import {NotificationsService} from 'angular2-notifications';
import {ClientProfile} from '../../clients/clientProfile';
import {ClientService} from '../../clients/client.service';
import {map} from 'rxjs/operators';
import {concat} from 'rxjs';
import {AppService} from '../../app.service';

@Component({
    selector: 'app-template',
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

    template: Template;

    constructor(private route: ActivatedRoute,
                private templateService: TemplateService,
                private notifService: NotificationsService,
                private clntService: ClientService,
                private appService: AppService) {
    }

    get profile(): ClientProfile {
        return this.clntService.clientProfile;
    }

    ngOnInit(): void {
        this.appService.setProgress(true);
        this.templateService.findById(this.route.snapshot.params['id']).subscribe(
            data => {
                this.template = data;
                this.clntService.getClientProfile(this.template.profileId).subscribe(
                    data => {},
                    error => this.notifService.error(error),
                );
            },
            error => {
                this.appService.setProgress(false);
                this.notifService.error(error);
            },
            () => this.appService.setProgress(false));
    }

}

