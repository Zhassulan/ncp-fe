import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppService} from '../../app.service';
import {NotificationsService} from 'angular2-notifications';
import {PublicRegistryRepository} from '../public-registry-repository';
import {ProgressBarService} from '../../progress-bar.service';

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.scss']
})
export class RegistryComponent implements OnInit {

  private registry;

  constructor(private registryService: PublicRegistryRepository,
              private route: ActivatedRoute,
              private appService: AppService,
              private notifService: NotificationsService,
              private progressBarService: ProgressBarService) {
  }

  ngOnInit() {
    this.progressBarService.start();
    this.registryService.findById(this.route.snapshot.params['id']).subscribe(
      data => this.registry = data,
      error => {
        this.notifService.error(error.message);
        this.progressBarService.stop();
      },
      () => this.progressBarService.stop());
  }
}
