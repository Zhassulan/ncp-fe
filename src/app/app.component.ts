import {Title} from '@angular/platform-browser';
import {Component, ViewEncapsulation, AfterViewInit, OnInit} from '@angular/core';
import {appVer, locStorItems} from './settings';
import {NotificationsService} from 'angular2-notifications';
import {PaymentService} from './payments/payment/payment.service';
import {PaymentsService} from './payments/payments.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit {

    title = 'NCP';

    constructor(private titleService: Title,
                private notifService: NotificationsService,
                private paymentService: PaymentService,
                private paymentsService: PaymentsService) {
        this.titleService.setTitle(this.title);
    }

    ngOnInit(): void {
    }


    ngAfterViewInit() {
        //localStorage.clear();
        if (localStorage.getItem(locStorItems.version) == null) {
            localStorage.setItem(locStorItems.version, '0');
        }
        if (parseInt(localStorage.getItem(locStorItems.version)) != appVer) {
            this.notifService.warn('Внимание! Обновите приложение при помощи комбинации клавиш [Ctrl]+[F5]. Спасибо.');
            localStorage.setItem(locStorItems.version, appVer.toString());
        }
    }



}
