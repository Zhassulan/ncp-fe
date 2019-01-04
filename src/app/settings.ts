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
export const shrinkDetailsColumnSize = 200;
export const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};
export const ldapGroups = {
    tele2users: 'itdev-ncp-user-tele2'
};
export const enum timeouts {
    timeoutAfterLoginInput = 3000,
    showMsgDelay = 6000
}
export const enum rests {
    restResultOk = 'ok',
    restResultErr = 'error'
}
export const enum msgs {
    msgNoRights = 'Извините, нет разрешений на использование приложения.',
    msgSysErrRights = 'Системная ошибка проверки разрешений.',
    msgWrongCreds = 'Не верный пользователь или пароль.',
    msgSysErrCreds = 'Системная ошибка проверки логина/пароля.'
}
export const localStorageTokenName = 'token';
export const enum logLevel {
    info = 1,
    warn = 3,
    error = 4
}

export class Settings {
}
