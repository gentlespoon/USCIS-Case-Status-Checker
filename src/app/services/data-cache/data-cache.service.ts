import { Injectable, OnInit } from "@angular/core";
import { CaseStatus } from "@app/classes/case-status/case-status";
import Dexie from "dexie";

@Injectable({
  providedIn: "root"
})
export class DataCacheService {
  private db: any;

  private _cache: object[] = [];
  public get cache() {
    return this._cache;
  }

  constructor() {
    this.db = new Dexie("caseStatusCache");
    this.db.version(2).stores({
      activities: "++id, activity, caseId"
    });
    this.db.version(1).stores({
      activities: "++id, activity, caseId, caseStatus"
    });
  }

  public loadCacheFromDatabase() {}

  public logCaseStatus(
    activity: string,
    caseId: string,
    caseStatus: CaseStatus
  ) {
    let obj = {
      activity: activity,
      caseId: caseId,
      caseStatus: caseStatus
    };
    this._cache.push(obj);
    this.db.activities.add(obj);
  }
}
