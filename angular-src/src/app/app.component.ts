import { Component, OnInit } from '@angular/core';
import { ViewshelperService } from 'src/app/services/viewshelper.service';
import { fadeAnimation } from './app-route-animations';
import { AuthService } from './services/auth.service';
import { SocketioService } from './services/socketio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  animations: [fadeAnimation]
})
export class AppComponent {

  title = 'angular-src';

  constructor(
    private router: Router,
    private viewsHelper: ViewshelperService,
    private auth: AuthService,
    private socketService: SocketioService
  ) { }


  shouldMainContainerExpand = false; // FOR THE SIDEBAR MIN/MAX BUTTON

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit(): void {

    // HAVE A CHECK FOR THE MINIMIZE/MAXIMIZED BUTTON PRESSED AND EXPAND OR COMPRESS THE SIDEBAR
   this.viewsHelper.shouldMainContainerExpand.subscribe( value => {
    this.shouldMainContainerExpand = value;
    // console.log(this.shouldMainContainerExpand);
   });
   if (this.auth.isLoggedIn()) {
    // EACH TIME A PAGE REFRESH HAPPENS - RECONNECT TO SOCKET...
    this.startSocketConnection();
    // IMPORTANT! here we listen for termination - socket disconnect Both in
    // main tab AND in ALL other tabs opened
    this.socketService.terminateTabs().subscribe((res: any) => {
      console.log(res);
    });
   }
   window.addEventListener('storage', (ev: any) => {
    if (ev.key !== 'message') {
      return; } // ignore other keys
    const message = JSON.parse(ev.newValue);
    if (!message) {
      return; } // ignore empty msg or msg reset
    // Got the message - do something with it
    if (message.command === 'relogin') {
      // console.log(message.command);
      // console.log(message.who);
      // console.log(message.withId);
    }
    this.startSocketConnection();
    this.socketService.terminateTabs().subscribe((res: any) => {
      console.log(res);
    });
    this.router.navigate(['/dashboard']); // after successful registration navigate to login page
    this.viewsHelper.globalAvatar.next(message.andAvatar);
   }); // if there is another open tab, waits for a command ex. 'relogin'
  }


  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy(): void {
    this.socketService.disconnect();
    this.viewsHelper.shouldMainContainerExpand.unsubscribe();
    window.removeEventListener('storage', (ev: any) => {});
  }

/*
  // CHECK IF SOME USER IS LOGGED IN
  isLoggedIn(){
    const state = this.auth.isLoggedIn();
    return state;
  }
*/

  // START - RESTART SOCKETS _ USED WHEN REFRESHING ALSO / SOCKETS STARTS IN LOGIN!!!
  startSocketConnection() {
    this.socketService.setupSocketConnection(localStorage.getItem('currentUser'), localStorage.getItem('id'));
  }

}
