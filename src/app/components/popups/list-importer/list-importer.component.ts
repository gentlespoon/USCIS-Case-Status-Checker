import { Component, OnInit } from '@angular/core';
import { ViewControllerService } from '@app/services/view-controller/view-controller.service';
import { CaseListService } from '@app/services/case-list/case-list.service';

@Component({
  selector: 'app-list-importer',
  templateUrl: './list-importer.component.html',
  styleUrls: ['./list-importer.component.scss']
})
export class ListImporterComponent {

  constructor(
    public viewControllerSvc: ViewControllerService,
    private caseListSvc: CaseListService
  ) { }

  public dataType: string = "txt";
  public data: string = "";
  
  public get instructions(): string {
    switch (this.dataType) {
      case 'txt':
        return 'Each line contains one case ID';
        break;
      case 'json':
        return 'JavaScript Object Notation';
        break;
      case 'xml':
        return 'Extensible Markup Language';
        break;
      case 'csv':
        return 'Comma Splitted Values';
        break;
      case 'csvq':
        return 'Comma Splitted Values with Quotation Marks';
        break;
      default:
        return 'Unsupported data type';
        break;
    }
  }

  public disableImportButton = false;

  public import() {
    this.disableImportButton = true;
    this.data = this.data.trim();
    if (this.data) {
    
      try {
        var parsedData: string[] = this.parseData();
        // console.log(parsedData);
        this.caseListSvc.addCaseIds(parsedData);
        this.close();
      } catch (ex) {
        alert(`Failed to import case list.\n\n${ex}`);
      }
      
    }
    this.disableImportButton = false;
  }


  private parseData(): string[] {
    switch (this.dataType) {
      case 'txt':
        return this.data.split('\n');
        break;
      case 'json':
        return JSON.parse(this.data);
        break;
      case 'xml':
        throw ('Not Implemented');
        break;
      case 'csv':
        return this.data.split(',');
        break;
      case 'csvq':
        return this.data.replace(/\"/g, '').split(',');
        break;
    }
  }



  public close() {
    this.viewControllerSvc.show['listImporter'] = false;
  }


}
