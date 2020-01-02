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

  public data: string = '';

  public disableAddButton: boolean = false;

  public errorMessage: string = '';

  public add() {
    this.errorMessage = '';
    this.disableAddButton = true;
    setTimeout(() => this.runAdd(), 100);
  }

  public runAdd() {
    try {
      if (this.data) {
        this.caseListSvc.addCaseId(this.data);
        this.close();
      }
    } catch (ex) {
      this.errorMessage = `Failed to add case.<br>${ex}`;
    }
    this.disableAddButton = false;
  }

  public close() {
    this.viewControllerSvc.show['addCase'] = false;
  }

}
