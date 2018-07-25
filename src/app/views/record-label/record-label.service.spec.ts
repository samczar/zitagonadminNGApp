import { TestBed, inject } from '@angular/core/testing';

import { RecordLabelService } from './record-label.service';

describe('RecordLabelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecordLabelService]
    });
  });

  it('should be created', inject([RecordLabelService], (service: RecordLabelService) => {
    expect(service).toBeTruthy();
  }));
});
