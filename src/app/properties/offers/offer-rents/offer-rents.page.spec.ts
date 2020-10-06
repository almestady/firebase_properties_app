import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferRentsPage } from './offer-rents.page';

describe('OfferRentsPage', () => {
  let component: OfferRentsPage;
  let fixture: ComponentFixture<OfferRentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferRentsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferRentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
