import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { UxmessagesService } from '../../services/uxmessages.service';
import { AuthService } from '../../services/auth.service';
import { ModalService } from 'src/app/services/modal.service';
import { Subscription } from 'rxjs';

import { ViewshelperService } from '../../services/viewshelper.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit, OnDestroy {

  currentUserProfile: any;

  avatar: any;

  changeAvatarForm: any;


  constructor(
    private formBuilder: FormBuilder,
    private notifier: UxmessagesService,
    private auth: AuthService,
    private router: Router,
    private viewsHelper: ViewshelperService,
    private sockets: SocketioService,
    private modalService: ModalService
  ) {
    // create the form with fields - build it
    this.changeAvatarForm = this.formBuilder.group({
      email: [''],
      avatar: ['']
    });

   }

  // For opening modals on the fly
  @ViewChild('modal', { read: ViewContainerRef })
  entry!: ViewContainerRef;
  modalsub!: Subscription;

  ngOnInit(): void {
    this.displayAvatar();
    this.auth.getUserProfile().subscribe((userProfileData: any) => {
      this.currentUserProfile = userProfileData.user;
      this.viewsHelper.globarRole = this.currentUserProfile.userstatistics.role;
    },
    err => {
      console.log('unauthorized', err);
      return false;
    });
  }

  ngOnDestroy(): void {
    if (this.modalsub) { this.modalsub.unsubscribe(); }
  }

  // Get the rank of user ex. moderator/member etc.
  getRank() {
    let result = '';
    switch (this.currentUserProfile.userstatistics.role) {
      case 'member':
        result = 'Member';
        break;
      case 'moderator':
        result = 'Moderator';
        break;
      case 'admin':
        result = 'Admin';
        break;
    }
    return result;
  }

  // Get the billing status of user
  getBillingStatus() {
    let result = '';
    switch (this.currentUserProfile.userstatistics.billingstatus) {
      case 'excellent':
        result = 'Excellent';
        break;
      case 'warnings':
        result = 'Warnings';
        break;
      case 'critical':
        result = 'Critical';
        break;
    }
    return result;
  }

  // Get the objects status of user
  getObjectsStatus() {
    if (this.currentUserProfile.userstatistics.objectsstatus === 'excellent'){
      return 'Excellent';
    } else {
      if (this.currentUserProfile.userstatistics.objectsstatus === 'warnings') {
        return 'Warnings';
      } else {
        return 'Critical';
      }
    }
  }


  // CHANGE THE AVATAR TO INCOGNITO IF USER HAS NOT AN AVATAR SET
  displayAvatar(){
    this.avatar = localStorage.getItem('avatar');
  }

  // SELECT A FILE AS AVATAR WHEN EDIT OR IMAGE IS CLICKED
  onFileSelected(event: any) {

    const file = event.target.files[0];
    if (event.target.files[0].size < 46080) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
      const formData = {email: this.currentUserProfile.email,
        avatar: reader.result};
      this.auth.changeAvatar(formData).subscribe((responseData: any) => {
        if (responseData.success){
          this.notifier.uxSuccess(responseData.msg, 'notification', 6000);
          localStorage.setItem('avatar', responseData.avatar);
          this.avatar = responseData.avatar;
          this.viewsHelper.globalAvatar.next(localStorage.getItem('avatar'));
        } else {
          this.notifier.uxFalse(responseData.msg, 'notification', 6000);
        }
      });
      };
    } else {
      this.notifier.uxFalse('Image file too large, please select a file up to 45KB', 'notification', 6000);
    }
  }

  createModal() {
    this.modalsub = this.modalService
      .openModal(this.entry, 'please confirm',
                             '<div>' +
                             '<p>you are about to delete your account!<br>' +
                             'this is an action that cannot be undone!<br>' +
                             'are you sure for that?</p>' +
                             '</div>')
      .subscribe((v) => {
        if (v === 'confirm') {
          console.log('has confirmed');
        }
        // your logic
      });
  }

}
