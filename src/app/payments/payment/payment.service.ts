import {Injectable} from '@angular/core';
import {NcpPayment} from '../model/ncp-payment';
import {PaymentsService} from '../payments.service';
import {Observable, Subject} from 'rxjs';
import {UploadFilePaymentService} from './equipment/upload-file-payment.service';
import {dic, msgs, PaymentDetailDistrStrategy, PaymentStatus, rests, STATUSES} from '../../settings';
import {FilePaymentItem} from './equipment/model/file-payment-item';
import {DataService} from '../../data/data.service';
import {NGXLogger} from 'ngx-logger';
import {UserService} from '../../user/user.service';
import {PaymentDetail} from '../model/payment-detail';
import {NcpPaymentDetails} from '../model/ncp-payment-details';
import {Equipment} from '../model/equipment';
import {PaymentParamEq} from '../model/payment-param-eq';
import {DetailEquipment} from '../model/detail-equipment';
import {Utils} from '../../utils';
import {EquipmentCheckParam} from '../model/equipment-check-param';
import {NotificationsService} from 'angular2-notifications';
import {AppService} from '../../app.service';

@Injectable({
    providedIn: 'root',
})
export class PaymentService {

    payment: NcpPayment = new NcpPayment();
    details: PaymentDetail [] = [];
    equipments: Equipment [] = [];
    private detailsObs = new Subject<PaymentDetail[]>();
    private paymentObs = new Subject<NcpPayment>();
    detailsAnnounced$ = this.detailsObs.asObservable();
    paymentAnnounced$ = this.paymentObs.asObservable();
    utils = new Utils(this.logger);
    paymentStatuses = PaymentStatus;

    constructor(private paymentsService: PaymentsService,
                private uploadFilePaymentService: UploadFilePaymentService,
                private dataService: DataService,
                private logger: NGXLogger,
                private userService: UserService,
                private notifService: NotificationsService,
                private appService: AppService) {
    }

    setPayment(id) {
        console.log('Получение платежа ID ' + id + '..');
        this.payment = this.paymentsService.payments.find(x => x.id == id);
        if (this.payment) {
            this.announcePayment();
        } else {
            console.log('Ошибка получения платежа.');
        }
    }

    loadPayment(id) {
        console.log("Загрузка платежа ID " + id);
        return new Observable(
            observer => {
                this.dataService.getPayment(id).subscribe(data => {
                        if (data.result == rests.restResultOk) {
                            this.payment = data.data;
                            observer.next(this.payment);
                        }
                        if (data.result == rests.restResultErr) {
                            this.logger.error(data.data);
                            observer.error(msgs.msgErrGetPaymentData);
                        }
                    },
                    error2 => {
                        let msg = msgs.msgErrGetDetails + error2 + this.userService.logUser();
                        this.logger.error(msg);
                        observer.error(msgs.msgErrGetPaymentData);
                    },
                    () => {
                        observer.complete();
                    });
            });
    }

    setPaymentByData(payment) {
        this.payment = payment;
        this.details = [];
        payment.details.forEach(item => {
            this.details.push(this.convertDbDetailToAppDetail(item));
        });
        this.announcePayment();
        this.announceDetails();
        this.getPaymentEquipments(payment.id).subscribe(
            data => {
            },
            error2 => {
            },
            () => {
                this.announceDetails();
            });
    }

    setPaymentStatus(status: number) {
        this.payment.status = status;
        this.announcePayment();
    }

    addNewDetail(detail: PaymentDetail) {
        this.details.push(detail);
        //console.log(JSON.stringify((this.details)));
        this.announceDetails();
    }

    delDetail(row) {
        this.details.splice(this.details.indexOf(row), 1);
        this.announceDetails();
    }

    delAll()    {
/*        this.details.forEach(detail => {
            if (detail.status == PaymentStatus.STATUS_NEW)  {
                this.details.splice(this.details.indexOf(detail), 1);
            }
        })*/
        this.details = [];
        this.announceDetails();
    }

    announceDetails() {
        this.detailsObs.next(this.details);
    }

    announcePayment() {
        this.paymentObs.next(this.payment);
    }

    get filePaymentItems() {
        return this.uploadFilePaymentService.filePayment.filePaymentItems;
    }

    getDetailsSum(key) {
        return this.details.reduce((a, b) => Number(a) + Number((b[key] || 0)), 0);
    }

