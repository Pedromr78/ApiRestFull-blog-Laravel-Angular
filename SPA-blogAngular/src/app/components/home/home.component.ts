import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/Models/post'
import { UserService } from 'src/app/services/user.service';
import { global } from 'src/app/services/global';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [UserService, PostService]
})
export class HomeComponent implements OnInit,OnDestroy {
  public page_title: String;
  public post :Post;
  public status?: any;
  public tocken: string;
  public identity: any;
  public posts:Array<Post>;
  public url=global.url;


  public response: any;


  constructor(
    private _postService : PostService,
    private _userService: UserService
  ) {
    this.page_title = 'Inicio';
    this.tocken = this._userService.getTocken();
    this.identity = this._userService.getIdentity();
    this.post = new Post(1,1, 1, "", "", "", null);
  }

ngOnInit(){
  this.getPosts();
}

ngOnDestroy(){
  this.getPosts();
}

  getPosts(){
    
    this._postService.getPosts().subscribe(
      data=>{
       
        if(data.status=='succes'){
         
          this.posts=data.posts;
        
        }else{
          console.log('error')
        }
      }
    )


  }


  deletePost(id:number){
    this._postService.delete(this.tocken,id).subscribe({
      next: (data:any) => {
        console.log(data);
        this.getPosts();
       if(data.status=='succes'){
        this.status='succes';
       }
     
      },
      error: (err) => {
       console.log(err);
       this.status='error';
      }
    }) 
  }


}
