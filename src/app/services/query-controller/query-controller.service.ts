import { Injectable } from "@angular/core";
import { CaseListService } from "../case-list/case-list.service";
import { DataProviderProviderService } from "../data-providers/data-provider-provider.service";
import { IDataProvider } from "@app/interfaces/i-data-provider";
import { DataCacheService } from "../data-cache/data-cache.service";
import * as moment from "moment";
import { CaseStatus } from "@app/classes/case-status/case-status";
import { ToastService } from "../toast/toast.service";

@Injectable({
  providedIn: "root"
})
export class QueryControllerService {
  private dataProviderSvc: IDataProvider;
  public threads: number = 10;
  private _runningThreads: number = 0;
  private running: boolean = false;
  private paused: boolean = false;
  private activity: string = "";
  private caseIds: string[] = [];
  private currentCaseIdIndex: number = 0;
  private dispatchControllerInterval: any = null;

  public get runningThreads(): number {
    return this._runningThreads;
  }

  constructor(
    private caseListSvc: CaseListService,
    private dataProviderProviderSvc: DataProviderProviderService,
    private dataCacheSvc: DataCacheService,
    private toastSvc: ToastService
  ) {
    this.dataProviderSvc = dataProviderProviderSvc.service;
  }

  //
  // State Reporting
  //

  public can(action: string): boolean {
    switch (action) {
      case "start":
        return !this.running;
      case "pause":
        return this.running && !this.paused;
      case "resume":
        return this.running && this.paused;
      case "stop":
        return this.running;
    }
  }

  public get state(): string {
    if (this.running) {
      if (this.paused) {
        return "paused";
      }
      return "running";
    }
    return "stopped";
  }

  //
  // State Controlling
  //

  public start(): void {
    if (
      this.running // if already started
    ) {
      return;
    }
    this.running = true;
    this.paused = false;
    this.activity = moment().toISOString();
    this.initiateActivity(this.activity);
  }

  public pause(): void {
    if (
      !this.running || // if not started
      this.paused // if already paused
    ) {
      return;
    }
    this.paused = true;
  }

  public resume(): void {
    if (
      !this.running || // if not started
      !this.paused // is not paused
    ) {
      return;
    }
    this.paused = false;
  }

  public stop(): void {
    if (
      !this.running // if not started
    ) {
      return;
    }
    clearInterval(this.dispatchControllerInterval);
    this.running = false;
    this.paused = false;
  }

  //
  // Internal Control
  //
  private initiateActivity(activity: string): void {
    this.caseIds = Object.keys(this.caseListSvc.caseIdList);
    this.currentCaseIdIndex = 0;
    if (this.caseIds.length < 1) {
      this.stop();
    }

    this.dispatchControllerInterval = setInterval(
      () => this.dispatchController(),
      100
    );
  }

  private dispatchController() {
    if (this.paused) return;
    if (this.currentCaseIdIndex >= this.caseIds.length) {
      this.stop();
      return;
    }
    if (this._runningThreads < this.threads) {
      this.startNextQuery();
      this.currentCaseIdIndex++;
    }
  }

  private startNextQuery() {
    var caseId = this.caseIds[this.currentCaseIdIndex];
    this.currentCaseIdIndex++;
    this.dataProviderSvc.getCaseInfo(caseId, caseStatus => {
      this.dataCacheSvc.updateActivityCase(this.activity, caseId, caseStatus);
    });
    this._runningThreads--;
  }
}
