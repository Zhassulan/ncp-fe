import {HttpHeaders} from '@angular/common/http';

/**
 * Платёж - числовые статусы
 */
export enum PaymentStatus {
    NEW = 0,
    DISTRIBUTED = 1,
    ERROR = 2,
    EXPIRED = 3,
    DELETED = 4,
    SCHEDULED = 5,
    TRANSIT = 6,
    TRANSIT_DISTRIBUTED = 7,
    TRANSIT_CANCELLED = 8,
    TRANSIT_ERROR = 9,
    DEFERRED = 10
}

/**
 * Платёж - переводы на русском статусов платежа
 */
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
    'Ошибка разнесения с тразитного счёта',
    'Отложен'
}

/**
 * Платёж - маппинг английского статуса и русского
 */
export enum PaymentStatusEnRu {
    'NEW' = 'Новый',
    'DISTRIBUTED' = 'Разнесён',
    'ERROR' = 'Ошибка',
    'EXPIRED' = 'Просрочен',
    'DELETED' = 'Удалён',
    'SCHEDULED' = 'Запланирован',
    'TRANSIT' = 'На транзитном счёте',
    'TRANSIT_DISTRIBUTED' = 'Разнесён с транзитного счёта',
    'TRANSIT_CANCELLED' = 'Удалён с транзитного счёта',
    'TRANSIT_ERROR' = 'Ошибка разнесения с тразитного счёта',
    'DEFERRED' = 'Отложен',
}

/**
 * Ширина колонки таблицы для детали платежа
 * @type {number}
 */
export const shrinkDetailsColumnSize: number = 200;

/**
 * Опции для заголовка Http
 * @type {{headers: HttpHeaders}}
 */
export const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    })
};

/**
 * Группы доступа приложения в Active Directory
 * @type {{tele2users: string; managers: string; testers: string}}
 */
export const ldapGroups = {
    tele2users: 'itdev-ncp-user-tele2',
    managers: 'itdev-ncp-newapp-managers',
    testers: 'itdev-ncp-newapp-testers'
};

/**
 * Роли с набором групп для доступа к приложению
 * @type {{cc: string[]; finance: string[]; test: string[]}}
 */
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

/**
 * Временная задержка после ввода логина и пароля
 */
export const enum timeouts {
    timeoutAfterLoginInput = 3000,
    msg = 6000
}

/**
 * Ответ в REST сервисах от backend
 */
export const enum rests {
    restResultOk = 'ok',
    restResultErr = 'error',
    restResultErrValidPhone = 'error_not_valid_phones'
}

/**
 * Различные сообщения
 *
 * */
export const enum msgs {
    msgLoggedSuccess = 'Успешно выполнен логин',
    msgNoRights = 'Извините, нет разрешений на использование приложения',
    msgSysErrRights = 'Системная ошибка проверки разрешений',
    msgWrongCreds = 'Не верный пользователь или пароль',
    msgSysErrCreds = 'Системная ошибка проверки логина/пароля',
    msgErrLogin = 'Ошибка входа',
    msgErrLoadData = 'Ошибка загрузки данных',
    msgErrToTransit = 'Ошибка переноса на транзитный счёт',
    msgSuccessToTransit = 'Платёж успешно перенесён на тразнитный счёт',
    msgSuccessDelTransit = 'Успешно удалён с транзитного счёта',
    msgErrDelTransit = 'Ошибка удаления с транзитного счёта',
    msgErrUploadFilePayment = 'Ошибка загрузки файлового платежа',
    msgErrTotalSum = 'Сумма платежа и сумма деталей не совпадают',
    msgErrDocNum = 'Номер платежа не совпадает с номером в файле',
    msgErrRnn = 'ИИН платежа не совпадает с ИИН в файле',
    msgErrGetDetails = 'Ошибка получения деталей платежа',
    msgSuccessGotDetails = 'Успешно получены детали платежа',
    msgErrDistributePayment = 'Ошибка разноски',
    msgSuccessDistributed = 'Платёж успешно разнесён',
    msgErrCreateEquipment = 'Ошибка создания записи по оборудованию',
    msgSuccessCreateEquipment = 'Успешно создана запись по оборудованию',
    msgErrGetPaymentDetails = 'Ошибка получения деталей платежа',
    msgErrGetPaymentData = 'Ошибка загрузки платежа',
    msgNoData = 'Нет данных',
    msgBadValue = 'Не верное значение',
    msgDistributionFailed = 'Разноска отменена',
    msgNoNewDetails = 'Нет новых разносок',
    msgPaymentNotNew = 'Платёж не в статусе новый',
    msgPaymentBlocked = 'Платёж уже в обработке',
    msgErrGetRegistryData = 'Ошибка загрузки реестра',
    msgErrGetVer = 'Ошибка получения версии приложения',
    msgInfRefreshPage = 'Есть обновления, обновите кеш страницы [Ctrl]+[F5]',
    msgDataNotProvided = 'Данные не предоставлены',
    msgNotSelected = 'Не выбрано',
    msgValid = 'Числится',
    msgErrAPI = 'Сервис не доступен'
}

/**
 * Данные локального storage (не куки)
 */
export enum locStorItems {
    token = 'token',
    user = 'username',
    ver = 'ncp_version',
    ver_test = 'ncp_version_test'
}

/**
 * длина номера абонента
 * @type {number}
 */
export const msisdnLength = 10;
export const msisdnLengthCity = 11;

/**
 * Стратегия разноска детали платежа
 */
export enum PaymentDetailDistrStrategy {
    byAccount = 0,
    byMsisdn = 1,
    None = 2
}

/**
 * Словарь терминов
 */
export enum dic {
    prepaid = 'аванс',
}

/**
 * Меню платежа
 */
export enum PaymentMenuItems {
    LOAD_EQUIPMENT,
    DISTRIBUTE ,
    REGISTRY,
    DEFER,
    DEL_TRANSIT,
    TRANSIT
}

/**
 * Различные статусы
 */
export enum STATUSES {
    STATUS_UNKNOWN = 0,
    STATUS_INVALID = 1,
    STATUS_VALID = 2,
    STATUS_VALIDATION_ERROR = 3,
    STATUS_DATA_NOT_FOUND = 4,
}

/**
 * Всплывающие подсказки
 */
export enum TOOLTIPS {
    delAll = 'Удалить все',
}

/**
 * Константы и настройки приложения
 */
export class Settings {
}

export const appTitle = 'NCP';

export enum PaymentActions {

    TO_TRANSIT = 0,
    FROM_TRANSIT = 1


}
