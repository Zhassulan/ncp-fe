import {NgxLoggerLevel} from 'ngx-logger';

export const environment = {

    production: false,
    apiUrl: 'https://test.tele2.kz/onlinebank/dataservice',
    logging: {
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.DEBUG,
        serverLoggingUrl: 'https://test.tele2.kz/onlinebank/dataservice/logging/log'
    },

};
