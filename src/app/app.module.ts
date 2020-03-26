import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AUTH_PROVIDERS, AuthService} from './auth/auth.service';
import {LoggedInGuard} from './auth/logged-in.guard';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {LoginComponent} from './auth/login/login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule, registerLocaleData} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MenuToolbarComponent} from './main-nav/menu-toolbar.component';
import {RoutesModule} from './routes/routes.module';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {PaymentStatusRuPipe} from './payments/payment-status-ru-pipe';
import {DialogReportComponent} from './dialog/dialog-report/dialog-report.component';
import {DialogService} from './dialog/dialog.service';
import {PaymentDetailsPipe} from './payments/payment-details-pipe';
import {LoginPageComponent} from './auth/login-page/login-page.component';
import {LoggerModule} from 'ngx-logger';
import {environment} from '../environments/environment';
import {UploadComponent} from './payments/payment/equipment/upload.component';
import {LayoutModule} from '@angular/cdk/layout';
import {BreadcrumbModule} from 'angular-crumbs';
import {DialogComponent} from './payments/payment/equipment/dialog/dialog.component';
import {UploadFilePaymentService} from './payments/payment/equipment/upload-file-payment.service';
import localeRu from '@angular/common/locales/ru';
import {UserService} from './user/user.service';
import {PaymentsService} from './payments/payments.service';
import {PhonePipe} from './payments/payment/phone-pipe';
import {PaymentMenuComponent} from './payments/payment/menu/payment-menu.component';
import {PaymentService} from './payments/payment/payment.service';
import {InfoComponent} from './payments/payment/info/info.component';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {DetailsComponent} from './payments/payment/details/details.component';
import {PaymentComponent} from './payments/payment/payment.component';
import {PaymentsComponent} from './payments/payments.component';
import {AddDetailComponent} from './payments/payment/add-detail/add-detail.component';
import {RegistriesComponent} from './registry/registries/registries.component';
import {AppService} from './app.service';
import {ExcelService} from './excel/excel.service';
import {FileSaverModule} from 'ngx-filesaver';
import {RegistryComponent} from './registry/registry/registry.component';
import {RegistryService} from './registry/registry.service';
import {RegistryDetailsComponent} from './registry/registry/registry-details/registry-details.component';
import {RegistryPropertiesComponent} from './registry/registry/registry-properties/registry-properties.component';
import {SessionService} from './auth/session.service';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {DateRangeComponent} from './date-range/date-range.component';
import {AuthInterceptor} from './auth/auth-interceptor';
import {MaterialsModule} from './materials/materials.module';
import {AddRegistryModalComponent} from './payments/payment/add-registry-modal/add-registry-modal.component';
import {CalendarDeferModalComponent} from './payments/payment/calendar-defer-modal/calendar-defer-modal.component';
import { ClientsComponent } from './clients/clients.component';
import { ListComponent } from './clients/list/list.component';
import {PayDataService} from './data/pay-data-service';
import {AppDataService} from './data/app-data-service';
import {ClientDataService} from './data/client-data-service';
import { ClientPaymentsComponent } from './clients/client-payments/client-payments.component';

registerLocaleData(localeRu, 'ru');

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        MenuToolbarComponent,
        PaymentStatusRuPipe,
        DialogReportComponent,
        PaymentDetailsPipe,
        LoginPageComponent,
        UploadComponent,
        DialogComponent,
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
        AddRegistryModalComponent,
        CalendarDeferModalComponent,
        ClientsComponent,
        ListComponent,
        ClientPaymentsComponent
    ],
    entryComponents: [
        DialogReportComponent,
        LoginComponent,
        DialogComponent,
        AddRegistryModalComponent,
        CalendarDeferModalComponent
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
        LoggerModule.forRoot(environment.logging),
        LayoutModule,
        BreadcrumbModule,
        SimpleNotificationsModule.forRoot(),
        FileSaverModule,
        MaterialsModule
    ],
    providers: [
        AUTH_PROVIDERS,
        LoggedInGuard,
        CookieService,
        {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
        {provide: LOCALE_ID, useValue: 'ru-RU'},
        DialogService,
        PayDataService,
        AppDataService,
        ClientDataService,
        AuthService,
        UploadFilePaymentService,
        UserService,
        PaymentsService,
        PaymentService,
        AppService,
        ExcelService,
        RegistryService,
        SessionService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
