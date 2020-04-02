import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppService} from '../../app.service';
import {NotificationsService} from 'angular2-notifications';
import {rests} from '../../settings';
import {RegistryDataService} from '../../data/registry-data.service';

@Component({
    selector: 'app-registry',
    templateUrl: './registry.component.html',
    styleUrls: ['./registry.component.css']
})
export class RegistryComponent implements OnInit {

    registry;

    constructor(private registryService: RegistryDataService,
                private route: ActivatedRoute,
                private appService: AppService,
                private notifService: NotificationsService) {
    }

    ngOnInit() {
        this.appService.setProgress(true);
        let id = this.route.snapshot.params['id'];
        this.registryService.findById(id).subscribe(data => {
                if (data.result == rests.restResultOk) {
                    this.registry = data;
                }
            },
            error => {
                this.notifService.error(error);
                this.appService.setProgress(false);
            },
            () => {
                this.appService.setProgress(false);
            });
    }

}
