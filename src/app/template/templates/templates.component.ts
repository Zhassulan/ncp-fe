import {Component, OnInit} from '@angular/core';
import {ClientProfile} from '../../clients/clientProfile';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app.service';
import {NotificationsService} from 'angular2-notifications';
import {DlgService} from '../../dialog/dlg.service';
import {ClientRepository} from '../../clients/client-repository';

@Component({
    selector: 'app-templates',
    templateUrl: './templates.component.html',
    styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {

    clientProfile: ClientProfile;

    constructor(private route: ActivatedRoute,
                private appService: AppService,
                private notifService: NotificationsService,
                private router: Router,
                private dlgService: DlgService,
                private clntService: ClientRepository) {
    }

    ngOnInit(): void {
        this.getClientProfile();
    }

    getClientProfile() {
        this.clntService.profile(this.route.snapshot.params['id']).subscribe(
            data => this.clientProfile = data,
            error => this.notifService.warn(error));
    }

}
