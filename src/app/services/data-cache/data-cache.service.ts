import { Injectable, OnInit } from "@angular/core";
import { CaseStatus } from "@app/classes/case-status/case-status";
import Dexie from "dexie";

@Injectable({
  providedIn: "root"
})
export class DataCacheService {
  private db: any;

  constructor() {
    this.db = new Dexie("caseStatusCache");
    this.db.version(2).stores({
      activities: "++id, activity, caseId"
    });
    this.db.version(1).stores({
      activities: "++id, activity, caseId, caseStatus"
    });
  }

  public updateActivityCase(
    activity: string,
    caseId: string,
    caseStatus: CaseStatus
  ) {
    this.db.activities.add({
      activity: activity,
      caseId: caseId,
      caseStatus: caseStatus
    });
  }
}
