import {Component, OnInit, ViewChild} from '@angular/core';
import * as XLSX from 'xlsx';


@Component({
    selector: 'app-equipment',
    templateUrl: './equipment.component.html',
    styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {

    @ViewChild('file') file;
    fileObj: File;

    constructor() {
    }

    ngOnInit() {
    }

    openFile()  {
        this.file.nativeElement.click();
    }

    onFileAdded() {
        const files: { [key: string]: File } = this.file.nativeElement.files;
        for (let key in files) {
            if (!isNaN(parseInt(key))) {
                this.fileObj = files[key];
            }
        }
        //console.log(this.fileObj)
        this.readExcel();
    }

    readExcel() {
        var reader = new FileReader();
        var workbook = XLSX.read(this.fileObj, {type: true ? 'binary' : 'array'});
        console.log(workbook.SheetNames[0]);
        //if(rABS) reader.readAsBinaryString(f);
    }
}
