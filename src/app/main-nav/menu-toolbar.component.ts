import {AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Output} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AppService} from '../app.service';

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

    routes: ROUTE[] = [
        {
            icon: 'credit_card',
            route: 'payments',
            title: 'Платежи',
        },
        {
            icon: 'dashboard',
            route: 'clients',
            title: 'Клиенты',
        },
        {
            icon: 'dashboard',
            route: 'mobipay',
            title: 'Mobipay',
        },
        {
            icon: 'assignment_ind',
            route: 'registries',
            title: 'Реестры',
        }
    ];

    @Output() toggleSidenav = new EventEmitter<void>();

    constructor(private authService: AuthService,
                private router: Router,
                private cdRef:ChangeDetectorRef,
                private appService: AppService) {
        this.progressSubscription = this.appService.progressAnnounced$.subscribe(
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
        this.router.navigate(['login']);
    }

    getUser() {
        return this.authService.getUser();
    }

}
