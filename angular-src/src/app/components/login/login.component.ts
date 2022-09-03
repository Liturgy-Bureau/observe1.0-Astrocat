import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ViewshelperService } from '../../services/viewshelper.service';
import { UxmessagesService } from '../../services/uxmessages.service';
import { AuthService } from '../../services/auth.service';
import { SocketioService } from 'src/app/services/socketio.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  loginForm: any; // the login form
  signedUser: any; // the authorized user retrieved straight from local storage after login

  constructor(
    private formBuilder: FormBuilder,
    private notifier: UxmessagesService,
    private auth: AuthService,
    private router: Router,
    private viewsHelper: ViewshelperService,
    private socketService: SocketioService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // form value
      password: ['', Validators.required], // form value
    });
  }

  ngOnInit(): void {

  }

  // get the values from the form fields to validate
  get email() {return this.loginForm.get('email'); }
  get password() {return this.loginForm.get('password'); }

  login(formValue: any){
    const user2login = {
      email: formValue.email.trim(),
      password: formValue.password.trim()
    };
    // call the http post function to login finally
    this.auth.authenticateUser(user2login).subscribe((responseData: any) => {
      if (responseData.success){
        // console.log(responseData);
        this.auth.storeLoggedUserData(responseData.token,
                                      responseData.user.fullname,
                                      responseData.user.id,
                                      responseData.user.avatar);
        this.notifier.uxSuccess(responseData.msg, 'notification', 6000);
         // set the globalUsername variable in viewhelper service
        this.viewsHelper.globalUsername.next(JSON.parse(localStorage.getItem('currentUser') || '{}')
        .substring(0, (localStorage.getItem('currentUser') || '{}').indexOf(' ')));
        // set the globalAvatar variable in viewhelper service
        if (responseData.user.avatar) {
          localStorage.setItem('avatar', responseData.user.avatar);
          this.viewsHelper.globalAvatar.next(localStorage.getItem('avatar'));
        } else {
          localStorage.setItem('avatar', '../../../assets/pictures/incognito.png');
          this.viewsHelper.globalAvatar.next(localStorage.getItem('avatar'));
        }
        this.router.navigate(['/dashboard']); // After successful registration navigate to login page
        // console.log(this.signedUser);
      } else {
        this.notifier.uxFalse(responseData.msg, 'notification', 6000);
        this.router.navigate(['/login']);
        // console.log(responseData);
      }
      // CONNECT TO WEB SOCKET SERVER HERE SEND USEFUL USER INFO
      this.socketService.setupSocketConnection(responseData.user.fullname, responseData.user.id);
      this.socketService.terminateTabs().subscribe(/*(res: any) => { console.log(res); }*/); // NO NEED TO CONSOLE THE MESSAGE
      // For multitab relogin only!
      this.message_broadcast({command: 'relogin',
                            who: localStorage.getItem('currentUser'),
                            withId: localStorage.getItem('id'),
                            andAvatar: localStorage.getItem('avatar')});
    });
    // console.log(formValue);  // { name: '', pass: '' }
  }

  // Login restore for multitabs helper functions
  message_broadcast(message: any) {
    localStorage.setItem('message', JSON.stringify(message));
    localStorage.removeItem('message');
  }
}
