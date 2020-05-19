import {Component, OnInit} from '@angular/core';
import {NotifOptions} from '../settings';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

    options = NotifOptions;

    constructor() {
    }

    ngOnInit(): void {
    }

}
