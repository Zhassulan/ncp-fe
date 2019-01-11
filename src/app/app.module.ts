import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {UploadModule} from './upload/upload.module';
import {AUTH_PROVIDERS, AuthService} from './auth/auth.service';
import {LoggedInGuard} from './auth/logged-in.guard';
import {HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {LoginComponent} from './auth/login/login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NcpPaymentsComponent} from './ncp-payments/ncp-payments.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MenuToolbarComponent} from './menu-toolbar/menu-toolbar.component';
import {MaterialsModule} from './materials/materials.module';
import {RoutesModule} from './routes/routes.module';
import {MAT_DATE_LOCALE} from '@angular/material';
import {PaymentStatusRuPipe} from './ncp-payments/payment-status-ru-pipe';
import {HighlightDistributed} from './highlight-distributed';
import {DialogReportComponent} from './dialog/dialog-report/dialog-report.component';
import {DialogService} from './dialog/dialog.service';
import {DataService} from './data/data.service';
import {PaymentDetailsPipe} from './ncp-payments/payment-details-pipe';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import {LoggerModule} from 'ngx-logger';
import {environment} from '../environments/environment';
import { ViewPaymentComponent } from './ncp-payments/view-payment/view-payment.component';
import { EquipmentComponent } from './equipment/equipment.component';
import {ExcelService} from './equipment/excel.service';

@NgModule({
    declarations: [
        AppComponent,
        NcpPaymentsComponent,
        LoginComponent,
        MenuToolbarComponent,
        PaymentStatusRuPipe,
        HighlightDistributed,
        DialogReportComponent,
        PaymentDetailsPipe,
        LoginPageComponent,
        ViewPaymentComponent,
        EquipmentComponent
    ],
    entryComponents: [
        DialogReportComponent,
        LoginComponent
    ],
    imports: [
        MaterialsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        UploadModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RoutesModule,
        FlexLayoutModule,
        LoggerModule.forRoot(environment.logging),
        /*
        HttpClientXsrfModule.withOptions({
            cookieName: 'My-Xsrf-Cookie',
            headerName: 'My-Xsrf-Header',
        }),*/
    ],
    providers: [
        AUTH_PROVIDERS,
        LoggedInGuard,
        CookieService,
        {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
        DialogService,
        DataService,
        AuthService,
        ExcelService
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}


