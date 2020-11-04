import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Template} from '../model/template';
import {ActivatedRoute} from '@angular/router';
import {TemplateService} from '../template.service';
import {NotificationsService} from 'angular2-notifications';
import {Message} from '../../message';

@Component({
    selector: 'app-template',
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit, AfterViewInit {

    private _template: Template;

    constructor(private route: ActivatedRoute,
                private templateService: TemplateService,
                private notifService: NotificationsService,) {
    }

    get template(): Template {
        return this._template;
    }

    set template(value: Template) {
        this._template = value;
    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        if (this.templateService.templates) {
            if (this.templateService.templates.length > 0) this.template = this.templateService.findById(this.route.snapshot.params['id']);
        } else {
            this.notifService.warn(Message.WAR.DATA_NOT_FOUND);
        }
    }

}
