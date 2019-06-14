import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {locStorItems} from '../settings';
import {PaymentsService} from '../payments/payments.service';
import {Subscription} from 'rxjs';

interface ROUTE {
    icon?: string;
    route?: string;
    title?: string;
}

@Component({
    selector: 'app-menu-toolbar',
    templateUrl: './menu-toolbar.component.html',
    styleUrls: ['./menu-toolbar.component.css']
})
export class MenuToolbarComponent implements AfterViewChecked {

    isWait: boolean;
    progressSubscription: Subscription;

    paymentRoutes: ROUTE[] = [
        {
            icon: 'credit_card',
            route: 'payments',
            title: 'Платежи',
        }, {
            icon: 'dashboard',
            route: 'sales/dashboards',
            title: '----------',
        }
    ];

    accountRoutes: ROUTE[] = [
        {
            icon: 'contacts',
            route: 'sales/accounts',
            title: '----------',
        }, {
            icon: 'people',
            route: 'sales/contacts',
            title: '----------',
        }, {
            icon: 'settings_phone',
            route: 'sales/leads',
            title: '----------',
        }, {
            icon: 'account_box',
            route: 'sales/opportunities',
            title: '----------',
        }
    ];

    equipmentRoutes: ROUTE[] = [
        {
            icon: 'router',
            route: 'sales/equipment',
            title: '----------',
        }
    ];

    registrytRoutes: ROUTE[] = [
        {
            icon: 'assignment_ind',
            route: 'registry/all',
            title: 'Реестры',
        }
    ];

    @Output() toggleSidenav = new EventEmitter<void>();

    constructor(private authService: AuthService,
                private router: Router,
                private paymentsService: PaymentsService,
                private cdRef:ChangeDetectorRef) {
        this.progressSubscription = this.paymentsService.progressAnnounced$.subscribe(
            data => {
                this.isWait = data;
            });
    }

    ngAfterViewChecked(): void {
        if (!this.isWait)
            this.isWait = false;
        this.cdRef.detectChanges();
    }



    logout() {
        this.authService.logout();
        localStorage.removeItem(locStorItems.userName);
        this.router.navigate(['/login']);
    }

    getUser() {
        return this.authService.getUser();
    }

}
