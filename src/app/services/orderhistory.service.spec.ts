import { TestBed } from '@angular/core/testing';

import { OrderhistoryService } from './orderhistory.service';

describe('OrderhistoryService', () => {
  let service: OrderhistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderhistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
