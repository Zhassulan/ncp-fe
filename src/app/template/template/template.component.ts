import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Template} from '../model/template';
import {ActivatedRoute} from '@angular/router';
import {TemplateService} from '../template.service';
import {NotificationsService} from 'angular2-notifications';
import {Message} from '../../message';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-template',
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit, AfterViewInit, OnDestroy {

    private _template: Template;
    private _subscription: Subscription;

    constructor(private route: ActivatedRoute,
                private templateService: TemplateService,
                private notifService: NotificationsService) {
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
        let id = this.route.snapshot.params['id'];
        if (this.templateService.templates) {
            this.templateService.getById(id)
        } else {
            this._subscription = this.templateService.findById(id).subscribe(
                data => this.template = data,
                error => this.notifService.error(error)
            );
        }
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

}
