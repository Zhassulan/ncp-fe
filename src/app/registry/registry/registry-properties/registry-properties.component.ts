import {Component, Input, OnInit} from '@angular/core';
import {Registry} from '../../model/registry';

@Component({
    selector: 'app-registry-properties',
    templateUrl: './registry-properties.component.html',
    styleUrls: ['./registry-properties.component.scss']
})
export class RegistryPropertiesComponent implements OnInit {

    @Input() registry: Registry;

    constructor() {
    }

    ngOnInit() {
    }

}
