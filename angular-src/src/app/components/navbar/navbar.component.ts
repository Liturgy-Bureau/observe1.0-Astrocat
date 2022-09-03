import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { ViewshelperService } from '../../services/viewshelper.service';
import { UxmessagesService } from '../../services/uxmessages.service';
import { AuthService } from '../../services/auth.service';
import { SocketioService } from '../../services/socketio.service';
import { LogoutService } from '../../services/logout.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private notifier: UxmessagesService,
    private viewsHelper: ViewshelperService,
    private auth: AuthService,
    private socketService: SocketioService,
    private logoutSrvce: LogoutService
  )  { }

  showOnSmallScreen = false; // WETHER SHOW OR HIDE ACCORDING TO SCREEN RESOLUTION
  currentWindowWidth = 0; // INIT - THE CURRENT (OPENED) SCREEN SIZE
  curRoute = '';
  splittedString: any; // INIT - THE CURRENT ROUTE WITH THE SLASH
  noSlashRoute: any; // INIT - THE CURRENT ROUTE WITHOUT THE SLASH - A SUBSTRING

  isDark = true; // SET TO TRU TO START IN A DARK MODE

  askMinimized = false; // IF THE MINIMIZE BUTTON IS PRESSED

  username: any;
  avatar: any;


  ngOnInit(): void {
    this.currentWindowWidth = window.innerWidth; // GET THE CURRENT SCREEN WIDTH
    this.getRouteToDisplayOnSidebar(); // SET THE ROUTE IN SIDEBAR
    this.displayUData();
  }

// HOST LISTENER TO CHECK FOR SCREEN SIZE AND SHOW OR HIDE SIDEBAR
  @HostListener('window: resize')
  onResize() {
    this.currentWindowWidth = window.innerWidth;
  }

  ngOnDestroy(): void {
    this.viewsHelper.globalUsername.unsubscribe(); // don't forget to destroy subscriptions!!!
    this.viewsHelper.globalAvatar.unsubscribe(); // don't forget to destroy subscriptions!!!
  }

  // DISPLAY THE CURRENT ROUTE IN THE SIDEBAR HEADER
  getRouteToDisplayOnSidebar(){
    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd ) {
        if (event.url === '/') {
          this.noSlashRoute = 'home';
          } else {
            if (event instanceof NavigationEnd) {
              if (event.url === '/error404') {
                this.noSlashRoute = 'error404';
              } else {
              this.curRoute = event.url;
              this.splittedString = this.curRoute.split('/', 2);
              this.noSlashRoute = this.splittedString[1];
              }
            }
          }
        // console.log("current url", event.url); // event.url has current url
      }
    });
  }

  displayUData() {
    this.viewsHelper.globalUsername.subscribe(value => {
      this.username = value;
    });
    this.viewsHelper.globalAvatar.subscribe(value => {
      this.avatar = value;
    });
    if (this.auth.isLoggedIn()) {
      this.viewsHelper.globalUsername.next(JSON.parse(localStorage.getItem('currentUser') || '{}')
      .substring(0, (localStorage.getItem('currentUser') || '{}').indexOf(' ')));
      this.viewsHelper.globalAvatar.next(localStorage.getItem('avatar'));
    }
    /*
    if (this.auth.isLoggedIn()) {
      this.viewsHelper.globalAvatar.next(localStorage.getItem('avatar'));
    }
    */
  }

  // CHANGE THEMING
  changeTheme(){
    // alert('you are changing theme!');
    this.isDark = !this.isDark;
    // console.log(this.isDark);
  }

  // MINIMIZE SIDEBAR AND EXPAND THE MAIN DIV CONTAINER
  minimize(){
    this.askMinimized = !this.askMinimized;
    this.viewsHelper.shouldMainContainerExpand.next(true);
  }

  // MAXIMIZE SIDEBAR AND COMPRESS THE MAIN DIV CONTAINER
  maximize(){
    this.askMinimized = !this.askMinimized;
    this.viewsHelper.shouldMainContainerExpand.next(false);
  }

  isLoggedIn(){
    const state = this.auth.isLoggedIn();
    return state;
  }

  // THE LOGOUT CLICK FUNCTION
  logoutClick(){
    this.socketService.callToTerminateTabs();
    return false;

  }

}

