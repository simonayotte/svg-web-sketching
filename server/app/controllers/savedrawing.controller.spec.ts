
import { expect } from 'chai';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../../server/test/test-utils';//Stubbed,Stubbed,
import { Application } from '../app';
import { FileHandler } from '../services/file-handler.service';
import {DatabaseService} from '../services/DB.service';
import Types from '../types';
//import {Drawing} from '../../models/drawing'
import { ObjectID } from 'mongodb';
//import { Message } from '../../../common/communication/message';
//import { SaveDrawingController } from './savedrawing.controller';
//import { request } from 'express';
//import { ObjectId } from 'mongodb';


// tslint:disable:no-any
const HTTP_STATUS_OK = 200;
const array = [new ObjectID(12345)];

describe('saveDrawingController', () => {
    //const baseMessage = { title: 'Image sauvegardée avec succès!', body: '' } as Message;
    let filehandlerService: Stubbed<FileHandler>;
    let dbService: Stubbed <DatabaseService>;
    let app: Express.Application;
    // spy comme sur cote client sur savedrawing
    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();

        container.unbind(Types.DatabaseService);
        container.bind(Types.DatabaseService).toConstantValue({
            addDrawingDb: sandbox.stub().resolves(undefined),
            getIdsOfDrawing: sandbox.stub().resolves(array),
        });

        container.unbind(Types.FileHandler);
        container.bind(Types.FileHandler).toConstantValue({
            saveDrawing: sandbox.stub().resolves(undefined),
        });

        filehandlerService = container.get(Types.FileHandler);
        dbService = container.get(Types.DatabaseService);
        app = container.get<Application>(Types.Application).app;

    });

    it('should return message from saveDrawing service on valid post request ', async () => {

        //const aboutMessage = {baseMessage};
        expect(dbService.addDrawingDb().called);
        expect(filehandlerService.saveDrawing().called);
        return supertest(app)
            .post('/savedrawing')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                console.log(response.body);
                expect(response.body.status).to.equal('200');
                
            });
    });

    
});