    /**
     * Сравнение суммы деталей с суммой платежа
     * @returns {boolean} true - равны
     */
    checkTotalSum(): boolean {
        return Number(this.getDetailsSum('sum')) == Number(this.payment.sum);
    }

    checkDocNum(): boolean {
        if (this.uploadFilePaymentService.filePayment)
            return this.uploadFilePaymentService.filePayment.filePaymentHeader.payment_docnum == this.payment.paymentDocnum;
        else
            return true;
    }

    checkRnn(): boolean {
        if (this.uploadFilePaymentService.filePayment)
            return this.uploadFilePaymentService.filePayment.filePaymentHeader.iin_bin_sender == this.payment.rnnSender;
        else
            return true;
    }

    addDetailsFromFilePayment() {
        //console.log('Добавляются детали из файлового объекта в платёж сервиса\n');
        for (let item of this.filePaymentItems.slice(0, this.filePaymentItems.length)) {
            let detail = new PaymentDetail();
            detail.nomenclature = item.nomenclature;
            detail.msisdn = item.msisdn;
            detail.icc = item.icc;
            detail.account = item.account;
            detail.sum = item.sum;
            if (!detail.icc) {
                detail.distrStrategy = this.determineDistrStrategy(item);
            }   else    {
                detail.distrStrategy = PaymentDetailDistrStrategy.byAccount;
            }
            detail.status = 0;
            detail.num = item.num;
            this.addNewDetail(detail);
        }
        this.announceDetails();
        //this.setEquipments();
        //this.printDetails();
    }

    printDetails()  {
        console.log('Детали платежа ID' + this.payment.id + ':\n');
        this.utils.printObj(this.details);
    }

    printEquipments()   {
        console.log('Оборудование платежа ID' + this.payment.id + ':\n');
        this.utils.printObj(this.equipments);
    }

    determineDistrStrategy(item: FilePaymentItem) {
        if (item.nomenclature.trim().toLowerCase().includes(dic.prepaid) && (item.account == null || String(item.account) == '')) {
            return PaymentDetailDistrStrategy.byMsisdn;
        } else
            return PaymentDetailDistrStrategy.byAccount;
    }

    determineDistrStrategyByDetail(detail: PaymentDetail) {
        if (detail.account == null || String(detail.account) == '') {
            return PaymentDetailDistrStrategy.byMsisdn;
        } else
            return PaymentDetailDistrStrategy.byAccount;
    }

    convertDbDetailToAppDetail(item: NcpPaymentDetails): PaymentDetail {
        console.log("Конвертирование деталей платежа в расширенный формат.");
        let detail = new PaymentDetail();
        detail.id = item.id;
        detail.msisdn = item.msisdn;
        detail.account = item.account;
        detail.sum = item.sum;
        detail.status = item.status;
        detail.err_message = item.err_message;
        detail.distribute_date = item.distribute_date;
        detail.nomenclature = null;
        detail.icc = null;
        detail.distrStrategy = PaymentDetailDistrStrategy.None;
        return detail;
    }

    setDetailsFromDbDetails(details: NcpPaymentDetails []) {
        this.details = [];
        details.forEach(item => {
            this.details.push(this.convertDbDetailToAppDetail(item));
        });
    }

    getPaymentDetails(paymentId): Observable<any> {
        console.log("Получаю детали платежа ID " + paymentId);
        return new Observable(
            observer => {
                this.dataService.getPaymentDetails(paymentId).subscribe(data => {
                        if (data.result == rests.restResultOk) {
                            this.details = [];
                            data.data.forEach(item => {
                                this.details.push(this.convertDbDetailToAppDetail(item));
                            });
                            this.getPaymentEquipments(paymentId).subscribe(
                                data => {
                                    observer.next();
                                },
                                error2 => {
                                    observer.error(error2);
                                });
                            this.announceDetails();
                            observer.next();
                        }
                        if (data.result == rests.restResultErr) {
                            this.logger.error(data.data);
                            observer.error(msgs.msgErrGetDetails);
                        }
                    },
                    error2 => {
                        let msg = msgs.msgErrGetDetails + error2 + this.userService.logUser();
                        this.logger.error(msg);
                        observer.error(msgs.msgErrGetDetails);
                    },
                    () => {
                        observer.complete();
                    });
            });
    }

