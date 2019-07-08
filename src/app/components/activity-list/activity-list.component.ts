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

}
