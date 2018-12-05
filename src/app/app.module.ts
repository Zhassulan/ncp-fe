import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {UploadModule} from './upload/upload.module';
import {LayoutComponent} from './layout/layout.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {ContentComponent} from './content/content.component';
import {
    RouterModule,
    Routes
} from '@angular/router';
import {UploadComponent} from './upload/upload.component';
import {NavigatorComponent} from './navigator/navigator.component';
//import { FlexLayoutModule } from '@angular/flex-layout';
import {AUTH_PROVIDERS} from './auth.service';
import {LoggedInGuard} from './logged-in.guard';
import {MatToolbarModule} from '@angular/material';
import { AuthComponent } from './auth/auth.component';
import {HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'auth', component: AuthComponent},
    {path: 'home', component: AppComponent},
    {path: 'upload', component: UploadComponent}
];

@NgModule({
    declarations: [
        AppComponent,
        LayoutComponent,
        ContentComponent,
        NavigatorComponent,
        AuthComponent,
        ],
    imports: [
        BrowserModule,
        UploadModule,
        MatGridListModule,
        RouterModule.forRoot(routes),
        MatToolbarModule,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'My-Xsrf-Cookie',
            headerName: 'My-Xsrf-Header',
        }),
        ],
    providers: [
        AUTH_PROVIDERS,
        LoggedInGuard,
        CookieService
        ],
    bootstrap: [AppComponent]
})



export class AppModule {
}


