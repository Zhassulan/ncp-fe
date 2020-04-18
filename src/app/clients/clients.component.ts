import {Component, OnInit} from '@angular/core';
import {ClientDataService} from '../data/client-data-service';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
    }

}
