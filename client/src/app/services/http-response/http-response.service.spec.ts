import { TestBed } from '@angular/core/testing';

import { HttpResponseService } from './http-response.service';

describe('HttpResponseService', () => {
  let service: HttpResponseService;
  beforeEach(() => {
  TestBed.configureTestingModule({});
  service = TestBed.get(HttpResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#setMessage should set the message', () => {
    service.setMessage('hello');
    expect(service.getMessage()).toEqual('hello');
  });
});
