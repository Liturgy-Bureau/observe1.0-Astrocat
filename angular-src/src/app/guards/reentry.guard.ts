import { Injectable } from '@angular/core';
import { Router, CanActivate, CanDeactivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UxmessagesService } from '../services/uxmessages.service';

@Injectable()
export class ReentryGuard implements CanActivate {

    constructor(private auth: AuthService,
                private router: Router,
                private notifier: UxmessagesService) {}

    canActivate(){
        if (!this.auth.isLoggedIn()) {
            return true;
        } else {
            this.notifier.uxWarn('you are already registered and logged in!', 'caution', 6000);
            this.router.navigate(['/dashboard']);
            return false;
        }
    }


}
