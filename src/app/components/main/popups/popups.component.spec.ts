import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PopupsComponent } from "./popups.component";
import { UserAgreementComponent } from "@app/components/popups/user-agreement/user-agreement.component";
import { AddCaseComponent } from "@app/components/popups/add-case/add-case.component";
import { GreetingComponent } from "@app/components/popups/greeting/greeting.component";
import { ListBuilderComponent } from "@app/components/popups/case-list-builder/list-builder.component";
import { ListImporterComponent } from "@app/components/popups/case-list-importer/list-importer.component";
import { ListExporterComponent } from "@app/components/popups/case-list-exporter/list-exporter.component";
import { NewListComponent } from "@app/components/popups/new-list/new-list.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule } from "@angular/forms";

describe("PopupsComponent", () => {
  let component: PopupsComponent;
  let fixture: ComponentFixture<PopupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PopupsComponent,
        UserAgreementComponent,
        AddCaseComponent,
        GreetingComponent,
        ListBuilderComponent,
        ListImporterComponent,
        ListExporterComponent,
        NewListComponent
      ],
      imports: [FontAwesomeModule, FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
