import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCustomerPage } from './edit-customer.page';

describe('EditCustomerPage', () => {
  let component: EditCustomerPage;
  let fixture: ComponentFixture<EditCustomerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCustomerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
