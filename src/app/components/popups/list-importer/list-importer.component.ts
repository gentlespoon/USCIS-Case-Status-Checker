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
        return `
  Each line contains one case ID
  
  ABC1234123412
  WAC4312432143
  LIN6789678967`;
        break;
      case 'json':
        return `
  JavaScript Object Notation
  
  [
    "ABC1234123412",
    "WAC4321432143",
    "LIN6789678967"
  ]`;
        break;
      case 'xml':
        return 'Extensible Markup Language';
        break;
      case 'csv':
        return `
  Comma Splitted Values
  
  ABC1234123412,WAC4321432143,LIN6789678967`;
        break;
      case 'csvq':
        return `
  Comma Splitted Values with Quotation Marks
  
  "ABC1234123412","WAC4321432143","LIN6789678967"`;
        break;
      default:
        return 'Unsupported data type';
        break;
    }
  }

  public disableImportButton: boolean = false;

  public errorMessage: string = '';

  public import() {
    
    this.errorMessage = '';
    this.disableImportButton = true;
    setTimeout(() => this.runImport(), 100);

  }

  public runImport() {
    try {
      this.data = this.data.trim();
      if (this.data) {  
        var parsedData: string[] = this.parseData();
        // console.log(parsedData);
        this.caseListSvc.addCaseIds(parsedData);
        this.close();
      }
    } catch (ex) {
      this.errorMessage = `Failed to import case list.<br>${ex}`;
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
        var tmp = this.data.split('\n').join();
        return tmp.split(',');
        break;
      case 'csvq':
        var tmp = this.data.split('\n').join();
        return tmp.replace(/\"/g, '').split(',');
        break;
    }
  }



  public close() {
    this.viewControllerSvc.show['listImporter'] = false;
  }


}
