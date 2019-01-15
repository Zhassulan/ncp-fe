import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AUTH_PROVIDERS, AuthService} from './auth/auth.service';
import {LoggedInGuard} from './auth/logged-in.guard';
import {HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {LoginComponent} from './auth/login/login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NcpPaymentsComponent} from './payments/ncp-payments.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MenuToolbarComponent} from './menu-toolbar/menu-toolbar.component';
import {MaterialsModule} from './materials/materials.module';
import {RoutesModule} from './routes/routes.module';
import {MAT_DATE_LOCALE, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule} from '@angular/material';
import {PaymentStatusRuPipe} from './payments/payment-status-ru-pipe';
import {DialogReportComponent} from './dialog/dialog-report/dialog-report.component';
import {DialogService} from './dialog/dialog.service';
import {DataService} from './data/data.service';
import {PaymentDetailsPipe} from './payments/payment-details-pipe';
import {LoginPageComponent} from './auth/login-page/login-page.component';
import {LoggerModule} from 'ngx-logger';
import {environment} from '../environments/environment';
import {ViewPaymentComponent} from './payments/view-payment/view-payment.component';
import {UploadComponent} from './equipment/upload.component';
import {LayoutModule} from '@angular/cdk/layout';
import {BreadcrumbModule} from 'angular-crumbs';
import {DialogComponent} from './equipment/dialog/dialog.component';
import {UploadFilePaymentService} from './equipment/upload-file-payment.service';
import { FilePaymentViewComponent } from './equipment/file-payment-view/file-payment-view.component';

@NgModule({
    declarations: [
        AppComponent,
        NcpPaymentsComponent,
        LoginComponent,
        MenuToolbarComponent,
        PaymentStatusRuPipe,
        DialogReportComponent,
        PaymentDetailsPipe,
        LoginPageComponent,
        ViewPaymentComponent,
        UploadComponent,
        DialogComponent,
        FilePaymentViewComponent
    ],
    entryComponents: [
        DialogReportComponent,
        LoginComponent,
        DialogComponent
    ],
    imports: [
        MaterialsModule,
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
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        /*
        HttpClientXsrfModule.withOptions({
            cookieName: 'My-Xsrf-Cookie',
            headerName: 'My-Xsrf-Header',
        }),*/
        BreadcrumbModule
    ],
    providers: [
        AUTH_PROVIDERS,
        LoggedInGuard,
        CookieService,
        {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
        DialogService,
        DataService,
        AuthService,
        UploadFilePaymentService
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}


