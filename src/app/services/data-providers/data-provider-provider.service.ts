import { Injectable } from "@angular/core";
import { UscisWebPageService } from "./uscis-web-page/uscis-web-page.service";
import { IDataProvider } from "@app/interfaces/i-data-provider";

@Injectable({
  providedIn: "root"
})
export class DataProviderProviderService {
  constructor(private uscisWebPageService: UscisWebPageService) {
    this.service = uscisWebPageService;
  }

  public service: IDataProvider;
}
