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

export enum PaymentStatusEnRu {
    'STATUS_NEW' = 'Новый',
    'STATUS_DISTRIBUTED' = 'Разнесён',
    'STATUS_ERROR' = 'Ошибка',
    'STATUS_EXPIRED' = 'Просрочен',
    'STATUS_DELETED' = 'Удалён',
    'STATUS_SCHEDULED' = 'Запланирован',
    'STATUS_TRANSIT' = 'На транзитном счёте',
    'STATUS_TRANSIT_DISTRIBUTED' = 'Разнесён с транзитного счёта',
    'STATUS_TRANSIT_CANCELLED' = 'Удалён с транзитного счёта',
    'STATUS_TRANSIT_ERROR' = 'Ошибка разнесения с тразитного счёта'
}

export const shrinkDetailsColumnSize: number = 200;

export const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

export const ldapGroups = {
    tele2users: 'itdev-ncp-user-tele2',
    managers: 'itdev-ncp-newapp-managers',
    testers: 'itdev-ncp-newapp-testers'
};

export const roles = {
    cc: [
        ldapGroups.tele2users,
    ],
    finance: [
        ldapGroups.managers
    ],
    test: [
        ldapGroups.testers
    ]
};

export const enum timeouts {
    timeoutAfterLoginInput = 3000
}

export const enum rests {
    restResultOk = 'ok',
    restResultErr = 'error',
}

export const enum msgs {
    msgLoggedSuccess = 'Успешно выполнен логин. ',
    msgNoRights = 'Извините, нет разрешений на использование приложения. ',
    msgSysErrRights = 'Системная ошибка проверки разрешений. ',
    msgWrongCreds = 'Не верный пользователь или пароль. ',
    msgSysErrCreds = 'Системная ошибка проверки логина/пароля. ',
    msgErrLoadData = 'Ошибка загрузки данных. ',
    msgErrToTransit = 'Ошибка переноса на транзитный счёт. ',
    msgSuccessToTransit = 'Платёж успешно перенесён на тразнитный счёт. ',
    msgSuccessDelTransit = 'Успешно удалён с транзитного счёта. ',
    msgErrDelTransit = 'Ошибка удаления с транзитного счёта. ',
    msgErrUploadFilePayment = 'Ошибка загрузки файлового платежа. ',
    msgSuccessNewRawPayment = 'Успешно создан грязный платёж. ',
    msgErrNewRawPayment = 'Ошибка при создании грязного платежа. ',
    msgErrGetNcpPaymentByRawId = 'Ошибка получения NCP платежа по грязному платежу. ',
    msgSuccessGetNcpPaymentByRawId = 'Успешно получен NCP платёж по грязному платежу. ',
    msgErrTotalSum = 'Сумма платежа и сумма файла не совпадают. ',
    msgErrDocNum = 'Номер платежа не совпадает с номером в файле. ',
    msgErrRnn = 'ИИН платежа не совпадает с ИИН в файле. ',
    msgErrGetDetails = 'Ошибка получения деталей платежа. ',
    msgSuccessGotDetails = 'Успешно получены детали платежа. ',
    msgErrDistributePayment = 'Ошибка разноски. ',
    msgSuccessDistributed = 'Платёж успешно разнесён. ',
    msgErrCreateEquipment = 'Ошибка создания записи по оборудованию. ',
    msgSuccessCreateEquipment = 'Успешно создана запись по оборудованию. ',
    msgErrGetPaymentDetails = 'Ошибка получения деталей платежа. ',
    msgErrGetPaymentData = 'Ошибка получения данных платежа. ',
    msgErrNoDataFound  = 'Данные не найдены.',
    msgBadValue = 'Не верное значение.',
}

export enum locStorItems {
    tokenName = 'token',
    userName = 'username',
    version = 'version'
}

export const appVer: number = 1;
export const msisdnLength = 10;

export enum PaymentDistrStrategy {
    byAccount = 0,
    byMsisdn = 1,
    None = 2
}

export enum dic {
    prepaid = 'аванс',
}

export const detailsTableColumns = [ 'num', 'nomenclature', 'msisdn', 'icc', 'account', 'sum', 'del'];
export enum detailTableColumnsDisplay {num = '#', nomenclature = 'Номенклатура', msisdn = 'Номер', icc = 'ICC', account = 'Лицевой счёт', sum = 'Сумма', del = 'Удалить'};

export enum msgType {
    info =  0,
    warn =  1,
    error = 2,
}

export enum PaymentMenuItems {
    LOAD_EQUIPMENT = 1,
    DISTRIBUTE = 2
}

export enum STATUSES {
    STATUS_UNKNOWN = 0,
    STATUS_INVALID = 1,
    STATUS_VALID = 2,
    STATUS_VALIDATION_ERROR = 3,
    STATUS_DATA_NOT_FOUND = 4,
}



export class Settings {
}
