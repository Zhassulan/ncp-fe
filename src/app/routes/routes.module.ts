import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    Routes,
    RouterModule
} from '@angular/router';
import {NcpPaymentsComponent} from '../ncp-payments/ncp-payments.component';
import {LoginComponent} from '../auth/login/login.component';
import {LoginPageComponent} from '../auth/login-page/login-page.component';
import {LoggedInGuard} from '../auth/logged-in.guard';

const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: NcpPaymentsComponent, canActivate: [ LoggedInGuard ]},
    {path: 'login', component: LoginPageComponent}
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class RoutesModule {
}
