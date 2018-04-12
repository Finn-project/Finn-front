import { TestBed, inject } from '@angular/core/testing';

import { FullModalService } from './full-modal.service';

describe('FullModalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FullModalService]
    });
  });

  it('should be created', inject([FullModalService], (service: FullModalService) => {
    expect(service).toBeTruthy();
  }));
});
