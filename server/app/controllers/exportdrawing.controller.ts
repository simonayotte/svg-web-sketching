import axios from 'axios';
import { NextFunction, Request, Response, Router } from 'express';
import * as FormData from 'form-data';
import { inject, injectable } from 'inversify';
import { FileHandler } from '../services/file-handler.service';
import Types from '../types';

import * as dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.API_KEY;
// Pour avoir accès au API_KEY:
// 1) Créer un ficher nommé ".env" dans le dossier 'server'
// 2) Dans ce fichier écrivez: API_KEY=' Clé ici ' En remplaçant (Clé ici) par le API_KEY en laissant les ' '.

const error400 = 400;
const error403 = 403;
const error422 = 422;
const error429 = 429;
const error500 = 500;

@injectable()
export class ExportDrawingController {
    router: Router;

    constructor(@inject(Types.FileHandler) private fileHandler: FileHandler) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            if (req.body.option === 'one') {
                try {
                    this.fileHandler.exportDrawing(req.body.name, req.body.type, req.body.dataURL);
                } catch (e) {
                        const errorMsg = { status: '400', message: e.message };
                        res.json(errorMsg);
                }
                const succesMsg = { status: '200', message: 'Image exportée avec succès!' };
                res.json(succesMsg);
            }
            if (req.body.option === 'two') {
                const exportReturn = await this.fileHandler.exportDrawingEmail(req.body.name, req.body.type, req.body.dataURL);
                const formData = new FormData();
                formData.append('to', req.body.to);
                switch (req.body.type) {
                    case 'png':
                        formData.append('payload', exportReturn.stream, {
                            filename: req.body.name + '.' + req.body.type,
                            contentType: 'image/png',
                        });
                        break;
                    case 'jpeg':
                        formData.append('payload', exportReturn.stream, {
                            filename: req.body.name + '.' + req.body.type,
                            contentType: 'image/jpeg',
                        });
                        break;
                    case 'svg+xml':
                        formData.append('payload', exportReturn.stream, {
                            filename: req.body.name + '.svg',
                            contentType: 'image/svg+xml',
                        });
                        break;
                    default:
                        formData.append('payload', exportReturn.stream, {
                            filename: req.body.name + '.jpeg',
                            contentType: 'image/jpeg',
                        });
                        break;
                }
                axios({
                    method: 'post',
                    url: 'https://log2990.step.polymtl.ca/email?address_validation=true',
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-Team-Key': API_KEY,   // x-team-key utiliser dotenv!
                        ...formData.getHeaders(),
                    }
                })
                    .then(() => {
                        const succesMsg = { status: '200', message: 'Email envoyé avec succès!' };
                        res.json(succesMsg);
                    })
                    .catch((err) => {
                        switch (err.response.status) {
                            case error400:
                                res.json({
                                    status: '400',
                                    message: 'Email invalide. API(email) narrive pas à joindre cette adresse courriel',
                                });
                                break;

                            case error403:
                                res.json({
                                    status: '403',
                                    message: 'Votre requête ne comporte pas le header HTTP valide X-Team-Key.',
                                });
                                break;

                            case error422:
                                res.json({
                                    status: '422',
                                    message: 'Votre requête ne passe pas la validation de base '
                                    + ' (vous nenvoyez probablement pas le bon type de données,'
                                    + ' regardez que votre adresse courriel est bien présent,'
                                    + ' regardez que le payload est bel et bien un fichier)',
                                });
                                break;

                            case error429:
                                res.json({
                                    status: '429',
                                    message: 'Vous avez dépassé votre quota de courriel alloué par heure.',
                                });
                                break;

                            case error500:
                                res.json({
                                    status: '500',
                                    message: ' Le mail API éprouve des difficultés à envoyer le courriel',
                                });
                                break;

                            default:
                                res.json({
                                    status: '0',
                                    message: ' message par defaut',
                                });
                        }
        });
    }});
    }
}
