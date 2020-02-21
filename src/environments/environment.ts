import {NgxLoggerLevel} from 'ngx-logger';

export const environment = {

    production: false,
    apiUrl: 'http://localhost/api/v1/ncp',
    logging: {
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.DEBUG,
        serverLoggingUrl: 'http://localhost/api/v1/ncp/log'
    },

};