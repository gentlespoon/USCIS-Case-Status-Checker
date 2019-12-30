import { Component, OnInit } from '@angular/core';
import { CaseListService } from '@app/services/case-list/case-list.service';
import { ViewControllerService } from '@app/services/view-controller/view-controller.service';

@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.scss']
})
export class CaseListComponent implements OnInit {

  constructor(
    public caseListSvc: CaseListService,
    public viewControllerSvc: ViewControllerService
  ) { }

  ngOnInit() {
  }

  newList() {
    if (confirm("Warning!\n\nCreating a new list will remove all cases in the current list.\n\nContinue?")) {
      this.caseListSvc.caseIdList = [];
    }
  }

  public Object = Object;

  buildList() {
    this.viewControllerSvc.show['listBuilder'] = true;
  }

  importList() {
    this.viewControllerSvc.show['listImporter'] = true;
  }

  addCase() {
    this.viewControllerSvc.show['addCase'] = true;
  }

}
