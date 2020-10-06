import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPropertyPage } from './new-property.page';

describe('NewPropertyPage', () => {
  let component: NewPropertyPage;
  let fixture: ComponentFixture<NewPropertyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPropertyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPropertyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
