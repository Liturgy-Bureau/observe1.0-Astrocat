import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UxmessagesService } from '../../services/uxmessages.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-forgotpwd',
  templateUrl: './forgotpwd.component.html',
  styleUrls: ['./forgotpwd.component.less']
})
export class ForgotpwdComponent implements OnInit {

  forgotpwdForm: any; // the forgotpwd form

  constructor(
    private formBuilder: FormBuilder,
    private notifier: UxmessagesService,
    private auth: AuthService,
    private router: Router
  ) {
    this.forgotpwdForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // form value
    });
   }

    // get the values from the form fields to validate
  get email() {return this.forgotpwdForm.get('email'); }

  ngOnInit(): void {
  }

  issueLink(formValue: any){
    const user2sendmail = {
      email: formValue.email.trim()
    };
    this.auth.sendMailToForgetful(user2sendmail).subscribe((responseData: any) => {
      if (responseData.success){
        this.router.navigate(['/']); // sfter successful request navigate to home page
        this.notifier.uxSuccess(responseData.msg, 'nice catch!', 6000);
      } else {
        this.notifier.uxFalse(responseData.msg, 'nice try, but this email does not exist!', 6000);
      }
    });

    // console.log(formValue);  // { name: '', pass: '' }
  }

}
