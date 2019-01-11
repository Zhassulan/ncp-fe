import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    Routes,
    RouterModule, ROUTES
} from '@angular/router';
import {NcpPaymentsComponent} from '../ncp-payments/ncp-payments.component';
import {LoginPageComponent} from '../auth/login-page/login-page.component';
import {LoggedInGuard} from '../auth/logged-in.guard';
import {EquipmentComponent} from '../equipment/equipment.component';

const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: NcpPaymentsComponent, canActivate: [LoggedInGuard]},
    {path: 'login', component: LoginPageComponent},
    {path: 'equipment', component: EquipmentComponent, canActivate: [LoggedInGuard]},
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

