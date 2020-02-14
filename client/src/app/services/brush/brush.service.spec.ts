import { TestBed } from '@angular/core/testing';

//import { BrushService } from './brush.service';

describe('BrushService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        //const service: BrushService = TestBed.get(BrushService);
        //expect(service).toBeTruthy();
    });

    it('#setTexture should mofidy texture correctly if the texture string is valid', () => {
        //const service: BrushService = TestBed.get(BrushService);
        //should i create getters and setters only for the purpose of testing? Or make attributes public
        //How to test mouse event functions like continue draw?
    });

    it('#setTexture should set texture to null if the texture string is not valid', () => {});

    it('#setThickness should modify thickness correctly', () => {});
});
