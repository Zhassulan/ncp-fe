// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import {NgxLoggerLevel} from 'ngx-logger';

export const environment = {
    production: false,
    logging: {
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.DEBUG,
        serverLoggingUrl: 'http://localhost:8080/onlinebank/dataservice/logging/log'
    },
    urlGetNcpPaymentsRange: 'http://localhost:8080/onlinebank/dataservice/exdata/ncpPayments',
    urlPaymentToTransit: 'http://localhost:8080/onlinebank/dataservice/exdata/paymentToTransit',
    urlValidateLogin: 'http://localhost:8080/onlinebank/dataservice/auth/validateLogin',
    urlValidateAuthorization : 'http://localhost:8080/onlinebank/dataservice/auth/validateAuthorization',
    urlDeleteTransitPayment: 'http://localhost:8080/onlinebank/dataservice/exdata/deleteTransitPayment',
    urlUploadEquipment: 'http://localhost:8080/onlinebank/dataservice/exdata/uploadEquipment',
    urlNewRawPayment: 'http://localhost:8080/onlinebank/dataservice/exdata/newRawPayment',
    urlGetNcpPaymentByRawId: 'http://localhost:8080/onlinebank/dataservice/exdata/getNcpPaymentByRawId',
    urlGetPaymentDetails: 'http://localhost:8080/onlinebank/dataservice/exdata/getPaymentDetails',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
