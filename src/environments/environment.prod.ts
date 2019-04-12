import {NgxLoggerLevel} from 'ngx-logger';

export const environment = {
    production: true,
    logging: {
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.DEBUG,
        serverLoggingUrl:  '/onlinebank/dataservice/logging/log'
    },
    urlGetNcpPaymentsRange:  'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/ncpPayments',
    urlPaymentToTransit:  'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/paymentToTransit',
    urlValidateLogin:  'http://b2b.tele2.kz:8130/onlinebank/dataservice/auth/validateLogin',
    urlValidateAuthorization :  'http://b2b.tele2.kz:8130/onlinebank/dataservice/auth/validateAuthorization',
    urlDeleteTransitPayment:  'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/deleteTransitPayment',
    urlUploadEquipment:  'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/uploadEquipment',
    urlNewRawPayment:  'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/newRawPayment',
    urlGetNcpPaymentByRawId:  'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/getNcpPaymentByRawId',
    urlGetPaymentDetails:  'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/getPaymentDetails',
    urlDistributePayment:  'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/distributePayment',
    urlNewPaymentDetail:  'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/newPaymentDetail',
    urlNewEquipment:  'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/newEquipment',
    urlGetPayment:  'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/payment',
    urlGetPaymentEquipments:  'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/equipments',
    urlGetDealerInfoByIcc:  'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/dealerByIcc',
    urlPaymentsByPage:  'http://b2b.tele2.kz:8130/onlinebank/dataservice/exdata/ncpPaymentsByPage'
};
