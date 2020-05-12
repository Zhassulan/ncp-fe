import {Injectable} from '@angular/core';
import {FileSaverService} from 'ngx-filesaver';
import * as XLSX from 'xlsx';
import {Utils} from '../utils';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root',
})
export class ExcelService {

    constructor(private fileSaverService: FileSaverService) {
    }

    save(inData) {
        let data = JSON.parse(JSON.stringify(inData));
        this.processMills(data);
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob: Blob = new Blob([excelBuffer], {type: EXCEL_TYPE});
        //this.fileSaverService.save(blob, 'export_' + new Date().toDateString() + '_' + new Date().toTimeString() + EXCEL_EXTENSION);
        this.fileSaverService.save(blob, 'export' + EXCEL_EXTENSION);
    }

    processMills(data)  {
        //alert( date.toLocaleString("ru", options) ); // среда, 31 декабря 2014 г. н.э. 12:30:00
        data.forEach(item => {
            if (item.creationDate) {
                item.creationDate = Utils.millsToDateStr(item.creationDate);
                item.distributeDate = Utils.millsToDateStr(item.distributeDate);
            }
            if (item.created) {
                item.created = Utils.millsToDateStr(item.created);
            }
        });
    }

}
