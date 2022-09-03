import { Injectable } from '@angular/core';

import { SocketioService } from 'src/app/services/socketio.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(
    private socketService: SocketioService
  ) { }

    logout() {
      this.socketService.callToTerminateTabs();
    }

}
