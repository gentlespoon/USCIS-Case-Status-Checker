import { Injectable, OnInit } from "@angular/core";
import { CaseStatus } from "@app/classes/case-status/case-status";
import Dexie from "dexie";

@Injectable({
  providedIn: "root"
})
export class DataCacheService {
  private db: any;

  private _cache: CaseStatus[] = [];
  public get cache() {
    return this._cache;
  }

  private _activities: {} = {};
  public get activities() {
    return this._activities;
  }

  constructor() {
    this.db = new Dexie("caseStatusCache");
    this.db.version(1).stores({
      activities: "[activity+caseId], activity, caseId"
    });
    setTimeout(() => {
      this.loadCacheFromDatabase();
    }, 0);
  }

  public toggleActivity(activity: string, visibility: boolean): void {
    if (undefined !== this._activities[activity]) {
      this._activities[activity] = visibility;
    }
  }

  public async loadCacheFromDatabase() {
    var cachedStatus = await this.db.activities.toArray();
    this._cache = [];
    for (var caseStatus of cachedStatus) {
      try {
        this._cache.push(caseStatus as CaseStatus);
        this._activities[caseStatus.activity] = false;
      } catch (ex) {
        console.error(ex);
      }
    }
  }

  public logCaseStatus(caseStatus: CaseStatus) {
    this._activities[caseStatus.activity] = true;
    this._cache.push(caseStatus);
    this.db.activities.add(caseStatus);
  }

  public removeActivity(activity): void {
    this.db.activities
      .where("activity")
      .anyOf(activity)
      .delete();
    this._cache = this._cache.filter(a => a.activity !== activity);
    delete this._activities[activity];
  }

  public removeAllActivities(): void {
    this.db.activities.delete();
    this._cache = [];
    this._activities = {};
  }
}
