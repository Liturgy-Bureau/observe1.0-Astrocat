import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {  RxwebValidators } from '@rxweb/reactive-form-validators';
import { Router } from '@angular/router';

// import { ValidatorService } from '../../services/validator.service' // this is custom
import { UxmessagesService } from '../../services/uxmessages.service';
import { AuthService } from '../../services/auth.service';
import { getNumberOfCurrencyDigits } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

  registerForm: any; // the register form

  checked: any;

  intNumber: any;

  country: any;


  constructor(
    private formBuilder: FormBuilder,
    private notifier: UxmessagesService,
    private auth: AuthService,
    private router: Router
    // private validate: ValidatorService
  ) {
    // create the form with fields - build it
    this.registerForm = this.formBuilder.group({
      fullname: ['', [Validators.required, Validators.pattern('^([a-zA-Z]{2,}\\s[a-zA-Z]{1,}\'?-?[a-zA-Z]{2,}\\s?([a-zA-Z]{1,})?)')]], // form value
      email: ['', [Validators.required, Validators.email]], // form value
      password: ['', [Validators.required, Validators.minLength(6)]], // form value
      confirmpwd: ['', [Validators.required, RxwebValidators.compare({fieldName: 'password'})]], // form value
      phone: ['', Validators.pattern('^[0-9 ]+$')] // form value
    });
  }

  ngOnInit(): void {

  }

  // check country change
  onCountryChange(event: any) {
    this.intNumber = event.dialCode;
    this.country = event.name;
    // console.log(this.intNumber);
    // console.log(this.country);
  }

  // initialize the country code to Hellas
  telInputObject(object: any) {
    object.setCountry('gr');
  }

  // get the values from the form fields to validate them while typing
  get fullname() {return this.registerForm.get('fullname'); }
  get email() {return this.registerForm.get('email'); }
  get password() {return this.registerForm.get('password'); }
  get confirmpwd() {return this.registerForm.get('confirmpwd'); }
  get phone() {return this.registerForm.get('phone'); }

  // toggle the 'read the terms' tick on and off to check for form validity
  toggleEditable(event: any) {
    if ( event.target.checked ) {
        this.checked = true;
        return true;
   } else {
     this.checked = false;
     return false;
   }
}

  inscribeRegistration(formValue: any){
    // build the registration object to send - we do not need 'confirm password' field
    const user2register = {
      fullname: formValue.fullname.trim(),
      email: formValue.email.trim(),
      password: formValue.password.trim(),
      phone: '+' + this.intNumber + ' ' + formValue.phone.trim(),
      country: this.country.trim()
    };
  // console.log(user2register.phone);
    // call the http post function to register finally
    this.auth.registerNewUser(user2register).subscribe((responseData: any) => {
      if (responseData.success){
        this.notifier.uxSuccess(responseData.msg, 'notification', 6000);
        this.router.navigate(['/login']); // sfter successful registration navigate to login page
        // console.log(responseData);
      } else {
        this.notifier.uxFalse(responseData.msg, 'notification', 6000);
        this.router.navigate(['/register']);
        // console.log(responseData);
      }
    });

  }
}
