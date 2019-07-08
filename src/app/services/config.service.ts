import { Injectable } from '@angular/core';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(
    private sessionService: SessionService,
  ) { }

  

  public config = {
    baseCaseID: '',
    previousCases: 50000,
    nextCases: 10000,
    stepWidth: 1000,
    semaphore: 10
  }


  public saveConfig() {
    if (this.sessionService.token) {
      localStorage.setItem('savedConfig', JSON.stringify(this.config));
    }
  }

  public loadConfig() {
    if (this.sessionService.token) {
      var loadedConfig = localStorage.getItem('savedConfig');
      if (loadedConfig) {
        this.config = JSON.parse(loadedConfig);
      }
    }
  }


}
