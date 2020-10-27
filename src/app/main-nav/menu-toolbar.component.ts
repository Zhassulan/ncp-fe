import {AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, isDevMode, OnDestroy, Output} from '@angular/core';
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
    styleUrls: ['./menu-toolbar.component.scss']
})
export class MenuToolbarComponent implements AfterViewChecked, OnDestroy {

    isWait: boolean;
    subscription: Subscription;

    routes: ROUTE[] = [
        {
            icon: 'credit_card',
            route: 'payments',
            title: 'Платежи',
        },
        {
            icon: 'description',
            route: 'templates',
            title: 'Шаблоны',
        },
        {
            icon: 'credit_card',
            route: 'raw',
            title: 'Неизвестные платежи',
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
        this.subscription = this.appService.progressAnnounced$.subscribe(
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

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    color() {
        return isDevMode() ? "{'background-color': #3F51B5;}" : "{'background-color': #46BD4E;}" ;
    }

    isDevMode() {
        return isDevMode();
    }

}
