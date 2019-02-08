import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {locStorItems} from '../settings';

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
export class MenuToolbarComponent implements OnInit {

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

    @Output() toggleSidenav = new EventEmitter<void>();

    constructor(private authService: AuthService,
                private router: Router) {
    }

    ngOnInit() { }

    logout()    {
        this.authService.logout();
        localStorage.removeItem(locStorItems.userName);
        this.router.navigate(['/login']);
    }

    getUser()   {
        return this.authService.getUser();
    }

}
