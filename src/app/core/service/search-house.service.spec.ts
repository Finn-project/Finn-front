import { TestBed, inject } from '@angular/core/testing';

import { SearchHouseService } from './search-house.service';

describe('SearchHouseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchHouseService]
    });
  });

  it('should be created', inject([SearchHouseService], (service: SearchHouseService) => {
    expect(service).toBeTruthy();
  }));
});
