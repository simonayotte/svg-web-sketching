
import { DatabaseService } from './DB.service';
//import { expect } from 'chai';
import { Drawing } from '../../models/drawing';
import { Stubbed, testingContainer } from '../../test/test-utils';
import Types from '../types';

let mongodb = require('mongo-mock');
mongodb.max_delay = 0;//you can choose to NOT pretend to be async (default is 400ms)
let MongoClient = mongodb.MongoClient;
let array : Drawing[];
let tagsArray : Array<string>;
let name: String;

describe('MongoDB Mocked here', () => {

  let connected_db: any;
  //let mockCollection: any;
  let database: Stubbed<DatabaseService>;

  beforeEach(async () => {
    const [container, sandbox] = await testingContainer();
        container.rebind(Types.DatabaseService).toConstantValue({
          addDrawingDb : sandbox.stub().resolves(undefined),
          getAllDrawingsDb: sandbox.stub().resolves(array),
          deleteDrawingDb: sandbox.stub().resolves(undefined),
          validateName: sandbox.stub().resolves(name),
          validateTags: sandbox.stub().resolves(tagsArray),
        });
        database = container.get(Types.DatabaseService);
    MongoClient.connect("MongoMock", {}, (err: any, client: any) => {
      connected_db = client.db();

      //mockCollection = connected_db.collection("MongoMock");

      console.log('Mock de MongoDB connecter!');
    });
  });

  afterEach(() => {
    connected_db.close();
  });

  
    
  it('should delete a drawing', () => {
    const drawing= new Drawing("abc",["1","2"],'data',["",""],1,1,[1,1,1]);
    database.addDrawingDb(drawing);
    database.deleteDrawingDb(drawing._id);
  });


  it('should validate a name', () => {

    const drawing= new Drawing("abc",["1","2"],'data',["",""],1,1,[1,1,1]);
    console.log(database.validateName(drawing.name));
  });

  it('should validate tags', () => {
  
    const drawing= new Drawing("abc",["1","2"],'data',["",""],1,1,[1,1,1]);
    console.log(drawing.tags);
    console.log(database.validateTags(drawing.tags));
    
  });

  it('should not validate tags', () => {
  
    const drawing= new Drawing("abc",["1","2"],'data',["",""],1,1,[1,1,1]);
    console.log(drawing.tags);
    console.log(database.validateTags(drawing.tags));    
  });

  });