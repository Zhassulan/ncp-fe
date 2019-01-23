import {HttpHeaders} from '@angular/common/http';

export enum PaymentStatus {
    STATUS_NEW = 0,
    STATUS_DISTRIBUTED = 1,
    STATUS_ERROR = 2,
    STATUS_EXPIRED = 3,
    STATUS_DELETED = 4,
    STATUS_SCHEDULED = 5,
    STATUS_TRANSIT = 6,
    STATUS_TRANSIT_DISTRIBUTED = 7,
    STATUS_TRANSIT_CANCELLED = 8,
    STATUS_TRANSIT_ERROR = 9
}

export enum PaymentStatusRu {
    'Новый',
    'Разнесён',
    'Ошибка',
    'Просрочен',
    'Удалён',
    'Запланирован',
    'На транзитном счёте',
    'Разнесён с транзитного счёта',
    'Удалён с транзитного счёта',
    'Ошибка разнесения с тразитного счёта'
}

export const shrinkDetailsColumnSize: number = 200;

export const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

export const ldapGroups = {
    tele2users: 'itdev-ncp-user-tele2'
};

export const roles = {
    cc: ldapGroups.tele2users,
    finance: ldapGroups.tele2users
};

export const enum timeouts {
    timeoutAfterLoginInput = 3000,
    showMsgDelay = 6000
}

export const enum rests {
    restResultOk = 'ok',
    restResultErr = 'error',
    restResultErrDb = 'error_database'
}

export const enum msgs {
    msgLoggedSuccess = 'Успешно выполнен логин.',
    msgNoRights = 'Извините, нет разрешений на использование приложения.',
    msgSysErrRights = 'Системная ошибка проверки разрешений.',
    msgWrongCreds = 'Не верный пользователь или пароль.',
    msgSysErrCreds = 'Системная ошибка проверки логина/пароля.',
    msgErrLoadData = 'Ошибка загрузки данных.',
    msgErrToTransit = 'Ошибка переноса на транзитный счёт.',
    msgSuccessToTransit = 'Платёж успешно перенесён на тразнитный счёт.',
    msgSuccessDelTransit = 'Успешно удалён с транзитного счёта.',
    msgErrDelTransit = 'Ошибка удаления с транзитного счёта.',
    msgErrUploadFilePayment = 'Ошибка загрузки файлового платежа.',
    msgSuccessNewRawPayment = 'Успешно создан грязный платёж.',
    msgErrNewRawPayment = 'Ошибка при создании грязного платежа.',
    msgErrGetNcpPaymentByRawId = 'Ошибка получения NCP платежа по грязному платежу.',
    msgSuccessGetNcpPaymentByRawId = 'Успешно получен NCP платёж по грязному платежу.'
}

export enum locStorItems {
    tokenName = 'token',
    userName = 'username',
    version = 'version'
}

export const appVer: number = 1;

export class Settings {
}
