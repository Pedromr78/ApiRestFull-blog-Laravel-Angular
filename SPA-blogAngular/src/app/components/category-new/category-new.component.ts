import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../Models/category';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-category-new',
  templateUrl: './category-new.component.html',
  styleUrls: ['./category-new.component.css'],
  providers: [UserService, CategoryService]
})
export class CategoryNewComponent implements OnInit {

  public page_title: string;
  public tocken: any;
  public identity: any;
  public category: Category;
  public status?: string;


  constructor(
    private _userService: UserService,
    private _categorySevice: CategoryService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.page_title = "Crear Categoria";
    this.identity = this._userService.getIdentity();
    this.tocken = this._userService.getTocken();
    this.category = new Category(1, '');
  }


  ngOnInit(): void {

  }


  onSubmit(form: NgForm) {
    this._categorySevice.create(this.tocken, this.category).subscribe(
      data => {
        if (data.status == 'succes') {
          this.status = 'succes';
          this.category = data.category;
          this._router.navigate(['/inicio']);

        } else {
          this.status = 'error';
        }
      }
    )
  }
  



}
