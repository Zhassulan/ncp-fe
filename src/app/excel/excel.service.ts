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
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob: Blob = new Blob([excelBuffer], {type: EXCEL_TYPE});
        this.fileSaverService.save(blob, 'registries_export_' + new  Date().getTime() + EXCEL_EXTENSION);
    }

}
