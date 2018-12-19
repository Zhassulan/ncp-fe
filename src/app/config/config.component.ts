import {Component, OnInit} from '@angular/core';
import {ConfigService} from './config-service';
import {Config} from './config';

@Component({
    selector: 'app-config',
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

    config: Config;

    constructor(private configService: ConfigService) {
    }

    ngOnInit() {
    }

    showConfig() {
        this.configService.getConfig()
            .subscribe((data: Config) => this.config = {
                getNcpPaymentsUrl: data['getNcpPaymentsUrl']
            });
    }



}
