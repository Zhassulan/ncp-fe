import {Title} from '@angular/platform-browser';
import {Component, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {

    @ViewChild('appDrawer') appDrawer: ElementRef;
    title = 'NCP';

    constructor(private titleService: Title) { //, private navService: NavService
        this.titleService.setTitle(this.title);
    }

    ngAfterViewInit() {
        //this.navService.appDrawer = this.appDrawer;
    }

}
