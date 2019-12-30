import { Component, OnInit } from '@angular/core';
import { ElectronService } from './services/electron/electron.service';
import { AppConfig } from '../environments/environment';
import { DataCacheService } from './services/data-cache/data-cache.service';
import { UserAgreementComponent } from './components/popups/user-agreement/user-agreement.component';
import { ViewControllerService } from './services/view-controller/view-controller.service';
import { CaseListService } from './services/case-list/case-list.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private DEV = false;

  constructor(
    public electronSvc: ElectronService,
    private dataCacheSvc: DataCacheService,
    private viewControllerSvc: ViewControllerService,
    private caseListSvc: CaseListService
  ) {
    console.log('AppConfig', AppConfig);

    if (electronSvc.isElectron) {
      console.log(process.env);
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronSvc.ipcRenderer);
      console.log('NodeJS childProcess', electronSvc.childProcess);
    } else {
      console.log('Mode web');
    }
  }


  ngOnInit() {

    // see if we need to show disclaimer
    if (!localStorage.getItem('uaAgreed')) {
      this.viewControllerSvc.show['userAgreement'] = true;
    }

    this.caseListSvc.loadListFromLocalStorage();

    this.dataCacheSvc.loadCache();

  }





}
