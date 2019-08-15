import {Component, Input, OnInit} from '@angular/core';
import {Registry} from '../../model/registry';

@Component({
    selector: 'app-registry-properties',
    templateUrl: './registry-properties.component.html',
    styleUrls: ['./registry-properties.component.css']
})
export class RegistryPropertiesComponent implements OnInit {

    @Input() registry: Registry;

    constructor() {
    }

    ngOnInit() {
    }

}
