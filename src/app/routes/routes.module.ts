import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    Routes,
    RouterModule, ROUTES
} from '@angular/router';
import {NcpPaymentsComponent} from '../payments/ncp-payments.component';
import {LoginPageComponent} from '../auth/login-page/login-page.component';
import {LoggedInGuard} from '../auth/logged-in.guard';
import {UploadComponent} from '../equipment/upload.component';
import {FilePaymentViewComponent} from '../equipment/file-payment-view/file-payment-view.component';
import {ViewPaymentComponent} from '../payments/payment/view-payment.component';

const routes: Routes = [
    {path: '', redirectTo: 'payments', pathMatch: 'full'},
    {path: 'payments', component: NcpPaymentsComponent, canActivate: [LoggedInGuard], data: {breadcrumb: 'Платежи'}},
    {path: 'login', component: LoginPageComponent},
    {path: 'equipment', component: UploadComponent, canActivate: [LoggedInGuard], data: {breadcrumb: 'Оборудование'}},
    {path: 'filePayment', component: FilePaymentViewComponent, canActivate: [LoggedInGuard], data: {breadcrumb: 'Оборудование - Платёж'}},
    {path: 'payment', component: ViewPaymentComponent, canActivate: [LoggedInGuard], data: {breadcrumb: 'Платёж'}},
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

