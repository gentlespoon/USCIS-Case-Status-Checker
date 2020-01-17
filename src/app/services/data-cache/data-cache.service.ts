import { Injectable, OnInit } from "@angular/core";
import { CaseStatus } from "@app/classes/case-status/case-status";

@Injectable({
  providedIn: "root"
})
export class DataCacheService {
  constructor() {
    this.initializeIndexDB();
  }

  private DB_NAME = "cachedCaseStatus";
  public db: IDBDatabase;

  initializeIndexDB() {
    console.log("Opening IndexedDB");
    var dBOpenRequest = window.indexedDB.open(this.DB_NAME);

    dBOpenRequest.onerror = event => {
      console.error(event);
    };

    dBOpenRequest.onsuccess = event => {
      console.log("IndexedDB initialized.");
      this.db = dBOpenRequest.result;
    };
  }

  public createActivity(activity: string): void {
    if (!this.db) {
      throw "db not initialized";
    }
    var newVersion = this.db.version + 1;
    this.db.close();
    var dbUpgradeRequest = window.indexedDB.open(this.DB_NAME, newVersion);
    dbUpgradeRequest.onupgradeneeded = event => {
      dbUpgradeRequest.result.createObjectStore(activity, {
        keyPath: "caseId"
      });
    };
    dbUpgradeRequest.onsuccess = event => {
      this.db = dbUpgradeRequest.result;
    };
  }

  public updateCaseActivity(
    activity: string,
    caseId: string,
    caseStatus: CaseStatus
  ) {
    var transaction = this.db.transaction([activity], "readwrite");
    transaction.oncomplete = event => {
      console.log("All done!");
    };

    transaction.onerror = event => {
      console.error(event);
    };

    var objectStore = transaction.objectStore(activity);
    var request = objectStore.add(caseStatus, caseId);
    request.onsuccess = event => {
      console.log("success");
    };
    request.onerror = event => {
      console.error(event);
    };
  }
}
