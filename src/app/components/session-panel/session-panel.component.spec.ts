import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionPanelComponent } from './session-panel.component';

describe('SessionPanelComponent', () => {
  let component: SessionPanelComponent;
  let fixture: ComponentFixture<SessionPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
