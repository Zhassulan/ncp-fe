import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginPageComponent} from '../auth/login-page/login-page.component';
import {UploadComponent} from '../payments/payment/equipment/upload.component';
import {PaymentComponent} from '../payments/payment/payment.component';
import {PaymentsComponent} from '../payments/payments.component';
import {RegistriesComponent} from '../registry/registries/registries.component';
import {RegistryComponent} from '../registry/registry/registry.component';
import {PageNotFoundComponent} from '../page-not-found/page-not-found.component';
import {ClientsComponent} from '../clients/clients.component';
import {ClientPaymentsComponent} from '../clients/client-payments/client-payments.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'payments',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginPageComponent
    },
    /*
    {
        path: '',
        redirectTo: 'payments',
        pathMatch: 'full'},
        */
    //{path: 'payments', redirectTo: 'payment/230365'}, //для открытия конкретного платежа для отладки
    {
        path: 'payments',
        component: PaymentsComponent,
        /*canActivate: [LoggedInGuard],*/
        data: {
            breadcrumb: 'Платежи'
        }
    },
    {
        path: 'payments/:id',
        component: PaymentComponent,
        /*canActivate: [LoggedInGuard],*/
        data: {
            breadcrumb: 'Платёж'
        }
    },
    {
        path: 'clients',
        component: ClientsComponent,
        /*canActivate: [LoggedInGuard],*/
        data: {
            breadcrumb: 'Клиенты'
        }
    },
    {
        path: 'clients/:id/payments',
        component: ClientPaymentsComponent,
      /*  canActivate: [LoggedInGuard],*/
        data: {
            breadcrumb: 'Платежи'
        }
    },
    {
        path: 'equipment',
        component: UploadComponent,
       /* canActivate: [LoggedInGuard],*/
        data: {
            breadcrumb: 'Оборудование'
        }
    },
    {
        path: 'registries',
        component: RegistriesComponent,
       /* canActivate: [LoggedInGuard],*/
        data: {
            breadcrumb: 'Реестры'
        }
    },
    {
        path: 'registries/:id',
        component: RegistryComponent,
       /* canActivate: [LoggedInGuard],*/
        data: {
            breadcrumb: 'Реестр'
        }
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forRoot(routes, {useHash: true})
    ],
    exports: [RouterModule]
})
export class RoutesModule {
}

