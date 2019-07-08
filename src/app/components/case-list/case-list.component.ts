import { Component, OnInit } from '@angular/core';
import { CaseFilterService } from '../../services/case-filter.service';
import { UscisService } from '../../services/uscis.service';

@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.scss']
})
export class CaseListComponent implements OnInit {

  constructor(
    public caseFilterService: CaseFilterService,
    public uscisService: UscisService,
  ) { }

  Object = Object;
  alert = alert;

  ngOnInit() {
  }

  public removeHtmlTag(str: string) {
    return str.replace(/(<([^>]+)>)/ig, '');
  }

}
