import { TestBed, async } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { ElectronService } from "./services/electron/electron.service";
import { PopupsComponent } from "./components/main/popups/popups.component";
import { CaseListComponent } from "./components/main/case-list/case-list.component";
import { UserAgreementComponent } from "./components/popups/user-agreement/user-agreement.component";
import { GreetingComponent } from "./components/popups/greeting/greeting.component";
import { ListImporterComponent } from "./components/popups/list-importer/list-importer.component";
import { ListExporterComponent } from "./components/popups/list-exporter/list-exporter.component";
import { ListBuilderComponent } from "./components/popups/list-builder/list-builder.component";
import { AddCaseComponent } from "./components/popups/add-case/add-case.component";
import { NewListComponent } from "./components/popups/new-list/new-list.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule } from "@angular/forms";

describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        PopupsComponent,
        CaseListComponent,
        UserAgreementComponent,
        GreetingComponent,
        ListImporterComponent,
        ListExporterComponent,
        ListBuilderComponent,
        AddCaseComponent,
        NewListComponent
      ],
      providers: [ElectronService],
      imports: [FontAwesomeModule, RouterTestingModule, FormsModule]
    }).compileComponents();
  }));

  it("should create the app", async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
