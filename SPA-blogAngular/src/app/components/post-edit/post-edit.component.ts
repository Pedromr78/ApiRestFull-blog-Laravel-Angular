import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { NgForm } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../Models/category';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from "src/app/Models/user";
import { Post } from "src/app/Models/post";
import { global } from 'src/app/services/global';


@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css'],
  providers: [UserService, CategoryService, PostService]
})
export class PostEditComponent implements OnInit {
  public page_title: string;
  public status?: any;
  public tocken: string;
  public identity: any;
  public user: User;
  public post: Post;
  public category: Category;
  public categories: any;
  public url=global.url;



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
      url: global.url+'post/upload',
     
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
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _categoryService: CategoryService,
    private _postService: PostService
  ) {
    this.page_title = "Editar Post"
    this.tocken = this._userService.getTocken();
    this.identity = this._userService.getIdentity();

  }



  ngOnInit(): void {
    this.getCategories();
    this.getPost();
    this.post = new Post(1, this.identity.sub, 1, "", "", "", null);
    
  }
  onSubmit(form: NgForm) {
  
   let postwithout=new Post(this.post.id, this.post.user_id, this.post.category_id, this.post.title, this.post.content, this.post.image, null);

    this._postService.update(this.tocken,postwithout,this.post.id).subscribe({
      next: (data:any) => {
       if(data.status=='succes'){
        this.status='succes';
        this._router.navigate(['/inicio']);
       }
     
      },
      error: (err) => {
       console.log(err);
       this.status='error';
      }
    }) 

  }
  getCategories(){
    this._categoryService.getCategories().subscribe(
      data=>{
 
        if(data.status=='succes'){
         
          this.categories=data.categories;
       
        }else{
          console.log('error')
        }
      }
    )
  }
  getPost(){

    this._route.params.subscribe(
      params=>{
        let id= params['id'];
        this._postService.getPost(id)
        .subscribe({
          next: (data) => {
          
            if(data.status=='succes'){
              this.post = data.post;
              this.user =  data.post.users;
              this.category = data.post.categories;

              if(this.user.email!=this.identity.email){
                this._router.navigate(['/inicio']);
              }
            }else{
              this._router.navigate(['/inicio']);
            }
         
       
          },
          error: (err) => {
            this._router.navigate(['/inicio']);
          }
        })
      }
    )
  }


  imageUpload(datos:any){
    console.log(datos);
    let data=datos.body;
    this.post.image=data.image;
  }

}
