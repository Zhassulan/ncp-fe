import {Title} from '@angular/platform-browser';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AppService} from './app.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

    constructor(private appService: AppService) {
    }

    ngOnInit(): void {
        this.appService.checkVer();
    }

}
