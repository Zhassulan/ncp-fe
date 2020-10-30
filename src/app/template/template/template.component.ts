import {Component, Input, OnInit} from '@angular/core';
import {Template} from '../model/template';
import {ActivatedRoute} from '@angular/router';
import {TemplateService} from '../template.service';

@Component({
    selector: 'app-template',
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

    private _template: Template;

    constructor(private route: ActivatedRoute,
                private templateService: TemplateService) {
    }

    get template(): Template {
        return this._template;
    }

    set template(value: Template) {
        this._template = value;
    }

    ngOnInit(): void {
        this.template = this.templateService.findById(this.route.snapshot.params['id']);
    }

}
