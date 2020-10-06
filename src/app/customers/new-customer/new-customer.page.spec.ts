import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCustomerPage } from './new-customer.page';

describe('NewCustomerPage', () => {
  let component: NewCustomerPage;
  let fixture: ComponentFixture<NewCustomerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCustomerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
