import {Title} from '@angular/platform-browser';
import {Component, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit} from '@angular/core';
import {NavItem} from './navigator/nav-item';

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

    navItems: NavItem[] = [
        {
            displayName: 'Onlinebank',
            iconName: 'account_balance',
            route: 'onlinebank',
            children: [
                {
                    displayName: 'Платежи NCP',
                    iconName: 'payment',
                    route: 'onlinebank/payment/ncp',
                },
                {
                    displayName: 'Неизвестные платежи',
                    iconName: 'help',
                    route: 'onlinebank/payment/unknown',
                },
                {
                    displayName: 'Автоматические платежи',
                    iconName: 'computer',
                    route: 'onlinebank/payment/auto',
                }
            ]
        },
        {
            displayName: 'Clients',
            iconName: 'account_balance',
            route: 'client',
            children: [
                {
                    displayName: 'Платежи NCP',
                    iconName: 'payment',
                    route: 'onlinebank/payment/ncp',
                },
                {
                    displayName: 'Неизвестные платежи',
                    iconName: 'help',
                    route: 'onlinebank/payment/unknown',
                },
                {
                    displayName: 'Автоматические платежи',
                    iconName: 'computer',
                    route: 'onlinebank/payment/auto',
                }
            ]
        }

    ];

}
