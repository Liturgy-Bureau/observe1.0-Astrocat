import { TestBed } from '@angular/core/testing';

import { ViewshelperService } from './viewshelper.service';

describe('ViewshelperService', () => {
  let service: ViewshelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewshelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
