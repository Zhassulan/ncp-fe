export class Message {

    static OK = {
        TRANSIT: 'Платёж успешно перенесён на тразнитный счёт',
        TRANSIT_DELETED: 'Платёж успешно удалён с транзитного счёта',
        DISTRIBUTED: 'Платёж успешно разнесён',
        MOBIPAY_CHANGED: 'Mobipay платёж изменён',
        PAYMENT_DELETED: 'Платёж успешно удалён',
        MOBIPAY_DISTR: 'Платёж Mobipay успешно разнесён',
        MOBIPAY_CANCELED: 'Платёж Mobipay успешно отменен',
        PROCESSED: 'Запрос успешно обработан'
    };

    static ERR = {
        ACCESS_DENIED : 'Нет доступа',
        INVALID_REGISTRY : 'Ошибочные разноски',
        SERVICE : 'Ошибка сервиса',
        NOT_FOUND : 'Ошибка данных',
        MOBIPAY_DISTRIBUTION : 'Ошибка обработки Mobipay платежа',
        CLIENT : 'Ошибка на вашем компьютере',
        AUTH : 'Ошибка входа',
        BAD_REQUEST: 'Неверный запрос'
    };

    static WAR = {
        MOBIPAY_PICK_PARTNER : 'Выберите партнера',
        INPUT_NUMBER : 'Введите сумму',
        ENTER_LOGIN_PASSWORD : 'Введите логин и пароль',
        DATA_NOT_FOUND : 'Данные не найдены',
    };

}
