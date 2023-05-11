import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/Models/post'
import { User } from 'src/app/Models/user'
import { UserService } from 'src/app/services/user.service';
import { global } from 'src/app/services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, PostService]
})
export class ProfileComponent implements OnInit {


  public page_title: String;
  public post: Post;
  public status?: any;
  public tocken: string;
  public identity: any;
  public posts: Array<Post>;
  public url = global.url;
public user:User;

  public response: any;


  constructor(
    private _postService: PostService,
    private _userService: UserService,    
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.page_title = 'Perfil de Usuario';
    this.tocken = this._userService.getTocken();
    this.identity = this._userService.getIdentity();
    this.post = new Post(1, 1, 1, "", "", "", null);
  }


  ngOnInit() {
   this.getProfile();
  }
  getProfile(){
    this._route.params.subscribe(
      data=>{
        let userId=+data['id'];
        this.getPosts(userId);
        this.getUser(userId);
      }
    )
  }
  getUser(userId:any){
    this._userService.getUser(userId).subscribe({
      next: (data: any) => {
        if (data.status == 'success') {
          console.log(data)
          this.user = data.user;
          
        } else {
          console.log('error')
        }
      },
      error: (err) => {
        console.log(err);
        this.status = 'error';
      }}

    )
  }

  getPosts(id:any) {
    
    this._userService.getPost(id).subscribe({
      next: (data: any) => {
        if (data.status == 'success') {

          this.posts = data.posts;
       
        } else {
          console.log('error')
        }
      },
      error: (err) => {
        console.log(err);
        this.status = 'error';
      }}
    )


  }


  deletePost(id: number) {
    this._postService.delete(this.tocken, id).subscribe({
      next: (data: any) => {
        this.getProfile();
        if (data.status == 'succes') {
          this.status = 'succes';
        }

      },
      error: (err) => {
        console.log(err);
        this.status = 'error';
      }
    })
  }


}
