import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { UscisCase, CaseActivity } from '../../classes/uscisCase.class';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public sessionService: SessionService,
    private httpClient: HttpClient,
  ) { }

  ngOnInit() {

    this.loadConfig();
  }

  public Object = Object;

  public saveConfig() {
    if (this.sessionService.token) {
      localStorage.setItem('savedConfig', JSON.stringify(this.config));
    }
  }

  private loadConfig() {
    if (this.sessionService.token) {
      var loadedConfig = localStorage.getItem('savedConfig');
      if (loadedConfig) {
        this.config = JSON.parse(loadedConfig);
      }
    }
  }




  public config = {
    baseCaseID: '',
    previousCases: 50000,
    nextCases: 10000,
    stepWidth: 1000,
    semaphore: 10
  }

  public activityTimes: string[] = [];
  public caseList: object = {};

  public saveResultsAsCSV(): void {

  }

  public state = 'stopped';



  public start(): void {

    
    var time = moment().format('YYYY-MM-DDTHH:mm');
    if (this.activityTimes.indexOf(time) !== -1) {
      alert('Wait for a minute before starting the new query');
      return;
    }
    
    // build the query list
    var prefix = this.config.baseCaseID.substring(0, 3).toUpperCase();
    var caseId = parseInt(this.config.baseCaseID.substring(3, 13));
    
    var startCaseId = caseId - Math.floor(this.config.previousCases / this.config.stepWidth) * this.config.stepWidth;
    var endCaseId = caseId + Math.floor(this.config.nextCases / this.config.stepWidth) * this.config.stepWidth;
    
    this.queryQueue = [];
    for (var currentCaseId = startCaseId; currentCaseId <= endCaseId; currentCaseId += this.config.stepWidth) {
      this.queryQueue.push(prefix + currentCaseId);
    }
    
    // if (!confirm(`Will check ` + this.queryQueue.length + ` cases.`)) {
    //   return;
    // }
    
    if (this.queryQueue.length > 1000) {
      if (!confirm(`
Alert!

You are trying to check more than 1000 cases.

Each case query will consume ~ 150KB data, which means the operation will consume a total of 150MB data.

Confirm?
      `)) {
        return;
      }
    }
    
    this.state = 'running';
    this.activityTimes.push(time);

    // start threads
    for(let threadCount = this.config.semaphore; threadCount>0; threadCount--) {
      this.startNextQuery(time);
    }
  }



  // TODO: move these logic to service.

  private buildList(): void {
    
  }

  queryQueue = [];

  private startNextQuery(time: string): void {
    // pop first in queue;
    if (this.state === 'running') {
      var caseId = this.queryQueue.shift();
      if (caseId) {
        if (!this.caseList[caseId]) {
          this.caseList[caseId] = new UscisCase();
        }
        this.queryCase(caseId, time);
      } else {
        this.state = 'stopped';
      }
    }
  }

  private queryCase(caseId: string, time: string): void {
    this.caseList[caseId].activity[time] = new CaseActivity();
    this.httpClient.get(environment.USCIS_API_URL + '?appReceiptNum=' + caseId, {responseType: 'text'})
      .subscribe(
        response => {
          this.analyzeResult(caseId, time, response);
        },
        error => {
          this.caseList[caseId].activity[time].status = error;
        },
        () => {
          this.startNextQuery(time);
        }
      );
  }


  private disclaimerForIpBanShown = false;
  private analyzeResult(caseId: string, time: string, response: string): void {
    
    var splittedResponse: string[];

    if (response.indexOf('It was reported to us that your IP address or internet gateway') !== -1) {
      this.caseList[caseId].activity[time].status = 'Your IP is blocked by USCIS';
      if (!this.disclaimerForIpBanShown) {
        alert(`
Your IP address has been blocked by USCIS.

As stated before, the author is not responsible for any consequences of using this software. Remember, this may be considered as an attack activity.

You may try again in 24 hours.
        `);
        this.disclaimerForIpBanShown = true;
      }
      this.state = 'stopped';
      return;
    }

    splittedResponse = response.split('<label for="receipt_number">Enter Another Receipt Number</label>');
    response = splittedResponse[0];
    
    // splittedResponse = response.split('<div class="main-content-sec pb40">');
    // response = (splittedResponse.length > 1) ? splittedResponse[1] : splittedResponse[0];
    
    // splittedResponse = response.split('<div class="current-status-sec">');
    // response = (splittedResponse.length > 1) ? splittedResponse[1] : splittedResponse[0];

    splittedResponse = response.split('<div class="rows text-center">');
    response = (splittedResponse.length > 1) ? splittedResponse[1] : splittedResponse[0];
    

    response = response.replace(/\n/g, '');
    response = response.replace(/\s{2}/g, '');

    // get status summary
    var status: string;
    // first check for error message,
    var regexResult = /<li>(.*?)<\/li>/g.exec(response);
    // if error message exists
    if (regexResult) {
      status = regexResult[1];
      if (status) {
        if (status.indexOf('My Case Status does not recognize the receipt number entered')!== -1) {
          status = 'Invalid receipt number';
        }
      }
    } else {
      // if no error message, get real message
      regexResult = /<h1>(.*?)<\/h1>/g.exec(response);
      if (regexResult) {
        status = regexResult[1];
      }
      regexResult = /<p>(.*?)<\/p>/g.exec(response);
      if (regexResult) {
        this.caseList[caseId].activity[time].detail = regexResult[1];
      }
    }
    this.caseList[caseId].activity[time].status = status;
    this.caseList[caseId].activity[time].original = response;
    console.log(this.caseList[caseId]);
  }

  public pause(): void {
    this.state = 'paused';
  }

  public resume(): void {
    this.state = 'running';
  }

  public stop(): void {
    this.state = 'stopped';

  }


  public signIn(): void {
    this.sessionService.signIn(() => {
      this.loadConfig();
    });
  }

}
