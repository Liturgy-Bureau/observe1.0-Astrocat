import { TestBed } from '@angular/core/testing';

import { UxmessagesService } from './uxmessages.service';

describe('UxmessagesService', () => {
  let service: UxmessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UxmessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