    distribute(): Observable<any> {
        return this.dataService.distributePayment(this.getPreparedParameters());
    }

    getPreparedParameters():PaymentParamEq {
        this.logger.debug("Подготавливаются параметры для разноски..")
        let params: PaymentParamEq = new PaymentParamEq();
        params.id = this.payment.id;
        params.profileId = this.payment.profileId;
        params.agent = this.userService.getUserName();
        params.items = [];
        this.logger.debug('Детали платежа:\n' + Utils.toJsonString(this.details));
        for (let detail of this.details) {
                let ncpDetail = new NcpPaymentDetails();
                ncpDetail.id = detail.id;
                ncpDetail.msisdn = detail.msisdn;
                ncpDetail.account = detail.account;
                ncpDetail.sum = detail.sum;
                if (detail.distrStrategy == PaymentDetailDistrStrategy.byAccount) {
                    ncpDetail.msisdn = null;
                }
                if (detail.distrStrategy == PaymentDetailDistrStrategy.byMsisdn) {
                    ncpDetail.account = null;
                }
                ncpDetail.status = detail.status;
                ncpDetail.err_message = detail.err_message;
                ncpDetail.distribute_date = detail.distribute_date;
                if ((detail.nomenclature != null || detail.nomenclature != '') && (detail.icc != null || detail.icc != '')) {
                    let equipment: Equipment = this.createEquipmentByDetail(this.payment.id, detail);
                    params.items.push(new DetailEquipment(ncpDetail, equipment));
                }   else {
                    params.items.push(new DetailEquipment(ncpDetail, null));
                }
        }
        this.logger.debug("Параметры для разноски:\n" + Utils.toJsonString(params));
        return params;
    }

    getPaymentData(id): Observable<any> {
        return new Observable(
            observer => {
                this.dataService.getPayment(id).subscribe(
                    data => {
                        if (data.result == rests.restResultOk)  {
                            this.payment = data.data;
                            this.announcePayment();
                        }
                        if (data.result == rests.restResultErr)  {
                            observer.error(data);
                        }
                    },
                    error2 => {},
                ()=> {}
                )
            });
    }

    createEquipmentByDetail(paymentId: number, detail: PaymentDetail):Equipment   {
        let eq: Equipment = new Equipment();
        eq.icc = detail.icc;
        eq.msisdn = detail.msisdn;
        eq.nomenclature = detail.nomenclature;
        eq.paymentDetailId = null; // при создании новой детали из файла оборудования ID ещё не сформирован (запись не записана в базу)
        return eq;
    }

    setEquipments() {
        this.equipments = [];
        this.details.forEach(item => {
            this.equipments.push(this.createEquipmentByDetail(this.payment.id, item));
        });
        //this.printEquipments();
    }

    setEquipmentsInDetails(equipments: Equipment []) {
        equipments.forEach(equipment => {
            let detail = this.details.find(x => x.id == equipment.paymentDetailId);
            detail.id = equipment.id;
            detail.nomenclature = equipment.nomenclature;
            detail.msisdn = equipment.msisdn;
            detail.icc = equipment.icc;
        });
    }

    getPaymentEquipments(id: number): Observable<any> {
        return new Observable(
            observer => {
                this.dataService.getPaymentEquipments(id).subscribe(
                    data => {
                        if (data.result == rests.restResultOk) {
                            this.setEquipmentsInDetails(data.data);
                        }
                        if (data.result == rests.restResultErr) {
                            observer.error(data);
                        }
                    },
                    error2 => {
                    },
                    () => {
                    }
                );
            });
    }

    isBlocked(): boolean {
        let res: boolean =
            this.payment.status == PaymentStatus.STATUS_DISTRIBUTED ||
            this.payment.status == PaymentStatus.STATUS_EXPIRED ||
            this.payment.status == PaymentStatus.STATUS_DELETED;
        return res;
    }

    isCurrentSumValid(): boolean {
        return this.getDetailsSum('sum') == this.payment.sum;
    }

    getBercutEquipmentInfo(icc): Observable <any> {
        console.log('Получение информации оборудования по ICC ' + icc + '..');
        return new Observable(
            observer => {
                this.dataService.getBercutEquipmentInfoByIcc(icc).subscribe(
                    data => {
                        if (data.result == rests.restResultOk) {
                            //console.log(data.data);
                            observer.next(data.data);
                        }
                        if (data.result == rests.restResultErr) {
                            observer.error(data);
                        }
                    },
                    error2 => {
                        observer.error(error2);
                    },
                    () => {
                        observer.complete();
                    }
                );
            });
    }

