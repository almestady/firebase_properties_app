import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersBookingsPage } from './offers-bookings.page';

describe('OffersBookingsPage', () => {
  let component: OffersBookingsPage;
  let fixture: ComponentFixture<OffersBookingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffersBookingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersBookingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
