import {NgxLoggerLevel} from 'ngx-logger';

export const environment = {

    production: false,
    apiUrlRoot: 'http://localhost:8080/onlinebank/dataservice',
    apiUrl: 'http://localhost:8080/onlinebank/dataservice/exdata',
    logging: {
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.DEBUG,
        serverLoggingUrl: 'http://localhost/api/v1/ncp/log'
    },

};