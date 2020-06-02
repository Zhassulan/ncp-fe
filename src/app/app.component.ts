import {Title} from '@angular/platform-browser';
import {AfterViewInit, Component, isDevMode, OnInit, ViewEncapsulation} from '@angular/core';
import {AppService} from './app.service';
import {environment} from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit {

    constructor(private titleService: Title,
        private appService: AppService) {
    }

    ngOnInit(): void {    }

    public setTitle( newTitle: string) {
        this.titleService.setTitle( newTitle );
    }

    ngAfterViewInit(): void {
        this.appService.checkVer();
    }

}
