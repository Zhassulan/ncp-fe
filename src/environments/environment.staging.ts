import {NgxLoggerLevel} from 'ngx-logger';

export const environment = {
    production: false,
    urlGetNcpPaymentsRange: 'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/ncpPayments',
    urlPaymentToTransit: 'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/distributeTransitPayment',
    urlValidateLogin: 'http://b2b.tele2.kz:8130/onlinebank/dataservice/auth/validateLogin',
    urlValidateAuthorization : 'http://b2b.tele2.kz:8130/onlinebank/dataservice/auth/validateAuthorization',
    logging: {
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.DEBUG,
        serverLoggingUrl: 'http://b2b.tele2.kz:8130/onlinebank/dataservice/logging/log'
    }
};
