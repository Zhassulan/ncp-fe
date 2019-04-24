import {NgxLoggerLevel} from 'ngx-logger';

export const environment = {

    production: false,
    apiUrl: 'http://localhost:8080/onlinebank/dataservice',
    logging: {
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.DEBUG,
        serverLoggingUrl: 'http://localhost:8080/onlinebank/dataservice/logging/log'
    },

};