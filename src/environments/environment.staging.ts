import {NgxLoggerLevel} from 'ngx-logger';

export const environment = {
    production: false,
    logging: {
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.DEBUG,
        serverLoggingUrl: 'http://b2b.tele2.kz:8130/onlinebank/dataservice/logging/log'
    },
    urlGetNcpPaymentsRange: 'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/ncpPayments',
    urlPaymentToTransit: 'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/paymentToTransit',
    urlValidateLogin: 'http://b2b.tele2.kz:8130/onlinebank/dataservice/auth/validateLogin',
    urlValidateAuthorization : 'http://b2b.tele2.kz:8130/onlinebank/dataservice/auth/validateAuthorization',
    urlDeleteTransitPayment: 'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/deleteTransitPayment',
    urlUploadEquipment: 'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/uploadEquipment',
    urlNewRawPayment: 'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/newRawPayment',
    urlGetNcpPaymentByRawId: 'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/getNcpPaymentByRawId',
    urlGetPaymentDetails: 'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/getPaymentDetails',
};
