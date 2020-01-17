import { Injectable } from "@angular/core";
import { CaseListService } from "../case-list/case-list.service";
import { DataProviderProviderService } from "../data-providers/data-provider-provider.service";
import { IDataProvider } from "@app/interfaces/i-data-provider";
import { DataCacheService } from "../data-cache/data-cache.service";
import * as moment from "moment";

@Injectable({
  providedIn: "root"
})
export class QueryControllerService {
  private dataProviderSvc: IDataProvider;
  public threads: number = 10;

  constructor(
    private caseListSvc: CaseListService,
    private dataProviderProviderSvc: DataProviderProviderService,
    private dataCacheSvc: DataCacheService
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

  private running: boolean = false;
  private paused: boolean = false;

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
    this.initiateActivity();
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
    this.running = false;
    this.paused = false;
  }

  //
  // Internal Control
  //
  private initiateActivity(): void {
    var caseIds: string[] = Object.keys(this.caseListSvc.caseIdList);
    if (caseIds.length < 1) {
      this.stop();
    }

    this.dataCacheSvc.createActivity();
    for (var caseId of caseIds) {
      this.dataProviderSvc.getCaseInfo(caseId).subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.error(error);
        },
        () => {}
      );
    }
  }

  private getCaseInfoCallback(): void {}
}
