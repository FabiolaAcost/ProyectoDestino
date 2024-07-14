import { TestBed } from '@angular/core/testing';

import { OpenTripMapService } from './open-trip-map.service';

describe('OpenTripMapService', () => {
  let service: OpenTripMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenTripMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});