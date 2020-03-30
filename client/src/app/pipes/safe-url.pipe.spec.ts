import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { inject, TestBed } from '@angular/core/testing';
import { SafeUrlPipe } from './safe-url.pipe';

describe('SafeUrlPipe', () => {
  beforeEach(() => {
    TestBed
      .configureTestingModule({
        imports: [
          BrowserModule
        ]
      });
  });

  it('create an instance', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
    let pipe = new SafeUrlPipe(domSanitizer);
    expect(pipe).toBeTruthy();
  })); 

  it('#transfrom returns a safeUrl', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
    let pipe = new SafeUrlPipe(domSanitizer);
    let unsafeUrl = "unsafe:data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR=="
    expect(pipe.transform(unsafeUrl)).toEqual(domSanitizer.bypassSecurityTrustResourceUrl(unsafeUrl));
  })); 
});