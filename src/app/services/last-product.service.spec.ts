import { TestBed } from '@angular/core/testing';

import { LastProductService } from './last-product.service';

describe('LastProductService', () => {
  let service: LastProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LastProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
