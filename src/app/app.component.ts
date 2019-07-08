import { Component, OnInit } from '@angular/core';
import { ElectronService } from './services/electron.service';
import { environment } from '../environments/environment';
import { SessionService } from './services/session.service';
import { RunningState } from './classes/running-state.class';

import { UscisCase, CaseActivity } from './classes/uscisCase.class';
import * as moment from 'moment';
import * as prettysize from 'prettysize';
import { ConfigService } from './services/config.service';
import { UscisService } from './services/uscis.service';
import { CaseFilterService } from './services/case-filter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private DEV = false;

  constructor(
    public electronService: ElectronService,
    public sessionService: SessionService,
    public configService: ConfigService,
    public uscisService: UscisService,
    public caseFilterService: CaseFilterService,
  ) {

    if (this.DEV) console.log('environment', environment);

    if (this.DEV)
      if (electronService.isElectron()) {
        console.log('Mode electron');
        console.log('Electron ipcRenderer', electronService.ipcRenderer);
        console.log('NodeJS childProcess', electronService.childProcess);
      } else {
        console.log('Mode web');
      }
  }


  public RunningState = RunningState;

  
  ngOnInit() {

    if (!localStorage.getItem('uaAgreed')) {
      var UA = `User Agreement
  
Sending a large amount of requests to USCIS server may be considered as a Denial of Service attack to the USCIS system. If you do not fully understand what that means, you are strongly advised not to use this software.

You have been warned.

In no event shall the developer be liable for any consequences relating to the use of this software. This software is provided AS-IS, and by continuing, you agree that you assume the entire risk of using the software.`;
  
      if (!confirm(UA)) {
        window.close();
      }
      localStorage.setItem('uaAgreed', 'true');

    }

    this.configService.loadConfig();
    this.uscisService.loadResultFromLocalStorage();

  }

  public Object = Object;
  public alert = alert;


  public saveResultsAsCSV(): void {
    this.alert('Not implemented');
  }

  public start(): void {

    this.uscisService.time = moment().format('MM/DD/YYYY hh:mm:ss A');
    if (this.uscisService.activityTimes.indexOf(this.uscisService.time) !== -1) {
      alert('Slow down!');
      return;
    }
    
    // build the query list
    var prefix = this.configService.config.baseCaseID.substring(0, 3).toUpperCase();
    var caseId = parseInt(this.configService.config.baseCaseID.substring(3, 13));
    var startCaseId = caseId - Math.floor(this.configService.config.previousCases / this.configService.config.stepWidth) * this.configService.config.stepWidth;
    var endCaseId = caseId + Math.floor(this.configService.config.nextCases / this.configService.config.stepWidth) * this.configService.config.stepWidth;
    
    this.uscisService.queryQueue = [];
    for (var currentCaseId = startCaseId; currentCaseId <= endCaseId; currentCaseId += this.configService.config.stepWidth) {
      this.uscisService.queryQueue.push(prefix + currentCaseId);
    }
    
    if (confirm(`You are trying to check ${this.uscisService.queryQueue.length} case${this.uscisService.queryQueue.length > 1 ? 's' : ''}.

Since aach case query will consume about 150 KB data, the operation will consume a total of ${prettysize(1024 * 150 * this.uscisService.queryQueue.length).toUpperCase()} data.

Confirm?`)) {
  this.uscisService.start();
    }
    
  }


  
  




}
