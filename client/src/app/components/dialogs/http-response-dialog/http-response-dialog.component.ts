import { Component } from '@angular/core';
import { HttpResponseService } from '../../../services/http-response//http-response.service';

@Component({
  selector: 'app-http-response-dialog',
  templateUrl: './http-response-dialog.component.html',
  styleUrls: ['./http-response-dialog.component.scss']
})
export class HttpResponseDialogComponent {
  message: string;
  constructor(private httpResponseService: HttpResponseService) {
    this.httpResponseService.messageObs.subscribe((value: string) => {
      this.message = value;
    });
  }
}
