import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferSalesPage } from './offer-sales.page';

describe('OfferSalesPage', () => {
  let component: OfferSalesPage;
  let fixture: ComponentFixture<OfferSalesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferSalesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferSalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
