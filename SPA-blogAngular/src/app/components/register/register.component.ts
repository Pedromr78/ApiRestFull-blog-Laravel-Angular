import { Component,OnInit } from '@angular/core';
import { User } from '../../Models/user';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';



@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {
  public page_title:string;
  public user:User;
  public status?: string;



constructor(private _userService: UserService){
  this.page_title = 'Register';
  this.user = new User(1,'','','','','','');
  
}

ngOnInit() {


}
onSubmit(form: NgForm){
  
  this._userService.register(this.user).subscribe(
    data=>{
     
      this.status=data.status;
     
    if(this.status=='succes'){
     
      form.reset();
    }
    else{
      this.status='error'
    }
    
    },
  )
}
}
