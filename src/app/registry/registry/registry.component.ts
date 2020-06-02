import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppService} from '../../app.service';
import {NotificationsService} from 'angular2-notifications';
import {RegistryDataService} from '../../data/registry-data.service';

@Component({
    selector: 'app-registry',
    templateUrl: './registry.component.html',
    styleUrls: ['./registry.component.scss']
})
export class RegistryComponent implements OnInit {

    registry

    constructor(private registryService: RegistryDataService,
                private route: ActivatedRoute,
                private appService: AppService,
                private notifService: NotificationsService) {
    }

    ngOnInit() {
        this.appService.setProgress(true);
        this.registryService.findById(this.route.snapshot.params['id']).subscribe(
            data => this.registry = data,
            error => {
                this.notifService.error(error.message)
                this.appService.setProgress(false)
            },
            () => this.appService.setProgress(false))
    }

}
