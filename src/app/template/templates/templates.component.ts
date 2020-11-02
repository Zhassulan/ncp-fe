import {Component, OnInit} from '@angular/core';
import {ClientProfile} from '../../clients/clientProfile';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app.service';
import {NotificationsService} from 'angular2-notifications';
import {DlgService} from '../../dialog/dlg.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ClientRepo} from '../../clients/client-repo.service';

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
                private snackBar: MatSnackBar,
                private clntService: ClientRepo) {
    }

    ngOnInit(): void {
        this.getClientProfile();
    }

    getClientProfile() {
        this.clntService.profile(this.route.snapshot.params['id']).subscribe(
            data => this.clientProfile = data,
            error => this.openSnackBar(error.message, null));
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 5000,
        });
    }

}
