import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MypropertiesPage } from './myproperties.page';

describe('MypropertiesPage', () => {
  let component: MypropertiesPage;
  let fixture: ComponentFixture<MypropertiesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MypropertiesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MypropertiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
