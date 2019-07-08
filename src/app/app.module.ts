import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ElectronService } from './services/electron.service';
import { WebviewDirective } from './directives/webview.directive';
import { AppComponent } from './app.component';
import { ConfigPanelComponent } from './components/config-panel/config-panel.component';
import { SessionPanelComponent } from './components/session-panel/session-panel.component';
import { ActivityListComponent } from './components/activity-list/activity-list.component';
import { CaseListComponent } from './components/case-list/case-list.component';
import { CaseFilterService } from './services/case-filter.service';
import { ConfigService } from './services/config.service';
import { GsapiService } from './services/gsapi.service';
import { UscisCase } from './classes/uscisCase.class';
import { SessionService } from './services/session.service';
import { UscisService } from './services/uscis.service';
import { DetailViewComponent } from './components/detail-view/detail-view.component';


@NgModule({
  declarations: [
    AppComponent,
    WebviewDirective,
    ConfigPanelComponent,
    SessionPanelComponent,
    ActivityListComponent,
    CaseListComponent,
    DetailViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [ElectronService, CaseFilterService, ConfigService, GsapiService, UscisService, SessionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
