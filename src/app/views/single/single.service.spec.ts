import { TestBed, inject } from '@angular/core/testing';

import { SingleService } from './single.service';

describe('SingleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SingleService]
    });
  });

  it('should be created', inject([SingleService], (service: SingleService) => {
    expect(service).toBeTruthy();
  }));
});
