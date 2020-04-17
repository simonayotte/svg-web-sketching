import { expect } from 'chai';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { FileHandler } from '../services/file-handler.service';
import Types from '../types';
import {ExportReturn} from '../services/file-handler.service'
import * as fs from 'fs'

// tslint:disable:no-any
const HTTP_STATUS_OK = 200;

var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
// This sets the mock adapter on the default instance
var mock = new MockAdapter(axios);
const exportdrawingemail:ExportReturn = {name:'title', stream: fs.createReadStream('title') };

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
            exportDrawingEmail: sandbox.stub().resolves(exportdrawingemail)
        });

        filehandler = container.get(Types.FileHandler);
        app = container.get<Application>(Types.Application).app;
    });

    it('should return message from FileHandler service on valid post request ', async () => {
        expect(filehandler.exportDrawing().called);
        return supertest(app)
            .post('/exportdrawing')
            .send({
                name:'title',
                type: 'jpeg',
                option:'one',
                to:''
            })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body.title).to.equal(undefined);
            });
    });

    it('should return an error as a message on service fail', async () => {
        expect(filehandler.exportDrawing().called);
        expect(filehandler.exportDrawing.throws(new Error('errorTest')));
        return supertest(app)
            .post('/exportdrawing')
            .send({
                name:'title',
                type: 'jpeg',
                option:'one',
                to:''
            })
            .expect(200) 
    });
    
    it('should return message on valid email post with jpeg ', async () => {
        mock.onPost("https://log2990.step.polymtl.ca/email?address_validation=true").reply(200); 
        expect(filehandler.exportDrawing().called);
        return supertest(app)
            .post('/exportdrawing')
            .send({
                name:'title',
                type: 'jpeg',
                option:'two',
                to:'abc@abc.com'
            })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body.title).to.equal(undefined);
            });
    });

    it('should return message on valid email post with png ', async () => {
        mock.onPost("https://log2990.step.polymtl.ca/email?address_validation=true").reply(200); 
        expect(filehandler.exportDrawing().called);
        return supertest(app)
            .post('/exportdrawing')
            .send({
                name:'title',
                type: 'png',
                option:'two',
                to:'abc@abc.com'
            })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body.title).to.equal(undefined);
            });
    });

    it('should return message on valid email post with svg ', async () => {
        mock.onPost("https://log2990.step.polymtl.ca/email?address_validation=true").reply(200); 
        expect(filehandler.exportDrawing().called);
        return supertest(app)
            .post('/exportdrawing')
            .send({
                name:'title',
                type: 'svg+xml',
                option:'two',
                to:'abc@abc.com'
            })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body.title).to.equal(undefined);
            });
    });

    it('should return error 400 on service fail ', async () => {
        mock.onPost("https://log2990.step.polymtl.ca/email?address_validation=true").reply('400'); 
        expect(filehandler.exportDrawingEmail().called);
        return supertest(app)
            .post('/exportdrawing')
            .send({
                name:'title',
                type: '',
                option:'two',
                to:'abc@abc.com'
            })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body.title).to.equal(undefined);
            });
    });
    
    it('should return error 403 on service fail ', async () => {
        mock.onPost("https://log2990.step.polymtl.ca/email?address_validation=true").reply('403'); 
        expect(filehandler.exportDrawingEmail().called);
        return supertest(app)
            .post('/exportdrawing')
            .send({
                name:'title',
                type: 'jpeg',
                option:'two',
                to:'abc@abc.com'
            })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body.title).to.equal(undefined);
            });
    });

    it('should return error 422 on service fail ', async () => {
        mock.onPost("https://log2990.step.polymtl.ca/email?address_validation=true").reply('422'); 
        expect(filehandler.exportDrawingEmail().called);
        return supertest(app)
            .post('/exportdrawing')
            .send({
                name:'title',
                type: 'jpeg',
                option:'two',
                to:''
            })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body.title).to.equal(undefined);
            });
    });

    it('should return error 429 on service fail ', async () => {
        mock.onPost("https://log2990.step.polymtl.ca/email?address_validation=true").reply('429'); 
        expect(filehandler.exportDrawingEmail().called);
        return supertest(app)
            .post('/exportdrawing')
            .send({
                name:'title',
                type: 'jpeg',
                option:'two',
                to:'abc@abc.com'
            })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body.title).to.equal(undefined);
            });
    });

    it('should return error 500 on service fail ', async () => {
        mock.onPost("https://log2990.step.polymtl.ca/email?address_validation=true").reply('500'); 
        expect(filehandler.exportDrawingEmail().called);
        return supertest(app)
            .post('/exportdrawing')
            .send({
                name:'title',
                type: 'jpeg',
                option:'two',
                to:'abc@abc.com'
            })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body.title).to.equal(undefined);
            });
    });

});
