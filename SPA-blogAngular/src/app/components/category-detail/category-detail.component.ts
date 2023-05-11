import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Category } from '../../Models/category';
import { global } from '../../services/global';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css'],
  providers: [UserService, CategoryService, PostService]
})
export class CategoryDetailComponent implements OnInit {
  public page_title: string;
  public category: Category;
  public url: any;
  public posts: any;
  public tocken: string;
  public identity: any;
  public status?: any;


  constructor(
    private _categoryService: CategoryService,
    private _userService: UserService,
    private _postService : PostService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.url = global.url;
    this.tocken = this._userService.getTocken();
    this.identity = this._userService.getIdentity();
  }


  ngOnInit() {
    this.getCategoryByPost();
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

  getCategoryByPost() {
    this._route.params.subscribe(
      params => {
        let id = params['id'];
        this._categoryService.getCategory(id).subscribe({
          next: (data) => {
            if (data.status == 'succes') {
              this.category = data.category;

              this._categoryService.getPost(id).subscribe({
                next: (data) => {
                 
                  if (data.status == 'success') {
                    this.posts = data.posts;
                  
                  }

                }, error: (err) => {
                  console.log(err);
                }

              })
            }
          },
          error: (err) => {
            console.log(err);
          }


        })
      }
    )
  }
}
