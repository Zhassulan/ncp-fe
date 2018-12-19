import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    Routes,
    RouterModule
} from '@angular/router';
import {NcpPaymentsComponent} from '../ncp-payments/ncp-payments.component';

const routes: Routes = [
    {path: '', component: NcpPaymentsComponent, pathMatch: 'full'},
    {
        path: 'onlinebank', children: [
            {
                path: 'payment', children: [
                    {path: 'ncp', component: NcpPaymentsComponent},
                    {path: 'unknown', component: NcpPaymentsComponent},
                    {path: 'auto', component: NcpPaymentsComponent},
                ]
            },
        ]
    },
    {
        path: 'client', children: [
            {
                path: 'payment', children: [
                    {path: 'ncp', component: NcpPaymentsComponent},
                    {path: 'unknown', component: NcpPaymentsComponent},
                    {path: 'auto', component: NcpPaymentsComponent},
                ]
            },
        ]
    }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class RoutesModule {
}
