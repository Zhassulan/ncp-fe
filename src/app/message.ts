export class Message {

    static OK = {
        TRANSIT: 'Платёж успешно перенесён на тразнитный счёт',
        TRANSIT_DELETED: 'Платёж успешно удалён с транзитного счёта',
        DISTRIBUTED: 'Платёж успешно разнесён',
        MOBIPAY_CHANGED: 'Mobipay платёж изменён',
        PAYMENT_DELETED: 'Платёж успешно удалён',
        MOBIPAY_DISTR: 'Платёж Mobipay успешно разнесён',
        MOBIPAY_CANCELED: 'Платёж Mobipay успешно отменен',
        PROCESSED: 'Успешно обработан'
    };

    static ERR = {
        ACCESS_DENIED : 'Нет доступа',
        NO_DATA : 'Данные не предоставлены',
        INVALID_REGISTRY : 'Ошибочные разноски',
        SERVICE : 'Ошибка сервиса',
        NOT_FOUND : 'Запрос не найден',
        MOBIPAY_DISTRIBUTION : 'Ошибка обработки Mobipay платежа',
        CLIENT : 'Ошибка на вашем компьютере'
    };

    static INFO = {
        MOBIPAY_PICK_PARTNER : 'Выберите партнера',
        INPUT_NUMBER : 'Введите сумму'
    };

}
