import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authToken: any;
  currentUser: any;

  constructor(private http: HttpClient,
              private jwtHelper: JwtHelperService) { }

  // ============= UTILITIES ============= //
  // STORE DATA THAT COMES WITH LOGIN TO LOCAL STORAGE
  storeLoggedUserData(token: any, user: any, id: any, avatar: any){
    localStorage.setItem('id_token', token);
    localStorage.setItem('id', JSON.stringify(id));
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('avatar', JSON.stringify(avatar));
    this.authToken = token;
    this.currentUser = user;
  }

  // THE LOGOUT HANDLE
  logout(){
    this.authToken = null;
    this.currentUser = null;
    localStorage.clear();
  }

  // LOAD CURRENT TOKEN FOR AUTHORIZED USES
  loadCurrentToken(){
    const currentToken = localStorage.getItem('id_token');
    this.authToken = currentToken;
  }

  // CHECK IF THE USER IS LOGGED IN
  isLoggedIn(){
    const token = localStorage.getItem('id_token');
    return token != null && !(this.jwtHelper.isTokenExpired(token));
  }

  // ===================================== //

  // FUNCTION TO REGISTER THE USER - HTTP POST
  registerNewUser(user: any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post( environment.HTTP_ENDPOINT + '/users/register', user, {headers});
  }

  // FUNCTION TO LOGIN/AUTHENTICATE THE USER - HTTP POST
  authenticateUser(user: any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post( environment.HTTP_ENDPOINT + '/users/authenticate', user, {headers});
  }

  // FUNCTION TO GET CURRENT USER PROFILE - HTTP GET
  getUserProfile() {
    this.loadCurrentToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.authToken,
    });
    // console.log(headers);
    return this.http.get( environment.HTTP_ENDPOINT + '/users/profile', {headers});
  }

  // PHASE ONE - 1 - OF RESSETING PASSWORD / USER SENDING OWN EMAIL
  sendMailToForgetful(user: any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post( environment.HTTP_ENDPOINT + '/users/missings/auth/forgotpwd', user, {headers});
  }

  // PHASE TWO - 2 - OF RESSETING PASSWORD / CHECK IF USER TOKEN IS VALID (IN TIME OR REQUEST TYPE)
  checkRequestToken(rsttoken: any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get( environment.HTTP_ENDPOINT + '/users/missings/auth/forgotpwd/' + rsttoken);
  }

  // PHASE THREE - 3 - OF RESSETING PASSWORD / RESET THE BLOODY THING!
  resetIt(newPwd: any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post( environment.HTTP_ENDPOINT + '/users/missings/auth/forgotpwd/reset', newPwd, {headers});
  }

  // CHANGE AVATAR IN PROFILE PAGE
  changeAvatar(avatar2change: any){
    const headers = new HttpHeaders({
      Authorization: this.authToken,
      'Content-Type': 'application/json'
    });
    return this.http.post( environment.HTTP_ENDPOINT + '/images/upload/av', avatar2change, {headers});
  }

  // TEST - COMMENT OUT!!!
  getUserProfileTest(): Observable<any>{
    this.loadCurrentToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.authToken
    });
    // console.log(headers);
    return this.http.get( environment.HTTP_ENDPOINT + '/users/profile', {headers})
    .pipe(
      shareReplay(1)
    );
  }

}
