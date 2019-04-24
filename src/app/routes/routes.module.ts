import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    Routes,
    RouterModule} from '@angular/router';
import {LoginPageComponent} from '../auth/login-page/login-page.component';
import {LoggedInGuard} from '../auth/logged-in.guard';
import {UploadComponent} from '../payments/payment/equipment/upload.component';
import {FilePaymentViewComponent} from '../payments/payment/equipment/file-payment-view/file-payment-view.component';
import {PaymentComponent} from '../payments/payment/payment.component';
import {PaymentsComponent} from '../payments/payments.component';

const routes: Routes = [
    {path: '', redirectTo: 'payments', pathMatch: 'full'},
    {path: 'payments', redirectTo: 'payment/230365'}, //для открытия конкретного платежа для отладки TODO убрать в проде
    {path: 'payments', component: PaymentsComponent, canActivate: [LoggedInGuard], data: {breadcrumb: 'Платежи'}},
    {path: 'login', component: LoginPageComponent},
    {path: 'equipment', component: UploadComponent, canActivate: [LoggedInGuard], data: {breadcrumb: 'Оборудование'}},
    {path: 'filePayment', component: FilePaymentViewComponent, canActivate: [LoggedInGuard], data: {breadcrumb: 'Оборудование - Платёж'}},
    {path: 'payment/:id', component: PaymentComponent, canActivate: [LoggedInGuard], data: {breadcrumb: 'Платёж'}},
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forRoot(routes, { useHash: true })
    ],
    exports: [RouterModule]
})
export class RoutesModule {
}

