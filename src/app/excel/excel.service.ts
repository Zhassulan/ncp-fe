import {Injectable} from '@angular/core';
import {FileSaverService} from 'ngx-filesaver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {

    constructor(private fileSaverService: FileSaverService) {
    }

    save(data) {
        this.processMills(data);
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob: Blob = new Blob([excelBuffer], {type: EXCEL_TYPE});
        //this.fileSaverService.save(blob, 'export_' + new Date().toDateString() + '_' + new Date().toTimeString() + EXCEL_EXTENSION);
        this.fileSaverService.save(blob, 'export' + EXCEL_EXTENSION);
    }

    processMills(data)  {
        let options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            timezone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        //alert( date.toLocaleString("ru", options) ); // среда, 31 декабря 2014 г. н.э. 12:30:00
        data.forEach(item => {
            item.creationDate = new Date(item.creationDate).toLocaleString("ru", options).replace(',','');
            item.distributeDate = new Date(item.distributeDate).toLocaleString("ru", options).replace(',','');
        })
    }

}
