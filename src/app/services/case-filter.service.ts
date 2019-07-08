import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaseFilterService {

  constructor() { }

  public displayingActivities: string[] = [];

  public toggle(activity: string) {
    let i = this.displayingActivities.indexOf(activity);
    if (i === -1) {
      this.displayingActivities.push(activity);
    } else {
      this.displayingActivities.splice(i, 1);
    }
    this.displayingActivities.sort();
  }
}
