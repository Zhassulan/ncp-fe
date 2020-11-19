import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TemplateService} from '../template.service';
import {ClientService} from '../../clients/client.service';

@Component({
    selector: 'app-templates',
    templateUrl: './templates.component.html',
    styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {

    constructor(private route: ActivatedRoute,
                private clntService: ClientService,
                private templateService: TemplateService) {
    }

    get profile() {
        return this.clntService.clientProfile;
    }

    ngOnInit(): void {
        let id = this.route.snapshot.params['id'];
        this.clntService.loadProfile(id);
        this.templateService.findAllByProfileId(id);
    }

}
