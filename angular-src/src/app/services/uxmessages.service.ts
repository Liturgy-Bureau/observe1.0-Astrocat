import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UxmessagesService {

  constructor(private toastr: ToastrService) {

  }

  uxSuccess(message: any, title: any, timespan: any){
    this.toastr.success(message, title, {
      timeOut: timespan
    });
  }

  uxFalse(message: any, title: any, timespan: any){
    this.toastr.error(message, title, {
      timeOut: timespan
    });
  }

  uxWarn(message: any, title: any, timespan: any){
    this.toastr.warning(message, title, {
      timeOut: timespan
    });
  }

  uxInfo(message: any, title: any, timespan: any){
    this.toastr.info(message, title, {
      timeOut: timespan
    });
  }

}
