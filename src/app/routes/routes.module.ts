import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginPageComponent} from '../auth/login-page/login-page.component';
import {UploadComponent} from '../payment/router/upload.component';
import {PaymentComponent} from '../payment/payment.component';
import {PaymentsComponent} from '../payments/payments.component';
import {RegistriesComponent} from '../registry/registries/registries.component';
import {RegistryComponent} from '../registry/registry/registry.component';
import {PageNotFoundComponent} from '../page-not-found/page-not-found.component';
import {ClientsComponent} from '../clients/clients.component';
import {ClientPaymentsComponent} from '../clients/client-payments/client-payments.component';
import {MobipayComponent} from '../mobipay/mobipay.component';
import {RawComponent} from '../raw/raw.component';
import {TemplatesComponent} from '../template/templates/templates.component';
import {TemplatesTableComponent} from '../template/templates-table/templates-table.component';
import {TemplateComponent} from '../template/template/template.component';

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
        path: 'templates',
        component: TemplatesComponent,
        data: {
            breadcrumb: 'Шаблоны'
        }
    },
    {
        path: 'raw',
        component: RawComponent,
        data: {
            breadcrumb: 'Неизвестные платежи'
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
        component: MobipayComponent,
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
        path: 'templates/company/:id',
        component: TemplatesComponent,
        data: {
            breadcrumb: 'Шаблоны'
        }
    },
    {
        path: 'templates/:id',
        component: TemplateComponent,
        data: {
            breadcrumb: 'Шаблон'
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

