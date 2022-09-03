import { Injectable } from '@angular/core';
import { Router, CanActivate, CanDeactivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UxmessagesService } from '../services/uxmessages.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService,
                private router: Router,
                private notifier: UxmessagesService) {}

    canActivate(){
        if (this.auth.isLoggedIn()) {
            return true;
        } else {
            this.router.navigate(['/login']);
            this.notifier.uxWarn('whoah there astro-traveller! You should log in first to access this domain!', 'caution', 6000);
            return false;
        }
    }


}

