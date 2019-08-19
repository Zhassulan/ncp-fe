import {Component, OnInit} from '@angular/core';
import {Registry} from '../model/registry';
import {RegistryService} from '../registry.service';
import {ActivatedRoute} from '@angular/router';
import {AppService} from '../../app.service';
import {NotificationsService} from 'angular2-notifications';
import {msgs, rests} from '../../settings';
import {NGXLogger} from 'ngx-logger';
import {UserService} from '../../user/user.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-registry',
    templateUrl: './registry.component.html',
    styleUrls: ['./registry.component.css']
})
export class RegistryComponent implements OnInit {

    constructor(private registryService: RegistryService,
                private route: ActivatedRoute,
                private appService: AppService,
                private notifService: NotificationsService,
                private logger: NGXLogger,
                private userService: UserService) {
    }

    get registry() {
        return this.registryService.registry;
    }

    ngOnInit() {
        this.appService.setProgress(true);
        let id = this.route.snapshot.params['id'];
        this.registryService.loadRegistry(id).subscribe(
            data => {
                //console.log(this.registry);
                },
            error2 => {
                this.appService.setProgress(false);
                this.notifService.error(error2);
            },
            () => {
                this.appService.setProgress(false);
            });
    }

    onSelected(selected: number) {
        /*
        switch (selected) {
            case this.paymentMenuItems.LOAD_EQUIPMENT: {
                this.menuLoadEquipmentFileDlg();
            }
                break;
            case this.paymentMenuItems.DISTRIBUTE: {
                this.menuDistribute();
            }
                break;
            default:

        }
        */
    }

}
