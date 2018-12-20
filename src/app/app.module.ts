import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {UploadModule} from './upload/upload.module';
import {NavigatorComponent} from './navigator/navigator.component';
import {AUTH_PROVIDERS} from './auth/auth.service';
import {LoggedInGuard} from './auth/logged-in.guard';
import {AuthComponent} from './auth/auth.component';
import {HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {LoginComponent} from './login/login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TopNavComponent} from './navigator/top-nav/top-nav.component';
import {MenuListItemComponent} from './menu-list-item/menu-list-item.component';
import {NcpPaymentsComponent} from './ncp-payments/ncp-payments.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MenuToolbarComponent} from './menu-toolbar/menu-toolbar.component';
import {MaterialsModule} from './materials/materials.module';
import {RoutesModule} from './routes/routes.module';
import {MAT_DATE_LOCALE} from '@angular/material';
import {PaymentStatusRuPipe} from './payment-status-ru-pipe';
import {HighlightDistributed} from './highlight-distributed';

@NgModule({
    declarations: [
        AppComponent,
        NcpPaymentsComponent,
        NavigatorComponent,
        AuthComponent,
        LoginComponent,
        TopNavComponent,
        MenuListItemComponent,
        MenuToolbarComponent,
        PaymentStatusRuPipe,
        HighlightDistributed
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
        {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'}
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}


