import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPanelComponent } from './config-panel.component';

describe('ConfigPanelComponent', () => {
  let component: ConfigPanelComponent;
  let fixture: ComponentFixture<ConfigPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
