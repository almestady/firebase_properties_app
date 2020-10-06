import { TestBed } from '@angular/core/testing';

import { Property.Model.TsService } from './property.model.ts.service';

describe('Property.Model.TsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Property.Model.TsService = TestBed.get(Property.Model.TsService);
    expect(service).toBeTruthy();
  });
});
