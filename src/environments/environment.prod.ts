import {NgxLoggerLevel} from 'ngx-logger';

export const environment = {
    production: true,
    urlGetNcpPaymentsRange: 'https://b2b.tele2.kz/onlinebank/dataservice/exdata/ncpPayments',
    urlPaymentToTransit: 'https://b2b.tele2.kz/onlinebank/dataservice/exdata/distributeTransitPayment',
    urlValidateLogin: 'https://b2b.tele2.kz/onlinebank/dataservice/auth/validateLogin',
    urlValidateAuthorization : 'https://b2b.tele2.kz/onlinebank/dataservice/auth/validateAuthorization',
    logging: {
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.DEBUG,
        serverLoggingUrl: 'https://b2b.tele2.kz/onlinebank/dataservice/logging/log'
    }
};
