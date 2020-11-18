import {Component, OnInit} from '@angular/core';
import {ClientProfile} from '../../clients/clientProfile';
import {ActivatedRoute} from '@angular/router';
import {AppService} from '../../app.service';
import {NotificationsService} from 'angular2-notifications';
import {ClientRepository} from '../../clients/client-repository';
import {Template} from '../model/template';
import {TemplateService} from '../template.service';
import {concat} from 'rxjs';
import {map} from 'rxjs/operators';
import {ClientService} from '../../clients/client.service';

@Component({
    selector: 'app-templates',
    templateUrl: './templates.component.html',
    styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {

    constructor(private route: ActivatedRoute,
                private appService: AppService,
                private notifService: NotificationsService,
                private clntService: ClientService,
                private templateService: TemplateService) {
    }

    get clientProfile() {
        return this.clntService.clientProfile;
    }

    ngOnInit(): void {
        let id = this.route.snapshot.params['id'];
        let o1 = this.clntService.getClientProfile(id);
        let o2 = this.templateService.findAllByProfileId(id);
        let res = concat(o1, o2);
        this.appService.setProgress(true);
        res.subscribe(() => {
            },
            error => {
                this.appService.setProgress(false);
                this.notifService.error(error);
            },
            () => this.appService.setProgress(false));
    }

}
