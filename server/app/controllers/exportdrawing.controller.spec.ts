import { expect } from 'chai';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { FileHandler } from '../services/file-handler.service';
import Types from '../types';

// tslint:disable:no-any
const HTTP_STATUS_OK = 200;

describe('exportDrawingController', () => {
    let filehandler: Stubbed<FileHandler>;
    let app: Express.Application;
    //let stub:any ;
    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        //stub =
        container.unbind(Types.FileHandler);
        container.bind(Types.FileHandler).toConstantValue({
            exportDrawing: sandbox.stub().resolves(undefined),
        });

        filehandler = container.get(Types.FileHandler);
        app = container.get<Application>(Types.Application).app;

    });

    it('should return message from FileHandler service on valid post request ', async () => {
        expect(filehandler.exportDrawing().called);
        return supertest(app)
            .post('/exportdrawing')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body.title).to.equal(undefined);
            });
    });

    it('should return an error as a message on service fail', async () => {
        expect(filehandler.exportDrawing().called);
        expect(filehandler.exportDrawing.throws().called);
        return supertest(app)
            .post('/exportdrawing')
            .expect(200)
            
    });

});
