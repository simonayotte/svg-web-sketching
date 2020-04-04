import { expect } from 'chai';
import * as supertest from 'supertest';
import { Message } from '../../../common/communication/message';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { IndexService } from '../services/index.service';
import Types from '../types';

// tslint:disable:no-any
const HTTP_STATUS_OK = 200;

describe('IndexController', () => {
    const baseMessage = { title: 'Hello world', body: 'anything really' } as Message;
    let indexService: Stubbed<IndexService>;
    let app: Express.Application;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(Types.IndexService).toConstantValue({
            helloWorld: sandbox.stub().resolves(baseMessage),
            about: sandbox.stub().resolves(baseMessage),
        });
        indexService = container.get(Types.IndexService);
        app = container.get<Application>(Types.Application).app;
    });

    it('should return message from index service on valid get request to root', async () => {
        return supertest(app)
            .get('/api/index')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(baseMessage);
            });
    });

    it('should return message from index service on valid get request to about route', async () => {
        const aboutMessage = { ...baseMessage, title: 'About' };
        indexService.about.returns(aboutMessage);
        return supertest(app)
            .get('/api/index/about')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(aboutMessage);
            });
    });
});
