import { TestBed, async, ComponentFixture } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { ElectronService } from "./services/electron/electron.service";
import { PopupsComponent } from "./components/main/popups/popups.component";
import { CaseListComponent } from "./components/main/case-list/case-list.component";
import { UserAgreementComponent } from "./components/popups/user-agreement/user-agreement.component";
import { GreetingComponent } from "./components/popups/greeting/greeting.component";
import { ListImporterComponent } from "./components/popups/case-list-importer/list-importer.component";
import { ListExporterComponent } from "./components/popups/case-list-exporter/list-exporter.component";
import { ListBuilderComponent } from "./components/popups/case-list-builder/list-builder.component";
import { AddCaseComponent } from "./components/popups/add-case/add-case.component";
import { NewListComponent } from "./components/popups/new-list/new-list.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule } from "@angular/forms";

describe("AppComponent", () => {
  var component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

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

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
  });

  it("should create the app", async(() => {
    expect(component).toBeTruthy();
  }));

  it("should show userAgreement if not agreed", () => {
    localStorage.setItem("uaAgreed", "false");
    while (localStorage.getItem("uaAgreed") !== "false"); // wait until localStorage is stored.
    component.ngOnInit();
    expect(component.viewControllerSvc.show["userAgreement"]).toBeTruthy();
  });

  it("should not show userAgreement if agreed", () => {
    localStorage.setItem("uaAgreed", "true");
    while (localStorage.getItem("uaAgreed") !== "true"); // wait until localStorage is stored.
    component.ngOnInit();
    expect(component.viewControllerSvc.show["userAgreement"]).toBeFalsy();
  });
});
