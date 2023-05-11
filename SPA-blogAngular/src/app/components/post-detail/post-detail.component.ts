import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/Models/post';
import { Category } from 'src/app/Models/category';
import { User } from 'src/app/Models/user';
import { UserService } from 'src/app/services/user.service';
import { global } from 'src/app/services/global';
import { Router,ActivatedRoute,Params } from '@angular/router';


@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  providers: [UserService, PostService]
})
export class PostDetailComponent implements OnInit {

  public page_title: String;
  public post :Post;
  public category :Category;
  public user :User;
  public status?: any;
  public tocken: string;
  public identity: any;
  public url=global.url;


  constructor(
    private _postService : PostService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.page_title = 'Detalles del Post';
    this.tocken = this._userService.getTocken();
    this.identity = this._userService.getIdentity();

  }


  ngOnInit(): void {
    this.getPost();
  }

  getPost(){

    this._route.params.subscribe(
      params=>{
        let id= params['id'];
        this._postService.getPost(id)
        .subscribe({
          next: (data) => {
            this.post = data.post;
            this.user =  data.post.users;
            this.category = data.post.categories;
         
          },
          error: (err) => {
            this._router.navigate(['/inicio']);
          }
        })
      }
    )
  }
}
