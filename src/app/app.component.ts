import {Title} from '@angular/platform-browser';
import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {appTitle} from './settings';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

    constructor(private titleService: Title) {
        this.titleService.setTitle(appTitle);
    }

    ngOnInit(): void { }

}
