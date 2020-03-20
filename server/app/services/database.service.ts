import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions, FilterQuery } from 'mongodb';
import 'reflect-metadata';
import { Drawing} from '../../models/drawing';

// CHANGE the URL for your database information
//const DATABASE_URL = 'mongodb+srv://Admin:admin1234@cluster0-nxhwj.gcp.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE_URL = 'mongodb+srv://Tarik:log2990@cluster0-pgvib.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE_NAME = 'Drawings-LOG2990-106.drawings';
const DATABASE_COLLECTION = 'drawings';

@injectable()
export class DatabaseService {
  
    collection: Collection<Drawing>;

    private options: MongoClientOptions = {
        useNewUrlParser : true,
        useUnifiedTopology : true
    };

    constructor() {
        MongoClient.connect(DATABASE_URL, this.options)
            .then((client: MongoClient) => {
                this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
                console.log('DB Mongo connecter!');
            })
            .catch(() => {
                console.error('CONNECTION ERROR. EXITING PROCESS TO CONNECT MONGODB');
                process.exit(1);
            });
    }

    async addDrawingDb(name:string, tags: Array<string>): Promise<void>{
        if(this.validateName(name)){
            const drawing= new Drawing;
            drawing.title=name;
            drawing.tags=tags;
            this.collection.insertOne(drawing).catch((error:Error)=>{
                throw error;
            });
        }
        else{
            throw new Error("Cannot save drawing in database");
        }
    }
    async deleteDrawingDb(drawingName:string): Promise<void>{
        return this.collection
            .findOneAndDelete({ name: drawingName})
        .then(() => { })
        .catch((error: Error) => {
            throw new Error("Failed to delete course");
        });
    }

    async getAllDrawingsDb(): Promise<Drawing[]> {
        return  this.collection.find({}).toArray()
                .then((drawing:Drawing[])=>{
                    return drawing;
                })
                .catch((error: Error) => {
                    throw new Error("Failed to get all drawings");
                });
    }

    async getDrawingsDbByTags(tag:string): Promise<Drawing[]> {
        let filterQuery: FilterQuery<Drawing> = {tag: name};
        return  this.collection.find(filterQuery).toArray()
                .then((drawing:Drawing[])=>{
                    return drawing;
                })
                .catch((error: Error) => {
                    throw new Error("Failed to get all drawings matching this tag");
                });
    }


    private validateName(name: string):boolean{
        if (name=="") // pas de nom vide 
            return false;
        else
            return true;
    }


}
