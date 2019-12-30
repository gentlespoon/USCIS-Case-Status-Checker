import { Component } from '@angular/core';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { ViewControllerService } from '../../../services/view-controller/view-controller.service';

@Component({
  selector: 'app-user-agreement',
  templateUrl: './user-agreement.component.html',
  styleUrls: ['./user-agreement.component.scss']
})
export class UserAgreementComponent {

  constructor(
    private viewControllerSvc: ViewControllerService
  ) {}

  faExclamationCircle = faExclamationCircle;

  accept() {
    localStorage.setItem("uaAgreed", "1");
    this.viewControllerSvc.show['userAgreement'] = false;
  }

}
