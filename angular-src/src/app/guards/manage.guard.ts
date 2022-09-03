import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UxmessagesService } from '../services/uxmessages.service';
import { ViewshelperService } from '../services/viewshelper.service';

@Injectable()
export class ManageGuard implements CanActivate {

    constructor(private auth: AuthService,
                private router: Router,
                private notifier: UxmessagesService,
                private viewsHelper: ViewshelperService) {}

    canActivate(){
        if (this.viewsHelper.globarRole === 'admin' || this.viewsHelper.globarRole === 'moderator') {
            return true;
        } else {
            this.notifier.uxFalse('this area is kept for administrators only! Sorry.', 'ooops!', 6000);
            this.router.navigate(['/dashboard']);
            return false;
        }
    }

}
