import { Injectable } from '@angular/core';
import { UscisCase, CaseActivity, ActivityList } from '../classes/uscisCase.class';
import { SessionService } from './session.service';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import { ConfigService } from './config.service';
import { RunningState } from '../classes/running-state.class';
import { CaseFilterService } from './case-filter.service';


@Injectable({
  providedIn: 'root'
})
export class UscisService {

  constructor(
    private sessionService: SessionService,
    private httpClient: HttpClient,
    private configService: ConfigService,
    private caseFilterService: CaseFilterService,
  ) { }

  private semaphore: number = 0;
  public state: RunningState = RunningState.stopped;
  public activityTimes: string[] = [];
  public caseList: object = {};
  public time = '';
  public detail: string[] = [];


  public saveResultToLocalStorage() {
    // return;
    if (this.sessionService.token) {
      console.dir(this.caseList);
      var json = JSON.stringify(this.caseList);
      localStorage.setItem('caseList', json);
    }
  }

  
  public loadResultFromLocalStorage() {
    // return;
    if (this.sessionService.token) {
      var json = localStorage.getItem('caseList');
      if (json) {
        var parsedCaseList = JSON.parse(json);
        for (let caseId of Object.keys(parsedCaseList)) {
          console.dir(parsedCaseList[caseId]);
          this.caseList[caseId] = new UscisCase(parsedCaseList[caseId]);
        }
        this.activityTimes = ActivityList.activityList.sort();
      }
    }
  }



  

  queryQueue = [];

  private startNextQuery(): void {
    // pop first in queue;
    if (this.state === RunningState.running && this.semaphore > 0) {
      var caseId = this.queryQueue.shift();
      // if not end of list
      if (caseId) {
        if (!this.caseList[caseId]) {
          this.caseList[caseId] = new UscisCase();
        }
        // start a new thread
        this.semaphore--;
        this.queryCase(caseId);
      } else {
        // stop
        this.stop();
      }
    }
  }

  private queryCase(caseId: string): void {
    this.caseList[caseId].activity[this.time] = new CaseActivity();
    this.httpClient.get(environment.USCIS_API_URL + '?appReceiptNum=' + caseId, {responseType: 'text'})
      .subscribe(
        response => {
          this.analyzeResult(caseId, response);
        },
        error => {
          this.caseList[caseId].activity[this.time].status = error;
        },
        () => {
          this.semaphore++;
          this.startNextQuery();
        }
      );
  }

  private disclaimerForIpBanShown = false;


  private analyzeResult(caseId: string, response: string): void {
    
    var splittedResponse: string[];

    if (response.indexOf('It was reported to us that your IP address or internet gateway') !== -1) {
      this.caseList[caseId].activity[this.time].status = 'Your IP is blocked by USCIS';
      if (!this.disclaimerForIpBanShown) {
        alert(`
Your IP address has been blocked by USCIS.

As stated before, the author is not responsible for any consequences of using this software. Remember, this may be considered as an attack activity.

You may try again in 24 hours.
        `);
        this.disclaimerForIpBanShown = true;
      }
      this.stop();
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
        if (
          status.indexOf('My Case Status does not recognize the receipt number entered') !== -1 ||
          status.indexOf('The application receipt number entered is invalid') !== -1
        ) {
          status = 'Invalid receipt number';
        }
      }
    } else {
      // if no error message, get real message
      regexResult = /<h1>(.*?)<\/h1>/g.exec(response);
      if (regexResult) {
        status = regexResult[1];
      }
      // get detail
      regexResult = /<p>(.*?)<\/p>/g.exec(response);
      if (regexResult) {
        this.caseList[caseId].activity[this.time].detail = regexResult[1];
        // extract date if exists
        var dateRegexResult = /On\s(.*?),\s(.*?),\s/g.exec(this.caseList[caseId].activity[this.time].detail);
        // console.log(dateRegexResult);
        if (dateRegexResult) {
          this.caseList[caseId].activity[this.time].date = moment(dateRegexResult[1] + ', ' + dateRegexResult[2]).format('MM/DD/YYYY'); 
        }
        // extract form if exists
        var formRegexResult = /Form\s(.*?),/g.exec(this.caseList[caseId].activity[this.time].detail);
        // console.log(formRegexResult);
        if (formRegexResult) {
          this.caseList[caseId].type = formRegexResult[1]; 
        }

      }
    }
    this.caseList[caseId].activity[this.time].status = status;
    this.caseList[caseId].activity[this.time].original = response;
    // console.log(this.caseList[caseId]);
  }

  public pause(): void {
    this.state = RunningState.paused;
  }

  public resume(): void {
    this.state = RunningState.running;
    this.startNextQuery();
  }

  public stop(): void {
    this.state = RunningState.stopped;
    this.saveResultToLocalStorage();
  }



  public start() {
    this.state = RunningState.running;
    this.activityTimes.push(this.time);
    this.caseFilterService.displayingActivities.push(this.time);

    // start threads
    this.semaphore = this.configService.config.semaphore;
    for(let threadCount = this.configService.config.semaphore; threadCount > 0; threadCount--) {
      this.startNextQuery();
    }
  }

}
