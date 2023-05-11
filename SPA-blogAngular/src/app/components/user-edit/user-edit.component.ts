import { Component, OnInit } from '@angular/core';
import { User } from '../../Models/user';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { global } from '../../services/global';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService],
 
})

export class UserEditComponent implements OnInit {
  public page_title: string;
  public status?: string;
  public user: User;
  public tocken: string;
  public identity: any;
  public url:string;


  public froala_option: Object = {
    charCounterCount: true,
    languaje:'es',
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat'],
  };

  afuConfig = {
      multiple: false,
      formatsAllowed: ".jpg,.png",
      maxSize: 1,
      uploadAPI:  {
        url: global.url+'upload',
       
        headers: {
       "Authorization" : this._userService.getTocken()
        }
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: true,
    replaceTexts: {
      selectFileBtn: 'Select Files',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      dragNDropBox: 'Drag N Drop',
      attachPinBtn: 'Sube tu avatar',
      afterUploadMsg_success: 'Successfully Uploaded !',
      afterUploadMsg_error: 'Upload Failed !',
      sizeLimit: 'Size Limit'
    }
  
};

  

  constructor(
    private _userService: UserService
  ) {
    this.page_title = "Settings"
    this.identity = _userService.getIdentity();
    this.tocken = _userService.getTocken();
    this.user = new User(this.identity.sub, this.identity.name, this.identity.surname, this.identity.email, '', this.identity.description, this.identity.image);
    this.url=global.url;
  }


  ngOnInit() :void{

  }



  onSubmit(form: NgForm) {
  
    
    this._userService.update(this.tocken, this.user).subscribe(
      data => {
       
        if (data.status=='success') {
         this.status='succes';
          
         if(data.changes.name){
          this.user.name=data.changes.name;
         }
         if(data.changes.surname){
          this.user.surname=data.changes.surname;
         }
         if(data.changes.email){
          this.user.email=data.changes.email;
         }
         if(data.changes.description){
          this.user.description=data.changes.description;
         }
         if(data.changes.image){
          this.user.image=data.changes.image;
         }
       
         this.identity=this.user;
         localStorage.setItem('identity', JSON.stringify(this.identity));

        }else{
          this.status='error';
        }
      }
    )
  }

  avatarUpload(datos:any){
  let data=datos.body;
    this.user.image=data.image;
   
  }


}
