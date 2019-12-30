import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAgreementComponent } from './user-agreement.component';

describe('UserAgreementComponent', () => {
  let component: UserAgreementComponent;
  let fixture: ComponentFixture<UserAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
