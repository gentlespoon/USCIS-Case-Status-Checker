import { Component, OnInit } from '@angular/core';
import { UscisService } from '../../services/uscis.service';
import { CaseFilterService } from '../../services/case-filter.service';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit {

  constructor(
    public uscisService: UscisService,
    public caseFilterService: CaseFilterService,
  ) { }

  ngOnInit() {
  }

  selectAll() {
    this.caseFilterService.displayingActivities = this.uscisService.activityTimes;
  }
  deselectAll() {
    this.caseFilterService.displayingActivities = [];
  }

  removeAll() {
    if (confirm('You are about to remove all the cached results.')) {
      this.deselectAll();
      this.uscisService.activityTimes = [];
      this.uscisService.caseList = {};
      this.uscisService.saveResultToLocalStorage();
    }
  }

}
