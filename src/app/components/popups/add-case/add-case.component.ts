import { Component, OnInit } from '@angular/core';
import { ViewControllerService } from '@app/services/view-controller/view-controller.service';
import { CaseListService } from '@app/services/case-list/case-list.service';

@Component({
  selector: 'app-add-case',
  templateUrl: './add-case.component.html',
  styleUrls: ['./add-case.component.scss']
})
export class AddCaseComponent {

  constructor(
    public viewControllerSvc: ViewControllerService,
    private caseListSvc: CaseListService
  ) { }

  public data: string = "";

  public disableAddButton = false;


  public add() {
    if (this.data) {
      this.disableAddButton = true;
      try {
        this.caseListSvc.addCaseId(this.data);
        this.close();
      } catch (ex) {
        alert(`Failed to add case.\n\n${ex}`);
      }
      this.disableAddButton = false;
    }
  }

  public close() {
    this.viewControllerSvc.show['addCase'] = false;
  }

}
