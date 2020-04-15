import * as FormData from 'form-data';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { FileHandler } from '../services/file-handler.service';
import axios from 'axios';
import Types from '../types';

//require('dotenv').config();
const API_KEY = '736a0365-3b0e-4b8e-9598-2f6c73fdb290';

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
                }
                catch (e) {
                    const errorMsg = { status: '400', message: e.message };
                    res.json(errorMsg);
                }
                const succesMsg = { status: '200', message: 'Image exportée avec succès!' };
                res.json(succesMsg);
            }
            if (req.body.option === 'two') {
                console.log("CONTROLLER OPTION=2");

                // verify req.body.to
                const exportReturn = await this.fileHandler.exportDrawingEmail(req.body.name, req.body.type, req.body.dataURL);
                console.log('exportReturn', exportReturn);
                const formData = new FormData();
                console.log('REQ BODY TYPE', req.body.type);
                console.log(formData);
                formData.append('to', req.body.to);
                console.log('REQ BODY TYPE APRES APPEND', req.body.type);
                console.log(exportReturn.stream, req.body.name);
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
                console.log('ALLO AVANT AXIOS');
                axios({
                    method: 'post',
                    url: 'https://log2990.step.polymtl.ca/email?address_validation=true',
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-Team-Key': API_KEY,   // x-team-key utiliser dotenv!!!!!
                        ...formData.getHeaders(),
                    }
                })
                    .then(() => {
                        console.log('ALLO.then');
                        let succesMsg = { status: '200', message: 'Email envoyé avec succès!' };
                        res.json(succesMsg);
                    })
                    .catch((err) => {
                        console.log('ALLO', err.response.status);
                        switch (err.response.status) {
                            case 400:
                                res.json({
                                    status: '400',
                                    message: 'Email invalide. API(email) narrive pas à joindre cette adresse courriel',
                                });
                                break;

                            case 403:
                                res.json({
                                    status: '403',
                                    message: 'Votre requête ne comporte pas le header HTTP valide X-Team-Key.',
                                })
                                break;

                            case 422:
                                res.json({
                                    status: '422',
                                    message: 'Votre requête ne passe pas la validation de base (vous nenvoyez probablement pas le bon type de données,'
                                        + 'regardez que votre adresse courriel est bien présent, regardez que le payload est bel et bien un fichier)',
                                })
                                break;

                            case 429:
                                res.json({
                                    status: '429',
                                    message: 'Vous avez dépassé votre quota de courriel alloué par heure.',
                                });
                                break;

                            case 500:
                                res.json({
                                    status: '500',
                                    message: ' Le mail API éprouve des difficultés à envoyer le courriel',
                                })
                                break;
                        }
                    }); console.log('APRES CATCH DE AXIOS');
            }
        });
    }
}
