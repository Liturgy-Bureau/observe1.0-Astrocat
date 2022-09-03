import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { ViewshelperService } from '../services/viewshelper.service';
import { UxmessagesService } from '../services/uxmessages.service';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  constructor(
    private router: Router,
    private notifier: UxmessagesService,
    private viewsHelper: ViewshelperService,
    private auth: AuthService,
  ) { }

  socket: any;
  adminSocket: any;

// ====================== GLOBAL SOCKET FUNCTIONS ========================= //
// ======================================================================== //

// The global socket connection --- >>>
  setupSocketConnection(usr: any, id: any) {
    this.socket = io(environment.SOCKET_ENDPOINT + '/', {query: {usr, id}, transports: ['websocket'], upgrade: false, reconnection: true});
  }
// -------------------------------- <<<

// The global termination ------ >>>
// functions - performs logout
  callToTerminateTabs() {
    this.socket.emit('terminateAllTabs');
  }
  terminateTabs() {
    return new Observable((observer: any) => {
      this.socket.on('terminateAllTabs', (message: any) => {
        observer.next(message);
        this.auth.logout();
        this.notifier.uxInfo('you are now logged out', 'notification', 6000);
        this.viewsHelper.globalUsername.next('traveller');
        this.viewsHelper.globalAvatar.next('../../../assets/pictures/guest-avatar.png');
        this.router.navigate(['/login']);
      });
    });
  }
  // ------------------------- <<<

  // Global Disconnect - not used >>>
  // we use termination of uid in
  // rooms instead
  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
  }
  // ---------------------------- <<<

  // ====================================================================//


  // ============ ADMIN / MOD FUNCTIONS =========== //

  adminConnect() {
    this.adminSocket = io(environment.SOCKET_ENDPOINT + '/admin', { transports: ['websocket'], upgrade: false });
  }

  adminReceiveMsg() {
    return new Observable((observer: any) => {
      this.adminSocket.on('infoForAdmin', (message: any) => {
        observer.next(message);
      });
    });
  }
  // ============================================== //

  // ============ GLOBAL CHAT FUNCTIONS =========== //
  chatReceiveMsg() {
    return new Observable((observer: any) => {
      this.adminSocket.on('infoForChat', (message: any) => {
        observer.next(message);
      });
    });
  }
  // ============================================== //
}
