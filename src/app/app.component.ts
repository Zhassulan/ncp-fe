import {Title} from '@angular/platform-browser';
import {Component, isDevMode, OnInit, ViewEncapsulation} from '@angular/core';
import {AppService} from './app.service';
import {environment} from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

    constructor(private titleService: Title,
        private appService: AppService) {
    }

    ngOnInit(): void {
        this.appService.checkVer();
        this.setTitle(isDevMode() ? `Тест ${environment.apiUrl}` : 'NCP');
    }

    public setTitle( newTitle: string) {
        this.titleService.setTitle( newTitle );
    }

}
