import {BrowserModule, Title} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AUTH_PROVIDERS, AuthService} from './auth/auth.service';
import {AuthGuard} from './auth/auth-guard.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {DlgLoginComponent} from './auth/login/dlg-login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule, registerLocaleData} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MenuToolbarComponent} from './main-nav/menu-toolbar.component';
import {RoutesModule} from './routes/routes.module';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import {PaymentStatusRuPipe} from './payments/payment-status-ru-pipe';
import {DlgResultComponent} from './dialog/dialog-report/dlg-result.component';
import {DlgService} from './dialog/dlg.service';
import {PaymentDetailsPipe} from './payments/payment-details-pipe';
import {LoginPageComponent} from './auth/login-page/login-page.component';

import {LayoutModule} from '@angular/cdk/layout';
import {BreadcrumbModule} from 'angular-crumbs';
import {DlgImportRouterRegistryComponent} from './payment/dialog/dlg-import-router-registry.component';
import localeRu from '@angular/common/locales/ru';
import {PhonePipe} from './payment/phone-pipe';
import {PaymentMenuComponent} from './payment/menu/payment-menu.component';
import {PaymentService} from './payment/payment.service';
import {InfoComponent} from './payment/info/info.component';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {PaymentComponent} from './payment/payment.component';
import {PaymentsComponent} from './payments/payments.component';
import {AppService} from './app.service';
import {ExcelService} from './excel/excel.service';
import {FileSaverModule} from 'ngx-filesaver';
import {RegistryComponent} from './public-registry/registry/registry.component';

import {RegistryDetailsComponent} from './public-registry/registry-details/registry-details.component';
import {RegistryPropertiesComponent} from './public-registry/registry-properties/registry-properties.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {DateRangeComponent} from './date-range/date-range.component';
import {AuthInterceptor} from './auth/auth-interceptor';
import {MaterialsModule} from './materials/materials.module';
import {ClientsComponent} from './clients/clients.component';
import {ListComponent} from './clients/list/list.component';
import {PaymentRepository} from './payment/paymet-repository';
import {AppDataService} from './app-data-service';
import {ClientRepository} from './clients/client-repository';
import {ClientPaymentsComponent} from './clients/client-payments/client-payments.component';
import {ClientPaymentsTableComponent} from './clients/client-payments-table/client-payments-table.component';
import {RouterService} from './router/router.service';
import {PaymentsTableComponent} from './payments/payments-table/payments-table.component';
import {MobipayComponent} from './mobipay/mobipay.component';
import {DlgMobipayPartnersComponent} from './mobipay/partners/dlg-mobipay-partners.component';
import {DetailsComponent} from './payment/details/details.component';
import {AddDetailComponent} from './payment/add-detail/add-detail.component';
import {DlgDeferComponent} from './payment/calendar-defer-modal/dlg-defer.component';
import {UploadComponent} from './payment/router/upload.component';
import {DlgRegistryBufferComponent} from './payment/add-registry-modal/dlg-registry-buffer.component';
import {MyDateAdapter} from './my-date-adapter';
import {RawComponent} from './raw/raw.component';
import {RawTableComponent} from './raw/raw-table/raw-table.component';
import {DlgImportLimits} from './mobipay/limits/dialog/dlg-import-limits.component';
import {TemplatesComponent} from './template/templates/templates.component';
import {TemplatesTableComponent} from './template/templates-table/templates-table.component';
import {TemplateComponent} from './template/template/template.component';
import {RegistriesComponent} from './public-registry/registries/registries.component';
import {TemplateService} from './template/template.service';
import {TemplateRepository} from './template/template-repository';
import {ClientService} from './clients/client.service';
import {MobipayService} from './mobipay/mobipay.service';
import {MobipayRepository} from './mobipay/mobipay-repository';
import {PublicRegistryRepository} from './public-registry/public-registry-repository';

registerLocaleData(localeRu, 'ru');

@NgModule({
    declarations: [
        AppComponent,
        DlgLoginComponent,
        MenuToolbarComponent,
        PaymentStatusRuPipe,
        DlgResultComponent,
        PaymentDetailsPipe,
        LoginPageComponent,
        UploadComponent,
        DlgImportRouterRegistryComponent,
        PhonePipe,
        PaymentMenuComponent,
        InfoComponent,
        PaymentComponent,
        DetailsComponent,
        PaymentsComponent,
        AddDetailComponent,
        RegistriesComponent,
        RegistryComponent,
        RegistryDetailsComponent,
        RegistryPropertiesComponent,
        PageNotFoundComponent,
        DateRangeComponent,
        DlgRegistryBufferComponent,
        DlgDeferComponent,
        ClientsComponent,
        ListComponent,
        ClientPaymentsComponent,
        ClientPaymentsTableComponent,
        PaymentsTableComponent,
        MobipayComponent,
        DlgMobipayPartnersComponent,
        RawComponent,
        RawTableComponent,
        DlgImportLimits,
        TemplatesComponent,
        TemplatesTableComponent,
        TemplateComponent,
    ],
    entryComponents: [
        DlgResultComponent,
        DlgLoginComponent,
        DlgImportRouterRegistryComponent,
        DlgRegistryBufferComponent,
        DlgDeferComponent,
        DlgMobipayPartnersComponent,
        DlgImportLimits
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RoutesModule,
        FlexLayoutModule,
        LayoutModule,
        BreadcrumbModule,
        SimpleNotificationsModule.forRoot(),
        FileSaverModule,
        MaterialsModule
    ],
    providers: [
        AUTH_PROVIDERS,
        AuthGuard,
        CookieService,
        {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
        {provide: LOCALE_ID, useValue: 'ru-RU'},
        {provide: DateAdapter, useClass: MyDateAdapter},
        DlgService,
        PaymentRepository,
        AppDataService,
        ClientRepository,
        AuthService,
        RouterService,
        PaymentService,
        AppService,
        ExcelService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        Title,
        TemplateService,
        TemplateRepository,
        ClientService,
        MobipayService,
        MobipayRepository,
        PublicRegistryRepository,
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
