import {Title} from '@angular/platform-browser';
import {Component, ViewEncapsulation, AfterViewInit, OnInit} from '@angular/core';
import {locStorItems} from './settings';
import {NotificationsService} from 'angular2-notifications';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit {

    title = 'NCP';

    constructor(private titleService: Title,
                private notifService: NotificationsService) {
        this.titleService.setTitle(this.title);
    }

    ngOnInit(): void { }

    ngAfterViewInit() {
        //localStorage.clear();
        if (localStorage.getItem(locStorItems.version) == null) {
            localStorage.setItem(locStorItems.version, '0');
        }
    }

}
