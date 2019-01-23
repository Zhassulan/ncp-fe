import {NgxLoggerLevel} from 'ngx-logger';

export const environment = {
    production: true,
    logging: {
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.DEBUG,
        serverLoggingUrl: 'https://b2b.tele2.kz/onlinebank/dataservice/logging/log'
    },
    urlGetNcpPaymentsRange: 'https://b2b.tele2.kz/onlinebank/dataservice/exdata/ncpPayments',
    urlPaymentToTransit: 'https://b2b.tele2.kz/onlinebank/dataservice/exdata/paymentToTransit',
    urlValidateLogin: 'https://b2b.tele2.kz/onlinebank/dataservice/auth/validateLogin',
    urlValidateAuthorization : 'https://b2b.tele2.kz/onlinebank/dataservice/auth/validateAuthorization',
    urlDeleteTransitPayment: 'https://b2b.tele2.kz/onlinebank/dataservice/exdata/deleteTransitPayment',
    urlUploadEquipment: 'https://b2b.tele2.kz/onlinebank/dataservice/exdata/uploadEquipment',
    urlNewRawPayment: 'https://b2b.tele2.kz/onlinebank/dataservice/exdata/newRawPayment',
    urlGetNcpPaymentByRawId: 'https://b2b.tele2.kz/onlinebank/dataservice/exdata/getNcpPaymentByRawId',
};
