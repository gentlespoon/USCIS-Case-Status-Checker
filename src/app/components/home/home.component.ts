import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  USCIS_API_URL: string = 'https://egov.uscis.gov/casestatus/mycasestatus.do';

  constructor(
    public sessionService: SessionService
  ) { }

  ngOnInit() {
  }

}
