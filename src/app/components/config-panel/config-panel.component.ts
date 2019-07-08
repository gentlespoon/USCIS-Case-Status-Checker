import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { RunningState } from '../../classes/running-state.class';
import { UscisService } from '../../services/uscis.service';

@Component({
  selector: 'app-config-panel',
  templateUrl: './config-panel.component.html',
  styleUrls: ['./config-panel.component.scss']
})
export class ConfigPanelComponent implements OnInit {

  constructor(
    public configService: ConfigService,
    public uscisService: UscisService,
  ) { }

  RunningState = RunningState;
  
  ngOnInit() {
    this.configService.loadConfig();
  }

  saveConfig() {
    this.configService.saveConfig();
  }

}
