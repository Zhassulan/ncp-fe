import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-menu-toolbar',
    templateUrl: './menu-toolbar.component.html',
    styleUrls: ['./menu-toolbar.component.css']
})
export class MenuToolbarComponent implements OnInit {

    constructor(private authService: AuthService, private router: Router) {
    }

    ngOnInit() {
    }

    logout()    {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    getUser()   {
        return this.authService.getUser();
    }

}
