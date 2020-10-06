import { TestBed } from '@angular/core/testing';

import { TokenDatabaseService } from './token-database.service';

describe('TokenDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TokenDatabaseService = TestBed.get(TokenDatabaseService);
    expect(service).toBeTruthy();
  });
});
