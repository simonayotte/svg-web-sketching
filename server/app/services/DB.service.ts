import {injectable} from 'inversify';
import { Collection, MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import 'reflect-metadata';
import {Drawing} from '../../models/drawing';

const DATABASE_URL = 'mongodb+srv://Tarik:log2990@cluster0-pgvib.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE_NAME = 'Drawings-LOG2990-106';
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

    async addDrawingDb(drawing: Drawing): Promise<void> {
        if (!this.validateName(drawing.name)) {
            throw new Error('Erreur:Le nom est requis. Image non sauvegardée');
          }
        if (!this.validateTags(drawing.tags)) {
            throw new Error("Erreur:Les étiquettes ne doivent pas contenir de caractères spéciaux ou d'espaces. Image non sauvegardée");
          }
        this.collection.insertOne(drawing).catch((error: Error) => {
            throw new Error(`Erreur: Le dessin n'a pas pu être sauvegardé: \n ${error}`);
            });
    }
    async deleteDrawingDb(id: string) {
        return this.collection.findOneAndDelete({_id :  new ObjectId(id)})
        .catch((error: Error) => {
            throw new Error(`Failed to delete course: \n ${error}`);
        });
    }

    async getAllDrawingsDb(): Promise<Drawing[]> {
        return  this.collection.find({}).toArray()
                .then((drawing: Drawing[]) => {
                    return drawing;
                })
                .catch((error: Error) => {
                    throw new Error(`Failed to get all drawings: \n ${error}`);
                });
    }

    async getIdsOfDrawing(name: string, tags: string[]) {
        const ids: string[] = [];
        return this.collection.find({name: name, tags: tags}).toArray().then((drawings: Drawing[]) => {
            for (const drawing of drawings) {
                ids.push(drawing._id.toHexString());
            }
            return ids;
          })
          .catch((error: Error ) => {
              throw new Error(`Failed to get the ids of the drawings: \n ${error}`);
          });
    }

    validateName(name: string): boolean {
        return name.length > 0;
    }

    validateTags(tags: string[]): boolean {
        for (const tag of tags) {
            if (tag.match('[^a-zA-Z0-9-\S]+') != null) {
                return false;
            }
        }
        return true;
    }
}
