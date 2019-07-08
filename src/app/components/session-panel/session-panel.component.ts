import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { UscisService } from '../../services/uscis.service';
import { ConfigService } from '../../services/config.service';

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
  ) { }

  ngOnInit() {
  }

  
  

  public signIn(): void {
    this.sessionService.signIn(() => {
      this.configService.loadConfig();
      this.uscisService.loadResultFromLocalStorage();
    });
  }

}
