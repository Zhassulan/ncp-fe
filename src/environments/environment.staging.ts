import {NgxLoggerLevel} from 'ngx-logger';

export const environment = {

    production: false,
    apiUrl: 'http://b2b.tele2.kz:8130/onlinebank/dataservice',
    logging: {
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.DEBUG,
        serverLoggingUrl: 'http://b2b.tele2.kz:8130/onlinebank/dataservice/logging/log'
    },

};
