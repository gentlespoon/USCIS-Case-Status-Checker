import { Injectable, OnInit } from "@angular/core";
import { CaseStatus } from "@app/classes/case-status/case-status";
import Dexie from "dexie";

@Injectable({
  providedIn: "root"
})
export class DataCacheService {
  constructor() {
    this.initializeIndexDB();
    // db.version(2).stores({
    //   activities: "++id, date, description, done"
    // });
    // or make a new one
    // db.activities.add({
    //   name: "Camilla",
    //   age: 25
    // });
  }

  private DB_NAME = "cachedCaseStatus";
  public db: any;

  initializeIndexDB() {
    console.log("Opening IndexedDB");
    // var dBOpenRequest = window.indexedDB.open(this.DB_NAME);
    // var ver = dBOpenRequest.result.version;
    // dBOpenRequest.result.close();
    this.db = new Dexie(this.DB_NAME);
    this.db.version(2).stores({
      caseStatus: "[caseId+activity]",
      activities: "time"
    });
    this.db.version(1).stores({
      caseStatus: "[caseId+activity]"
    });
  }

  public removeActivity(activity: string): void {
    this.db.activities
      .where("time")
      .equals(activity)
      .delete();
    this.db.caseStatus
      .where("activity")
      .equals(activity)
      .delete();
  }

  public createActivity(activity: string): void {
    this.db.activities.add({ time: activity });
  }

  public async updateActivityCase(caseStatus: CaseStatus) {
    console.log("updating Activity Case");
    this.db.caseStatus.add(caseStatus);
    console.log(
      (
        await this.db.activities
          .where("time")
          .notEqual(caseStatus.activity)
          .toArray()
      ).map(x => x.time)
    );
  }
}
