import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import { UserService} from './user.service';



@Injectable()
export class IdentityGuard {

    constructor(
        private _router: Router,
        private _userService: UserService
        ){

        }

      

    canActivate(){
        let identity= this._userService.getIdentity();
        if(identity){
            return true;
        }
            this._router.navigate(['/error']);
            return false;
        
    }
    
}   