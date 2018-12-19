import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {AppModule} from '../app.module';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnChanges {

    private _login: string;
    private _jsessiondid: string;

    constructor(private route: ActivatedRoute, private router: Router, private cookieService: CookieService) {
        route.params.subscribe(params => {this._login = params['login'], this._jsessiondid = params['jsessionid']});
        localStorage.setItem('user', this._login);
        localStorage.setItem('jsessionid', this._jsessiondid);
        cookieService.set('login', this._login);
        cookieService.set('JSESSIONID', this._jsessiondid);
        console.log('user: ' + this._login + ', jsessionid = ' + this._jsessiondid);
        router.navigate(['/home']);
    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    get login(): string {
        return this._login;
    }

    get jsessiondid(): string {
        return this._jsessiondid;
    }
}
