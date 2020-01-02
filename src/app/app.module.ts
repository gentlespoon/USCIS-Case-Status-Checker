import "reflect-metadata";
import "../polyfills";

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

//fontawesome
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

// bootstrap
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { HttpClientModule, HttpClient } from "@angular/common/http";

import { AppComponent } from "./app.component";

import { ElectronService } from "./services/electron/electron.service";
import { CaseListComponent } from "./components/main/case-list/case-list.component";
import { ListBuilderComponent } from "./components/popups/list-builder/list-builder.component";
import { UserAgreementComponent } from "./components/popups/user-agreement/user-agreement.component";
import { DataCacheService } from "./services/data-cache/data-cache.service";
import { AddCaseComponent } from "./components/popups/add-case/add-case.component";
import { GreetingComponent } from "./components/popups/greeting/greeting.component";
import { ListImporterComponent } from "./components/popups/list-importer/list-importer.component";
import { PopupsComponent } from "./components/main/popups/popups.component";
import { NewListComponent } from "./components/popups/new-list/new-list.component";
import { ListExporterComponent } from "./components/popups/list-exporter/list-exporter.component";

@NgModule({
  declarations: [
    AppComponent,
    CaseListComponent,
    ListBuilderComponent,
    UserAgreementComponent,
    AddCaseComponent,
    GreetingComponent,
    ListImporterComponent,
    PopupsComponent,
    NewListComponent,
    ListExporterComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [ElectronService, DataCacheService],
  bootstrap: [AppComponent]
})
export class AppModule {}
