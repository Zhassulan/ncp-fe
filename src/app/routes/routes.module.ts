import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    Routes,
    RouterModule
} from '@angular/router';
import {LoginPageComponent} from '../auth/login-page/login-page.component';
import {LoggedInGuard} from '../auth/logged-in.guard';
import {UploadComponent} from '../payments/payment/equipment/upload.component';
import {PaymentComponent} from '../payments/payment/payment.component';
import {PaymentsComponent} from '../payments/payments.component';
import {RegistriesComponent} from '../registry/registries/registries.component';
import {RegistryComponent} from '../registry/registry/registry.component';
import {PageNotFoundComponent} from '../page-not-found/page-not-found.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'main',
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
    //{path: 'payments', redirectTo: 'payment/230365'}, //для открытия конкретного платежа для отладки TODO убрать в проде
    {
        path: 'main',
        component: PaymentsComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Платежи'
        }
    },
    {
        path: 'payments',
        component: PaymentsComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Платежи'
        }
    },
    {
        path: 'payment/:id',
        component: PaymentComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Платёж'
        }
    },
    {
        path: 'equipment',
        component: UploadComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Оборудование'
        }
    },
    {
        path: 'registry',
        component: RegistriesComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Реестры'
        }
    },
    {
        path: 'registry/all',
        component: RegistriesComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Реестры'
        }
    },
    {
        path: 'registry/:id',
        component: RegistryComponent,
        canActivate: [LoggedInGuard],
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

