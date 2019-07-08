import { Component, OnInit } from '@angular/core';
import { UscisService } from '../../services/uscis.service';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {

  constructor(
    public uscisService: UscisService,
  ) { }

  ngOnInit() {
  }

  public alert = alert;
}
