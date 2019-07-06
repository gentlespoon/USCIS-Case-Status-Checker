import { Component } from '@angular/core';
import { ElectronService } from './services/electron.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  constructor(public electronService: ElectronService) {

    console.log('environment', environment);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }


  
  ngOnInit() {

    if (!localStorage.getItem('uaAgreed')) {
      var UA = `User Agreement
  
  Sending a large amount of requests to USCIS server may be considered as a Denial of Service attack to the USCIS system. If you do not fully understand what that means, you are strongly advised not to use this software.
  
  You have been warned.
  
  In no event shall the developer be liable for any consequences relating to the use of this software. This software is provided AS-IS, and by continuing, you agree that you assume the entire risk of using the software.
  `;
  
      if (!confirm(UA)) {
        window.close();
      }
      localStorage.setItem('uaAgreed', 'true');

    }

  }

}
