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

/*
const PaymentStatus = {
    STATUS_NEW: 0,
    STATUS_DISTRIBUTED: 1,
    STATUS_ERROR: 2,
    STATUS_EXPIRED: 3,
    STATUS_DELETED: 4,
    STATUS_SCHEDULED: 5,
    STATUS_TRANSIT: 6,
    STATUS_TRANSIT_DISTRIBUTED: 7,
    STATUS_TRANSIT_CANCELLED: 8,
    STATUS_TRANSIT_ERROR: 9
};

const PaymentStatusRu = {
    'Новый': PaymentStatus.STATUS_NEW,
    'Разнесён': PaymentStatus.STATUS_DISTRIBUTED,
    'Ошибка': PaymentStatus.STATUS_ERROR,
    'Просрочен': PaymentStatus.STATUS_EXPIRED,
    'Новый': PaymentStatus.STATUS_NEW,

};
*/

export class Settings {
}
