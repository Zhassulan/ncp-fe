import {NgxLoggerLevel} from 'ngx-logger';

export const environment = {

    production: true,
    //apiUrl: 'http://b2b.tele2.kz:8130/onlinebank/dataservice',
    apiUrl: 'https://b2b.tele2.kz/onlinebank/dataservice',
    logging: {
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.DEBUG,
        serverLoggingUrl: 'https://b2b.tele2.kz/onlinebank/dataservice/exdata/log'
    },

};
