import {HttpHeaders} from '@angular/common/http';


export enum PaymentStatus {
    NEW = 0,
    DISTRIBUTED = 1,
    ERR = 2,
    EXPIRED = 3,
    DELETED = 4,
    SCHEDULED = 5,
    TRANSIT = 6,
    TRANSIT_DISTRIBUTED = 7,
    TRANSIT_CANCELLED = 8,
    TRANSIT_ERR = 9,
    DEFERRED = 10
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
    'Ошибка разнесения с тразитного счёта',
    'Отложен'
}

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

export const enum MSG {
    accessDenied = 'Нет доступа',
    transitSuccess = 'Платёж успешно перенесён на тразнитный счёт',
    transitDelSuccess = 'Успешно удалён с транзитного счёта',
    distributeSuccess = 'Платёж успешно разнесён',
    distritbutionErrInvalidRegistry = 'Ошибочные разноски',
    updateCache = 'Есть обновления, обновите кеш страницы [Ctrl]+[F5]',
    noData = 'Данные не предоставлены',
    mobipayChanged = 'Mobipay платёж изменён',
    errService = 'Ошибка сервиса, повторите позже',
    notFound = 'Не найден путь запроса',
    errMobipayDistribution = 'Ошибка обработки Mobipay платежа',
    inputNumber = 'Введите сумму',
    delSuccess = 'Платёж успешно удалён',
    distributionMobipaySuccess = 'Платёж Mobipay успешно разнесён',
    distributionCancelMobipaySuccess = 'Платёж Mobipay успешно отменен',
    processedSuccess = 'Успешно обработан',
    choosePartner = 'Выберите партнера',

}

export enum locStorItems {
    token = 'token',
    user = 'username',
    ver = 'ncp_version',
    ver_test = 'ncp_version_test',
    updated_test = 'ncp_updated_test',
    updated = 'ncp_updated'
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
    TRANSIT,
    DEL
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

export const NotifOptions = {
    maxLength : 500
}