    async checkEquipmentParams(equipmentParams) {
        const response = await this.dataService.checkEquipmentParams(equipmentParams).toPromise();
        return response;
    }

    async distributionCheckConditions(id): Promise <boolean> {

        this.appService.setProgress(true);
        let result = true;
        /*
        result = await this.paymentBlocked(id);
        if (result) {
            this.notifService.warn(msgs.msgPaymentBlocked);
            return false;
        }
        */
        if (!this.isNewDetailsExistsForDistribution()) {
            this.notifService.warn(msgs.msgNoNewDetails);
            this.appService.setProgress(false);
            return false;
        }
        if (!this.checkTotalSum()) {
            this.notifService.warn(msgs.msgErrTotalSum);
            result = false;
        }
        if (!this.checkDocNum()) {
            this.notifService.warn(msgs.msgErrDocNum);
            result = false;
        }
        if (!this.checkRnn()) {
            this.notifService.warn(msgs.msgErrRnn);
            result = false;
        }
        //result = await this.checkIcc();
        result = await this.checkBercutEquipment();
        this.appService.setProgress(false);
        return result;
    }

    /*async checkIcc(): Promise <boolean> {
        let result = true;
        for (const detail of this.details)  {
            if (detail.icc) {
                console.log('Проверка по icc ' + detail.icc);
                let obs = await this.dataService.getBercutEquipmentInfoByIcc(detail.icc);
                if (obs.result == rests.restResultErr) {
                    result = false;
                    this.notifService.warn(obs.data);
                }
            }
        }
        return result;
    }
    */

    async checkBercutEquipment(): Promise <boolean>  {
        let result = true;
        let equipmentCheckParams = [];
        if (this.details.length > 0) {
            this.details.forEach(detail => {
                console.log(detail.nomenclature);
                if (detail.nomenclature)    {
                    //if (!detail.nomenclature.toLowerCase().includes(dic.prepaid)) {
                        equipmentCheckParams.push(new EquipmentCheckParam(detail.icc, detail.sum, Utils.removeRepeatedSpaces(detail.nomenclature).trim().toLowerCase(), detail.account));
                    //}
                }
            });
        }
        //console.log('equipmentCheckParams:\n');
        //this.utils.printObj(equipmentCheckParams);
        if (equipmentCheckParams.length > 0) {
            let res = await this.checkEquipmentParams(equipmentCheckParams);
            res.data.forEach(item => {
                if (item.status != STATUSES.STATUS_VALID && item.status != STATUSES.STATUS_UNKNOWN) {
                    this.notifService.warn(item.icc + ' ' + item.info);
                    result = false;
                }
            });
        }
        return result;
    }

    showPaymentStatus(status, id)   {
        let msg;
        switch (status) {
            case PaymentStatus.STATUS_DISTRIBUTED: {
                msg = msgs.msgSuccessDistributed + 'ID ' + id + this.userService.logUser();
                this.logger.info(msg);
                this.notifService.success(msg);
            } break;
            case PaymentStatus.STATUS_ERROR: {
                msg = msgs.msgErrDistributePayment + 'ID ' + id + this.userService.logUser();
                this.logger.warn(msg);
                this.notifService.warn(msg);
            } break;
        }
    }

    isNewDetailsExistsForDistribution(): boolean    {
        let result = false;
        this.details.forEach(detail => {
            if (detail.status == this.paymentStatuses.STATUS_NEW)   {
                result = true;
            }
        });
        return result;
    }

    async isNewPayment(id): Promise <boolean>  { //todo удалить в случае не надобности
        let res = await this.dataService.getPaymentStatus(id).toPromise();
        if (res.result == rests.restResultOk)   {
            return res.data == PaymentStatus.STATUS_NEW ? true : false;
        }   else {
            return false;
        }
    }

    async paymentBlocked(id): Promise <boolean>  {
        let res = await this.dataService.paymentBlocked(id).toPromise();
        if (res.result == rests.restResultOk)   {
            return res.data;
        }   else {
            return false;
        }
    }

}
