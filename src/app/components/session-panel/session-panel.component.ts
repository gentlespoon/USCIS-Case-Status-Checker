import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { UscisService } from '../../services/uscis.service';
import { ConfigService } from '../../services/config.service';
import { ElectronService } from '../../services/electron.service';
import * as moment from 'moment';

@Component({
  selector: 'app-session-panel',
  templateUrl: './session-panel.component.html',
  styleUrls: ['./session-panel.component.scss']
})
export class SessionPanelComponent implements OnInit {

  constructor(
    public sessionService: SessionService,
    private uscisService: UscisService,
    private configService: ConfigService,
    private electronService: ElectronService,
  ) { }

  ngOnInit() {
  }

  
  

  public signIn(): void {
    this.sessionService.signIn(() => {
      this.configService.loadConfig();
      this.uscisService.loadResultFromLocalStorage();
    });
  }

  public saveResultsAsCSV(): void {
    if (!this.sessionService.token) {
      alert(`
Saving as CSV requires a free GsAccount, which only takes you a few seconds to get one.
It helps me to get an idea of how many users are using this tool.
`);
      return;
    }
    var outputLines: string[] = [
      `"Receipt #","Case Type"`
    ];
    for (var caseId of Object.keys(this.uscisService.caseList)) {
      outputLines.push(`"${caseId}","${this.uscisService.caseList[caseId].type}"`);
    }
    for (var activity of this.uscisService.activityTimes) {
      outputLines[0] += `,"${activity}"`;
      var lineNumber = 1;
      for (var caseId of Object.keys(this.uscisService.caseList)) {
        outputLines[lineNumber] += `,"${this.uscisService.caseList[caseId].activity[activity] ? this.uscisService.caseList[caseId].activity[activity].status : ''}"`;
        lineNumber++;
      }
    }

    var output = outputLines.join('\n');
    var filePath = this.electronService.remote.dialog.showSaveDialog({
      title: 'Save results as CSV file',
      defaultPath: this.electronService.remote.app.getPath('documents') + '/USCIS-Case-BatchQuery-Results-' + moment().format('YYYYMMDD-HHmmss') + '.csv',
    });
    if (!filePath.toLowerCase().endsWith('csv')) {
      filePath += '.csv';
    }

    this.electronService.fs.writeFile(filePath, output, err => {
      if (err) {
        alert(err);
      } else {
        this.electronService.remote.shell.showItemInFolder(filePath);
      }
    })
    // console.log(filePath);
    // console.log(output);
  }

}
