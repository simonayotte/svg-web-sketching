import axios from 'axios';
import mockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import * as fs from 'fs';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { ExportReturn, FileHandler } from '../services/file-handler.service';
import Types from '../types';

// tslint:disable:no-any
const HTTP_STATUS_OK = 200;
const error400 = 400;
const error403 = 403;
const error422 = 422;
const error429 = 429;
const error500 = 500;

// This sets the mock adapter on the default instance
const mock = new mockAdapter(axios);
fs.writeFileSync('title', '');
const exportdrawingemail: ExportReturn = {name: 'title', stream: fs.createReadStream('title') };

describe('exportDrawingController', () => {
    let filehandler: Stubbed<FileHandler>;
    let app: Express.Application;
    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
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
                name: 'title',
                type: 'jpeg',
                option: 'one',
                to: ''
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
                name: 'title',
                type: 'jpeg',
                option: 'one',
                to: ''
            })
            .expect(HTTP_STATUS_OK);
    });

    it('should return message on valid email post with jpeg ', async () => {
        mock.onPost('https://log2990.step.polymtl.ca/email?address_validation=true').reply(HTTP_STATUS_OK);
        expect(filehandler.exportDrawing().called);
        return supertest(app)
            .post('/exportdrawing')
            .send({
                name: 'title',
                type: 'jpeg',
                option: 'two',
                to: 'abc@abc.com'
            })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body.title).to.equal(undefined);
            });
    });

    it('should return message on valid email post with png ', async () => {
        mock.onPost('https://log2990.step.polymtl.ca/email?address_validation=true').reply(HTTP_STATUS_OK);
        expect(filehandler.exportDrawing().called);
        return supertest(app)
            .post('/exportdrawing')
            .send({
                name: 'title',
                type: 'png',
                option: 'two',
                to: 'abc@abc.com'
            })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body.title).to.equal(undefined);
            });
    });

    it('should return message on valid email post with svg ', async () => {
        mock.onPost('https://log2990.step.polymtl.ca/email?address_validation=true').reply(HTTP_STATUS_OK);
        expect(filehandler.exportDrawing().called);
        return supertest(app)
            .post('/exportdrawing')
            .send({
                name: 'title',
                type: 'svg+xml',
                option: 'two',
                to: 'abc@abc.com'
            })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body.title).to.equal(undefined);
            });
    });

    it('should return error 400 on service fail ', async () => {
        mock.onPost('https://log2990.step.polymtl.ca/email?address_validation=true').reply(error400);
        expect(filehandler.exportDrawingEmail().called);
        return supertest(app)
            .post('/exportdrawing')
            .send({
                name: 'title',
                type: '',
                option: 'two',
                to: 'abc@abc.com'
            })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body.title).to.equal(undefined);
            });
    });

    it('should return error 403 on service fail ', async () => {
        mock.onPost('https://log2990.step.polymtl.ca/email?address_validation=true').reply(error403);
        expect(filehandler.exportDrawingEmail().called);
        return supertest(app)
            .post('/exportdrawing')
            .send({
                name: 'title',
                type: 'jpeg',
                option: 'two',
                to: 'abc@abc.com'
            })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body.title).to.equal(undefined);
            });
    });

    it('should return error 422 on service fail ', async () => {
        mock.onPost('https://log2990.step.polymtl.ca/email?address_validation=true').reply(error422);
        expect(filehandler.exportDrawingEmail().called);
        return supertest(app)
            .post('/exportdrawing')
            .send({
                name: 'title',
                type: 'jpeg',
                option: 'two',
                to: 'anything'
            })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body.title).to.equal(undefined);
            });
    });

    it('should return error 429 on service fail ', async () => {
        mock.onPost('https://log2990.step.polymtl.ca/email?address_validation=true').reply(error429);
        expect(filehandler.exportDrawingEmail().called);
        return supertest(app)
            .post('/exportdrawing')
            .send({
                name: 'title',
                type: 'jpeg',
                option: 'two',
                to: 'abc@abc.com'
            })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body.title).to.equal(undefined);
            });
    });

    it('should return error 500 on service fail ', async () => {
        mock.onPost('https://log2990.step.polymtl.ca/email?address_validation=true').reply(error500);
        expect(filehandler.exportDrawingEmail().called);
        return supertest(app)
            .post('/exportdrawing')
            .send({
                name: 'title',
                type: 'jpeg',
                option: 'two',
                to: 'abc@abc.com'
            })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body.title).to.equal(undefined);
            });
    });

    it('should return default message on service ', async () => {
        mock.onPost('https://log2990.step.polymtl.ca/email?address_validation=true').reply(0);
        expect(filehandler.exportDrawingEmail().called);
        return supertest(app)
            .post('/exportdrawing')
            .send({
                name: 'title',
                type: 'jpeg',
                option: 'two',
                to: 'abc@abc.com'
            })
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body.message).to.equal(' message par defaut');
            });
    });

    fs.unlinkSync('title');
});
