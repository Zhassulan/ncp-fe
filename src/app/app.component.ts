import {Title} from '@angular/platform-browser';
import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {appTitle} from './settings';
import {AppService} from './app.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

    constructor(private titleService: Title,
                private appService: AppService) {
        this.titleService.setTitle(appTitle);
    }

    ngOnInit(): void {
        this.appService.checkVersion();
    }

}
