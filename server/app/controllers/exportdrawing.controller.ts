import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { ExportDrawingService } from '../services/export-drawing.service';
import Types from '../types';

@injectable()
export class ExportDrawingController {
    router: Router;

    constructor(@inject(Types.ExportDrawingService) private exportDrawingService: ExportDrawingService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/', (req: Request, res: Response, next: NextFunction) => {
            // Send the request to the service and send the response
            try{
                this.exportDrawingService.exportDrawing(req.body.name, req.body.type, req.body.dataURL);
            }
            catch(e){
                let errorMsg = {status:'400', message: e.message}
                res.json(errorMsg);
            }
            let succesMsg = {status:'200', message:'Image exportée avec succès!'}
            res.json(succesMsg)
        });
    }
}
