import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {UploadFilePaymentService} from '../upload-file-payment.service';
import {PaymentService} from '../../payment.service';
//import * as XLSX from 'xlsx';

//type AOA = any[][];

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

    //data: AOA = [ [1, 2], [3, 4] ];
    //wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
    //fileName: string = 'SheetJS.xlsx';

    @ViewChild('file') file;
    fileObj: File;
    showUploadButton: boolean = false;
    isWait = false;

    constructor(public dialogRef: MatDialogRef<DialogComponent>,
                private uploadService: UploadFilePaymentService,
                private paymentService: PaymentService) {
    }

    ngOnInit() {
    }

    onFileAdded()   {
        const files: { [key: string]: File } = this.file.nativeElement.files;
        for (let key in files) {
            if (!isNaN(parseInt(key))) {
                this.fileObj = files[key];
                this.showUploadButton = true;
            }
        }
    }

    /**
     *  перехват обновления файла и парсинг путем SheetJS
     * @param evt
     */
    onFileAddedBYEvent(evt: any) {
        /*
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
            console.log('Excel data: ' + this.data);
            this.parseArrayToObject(this.data)
        };
        reader.readAsBinaryString(target.files[0]);
        */
    }

    parseArrayToObject(arr) {

    }

    to_csv(workbook) {
        /*
        var result = [];
        workbook.SheetNames.forEach(function(sheetName) {
            var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
            if(csv.length){
                result.push("SHEET: " + sheetName);
                result.push("");
                result.push(csv);
            }
        });
        return result.join("\n");
        */
    }

    addFile() {
        this.file.nativeElement.click();
    }

    upload() {
        this.isWait = true;
        this.uploadService.upload(this.fileObj).subscribe(
            data => {
                if (this.paymentService.payment)
                    this.paymentService.addDetailsFromFilePayment();
                this.dialogRef.close();
            },
            error2 => {
                //this.appService.setProgress(false);
                this.isWait = false;
            },
            () => {
                this.isWait = false;
            });
    }

}
