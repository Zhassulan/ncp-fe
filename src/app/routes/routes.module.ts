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
    {
        path: 'payments',
        component: PaymentsComponent,
        data: {
            breadcrumb: 'Платежи'
        }
    },
    {
        path: 'payments/:id',
        component: PaymentComponent,
        data: {
            breadcrumb: 'Платёж'
        }
    },
    {
        path: 'clients',
        component: ClientsComponent,
        data: {
            breadcrumb: 'Клиенты'
        }
    },
    {
        path: 'mobipay',
        component: ClientsComponent,
        data: {
            breadcrumb: 'Mobipay'
        }
    },
    {
        path: 'clients/:id/payments',
        component: ClientPaymentsComponent,
        data: {
            breadcrumb: 'Платежи клиента'
        }
    },
    {
        path: 'equipment',
        component: UploadComponent,
        data: {
            breadcrumb: 'Оборудование'
        }
    },
    {
        path: 'registries',
        component: RegistriesComponent,
        data: {
            breadcrumb: 'Реестры'
        }
    },
    {
        path: 'registries/:id',
        component: RegistryComponent,
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

