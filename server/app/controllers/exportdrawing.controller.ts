import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { FileHandler } from '../services/file-handler.service';
import Types from '../types';
import axios from 'axios';

@injectable()
export class ExportDrawingController {
    router: Router;

    constructor(@inject(Types.FileHandler) private fileHandler: FileHandler) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            // Send the request to the service and send the response
            try {
                // verify email PATTERN

                const blob = this.fileHandler.exportDrawing(req.body.name, req.body.type, req.body.dataURL);
                // npm i formdata @types/form-data

                // form
                const formData = new FormData();
                formData.append('to', req.body.email);
                formData.append('payload', blob, `${req.body.name}.${req.body.type}`);

                // header a donner (c'est la clé reçu par courriel)
                // 'X-Team-Key' 736a0365-3b0e-4b8e-9598-2f6c73fdb290

                // query 
                // https://log2990.stemp.polymtl.ca/email?dry_run=true  // dry_run=true a retirer lorsque le bug sera fixed
                
                // axios
                const res2 = await axios({
                    method: 'post',
                    url: 'https://log2990.stemp.polymtl.ca/email?dry_run=true',
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-Team-Key': '736a0365-3b0e-4b8e-9598-2f6c73fdb290',   // x-team-key utiliser dotenv!!!!!
                    }
                });
                // res2 verification
                if (res2.status === 200 || res2.status === 202) {
                    res.json({
                        status: '200',
                        message: 'Email envoyé',
                    });
                } else {
                    console.log(res2.data);
                    res.json({
                        status: '406',
                        message: 'oops',
                    });
                }
            }
            catch(e){
                let errorMsg = {status:'400', message: e.message}
                res.json(errorMsg);
            }
            // let succesMsg = {status:'200', message:'Image exportée avec succès!'}
            // res.json(succesMsg);
        });
    }
}
