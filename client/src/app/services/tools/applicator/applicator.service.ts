import { Injectable } from '@angular/core';
import { Tool } from '../../../models/tool';

@Injectable({
    providedIn: 'root',
})
export class ApplicatorService extends Tool {
    constructor() {
        super();
    }
}
