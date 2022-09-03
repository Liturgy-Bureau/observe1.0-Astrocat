import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewshelperService {

  constructor() { }

  shouldMainContainerExpand: Subject<boolean> = new Subject<boolean>();

  // GLOBAL SUBJECT VARIABLES - NEEDED IN ALL COMPONENTS EX. THE USER FULLNAME, EMAIL ETC.

  globalUsername: BehaviorSubject<any> = new BehaviorSubject<string>('traveller'); // the current user username to display

  globalAvatar: BehaviorSubject<any> = new BehaviorSubject<string>('../../../assets/pictures/guest-avatar.png'); // the current user avatar - globally

  globarRole: any;
}
