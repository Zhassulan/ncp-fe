import {Title} from '@angular/platform-browser';
import {Component, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit} from '@angular/core';
import {appVer, locStorItems, timeouts} from './settings';
import {MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {

    title = 'NCP';

    constructor(private titleService: Title, public snackBar: MatSnackBar) { //, private navService: NavService
        this.titleService.setTitle(this.title);
    }

    ngAfterViewInit() {
        //localStorage.clear();
        if (localStorage.getItem(locStorItems.version) == null) {
            localStorage.setItem(locStorItems.version, '0');
        }
        if (parseInt(localStorage.getItem(locStorItems.version)) != appVer) {
            this.showMsg('Внимание! Обновите приложение при помощи комбинации клавиш [Ctrl]+[F5]. Спасибо.');
            localStorage.setItem(locStorItems.version, appVer.toString());
        }
    }

    showMsg(text) {
        this.openSnackBar(text, '');
        setTimeout(function () {
        }.bind(this), timeouts.timeoutAfterLoginInput);
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: timeouts.showMsgDelay,
        });
    }

}
