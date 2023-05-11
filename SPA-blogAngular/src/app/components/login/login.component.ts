import { Component, OnInit } from '@angular/core';
import { User } from '../../Models/user';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public page_title: string;
  public user: User;
  public status: string;
  public tocken: any;
  public identity: any;

  constructor(
    private _userService: UserService, 
    private _router:Router, 
    private _route:ActivatedRoute) {
    this.page_title = 'Identificate';
    this.user = new User(1, '', '', '', '', '', '');
  }
  ngOnInit() {
    //Se ejecuta siempre, pero hasta que no le demos al boton no se envia 1 y por lo tanto
    //no se borran los datos del usuario, etc...
    this.logout();
  }
  onSubmit(form: NgForm) {
    //aqui sacamos solo el token
    this._userService.signup(this.user).subscribe(
      data => {
        //comprobamos que el status que devuelve el servidor sea succes
        if (data.status == 'error') {
          this.status = 'error';
        }
        else {
          this.status = 'succes';
          this.tocken = data;
          //esto se hace para que me devuelva el usuario con todos los datos
          this._userService.signup(this.user, true).subscribe(
            identity => {
              //se guardan los datos del usuario
              this.identity = identity;
              //mostramos tanto el token como el objeto con los datos del usuario
              console.log(this.identity);
              //PERSISTO LOS DATOS
              //Para guardarlolos datos en  en el storage para poder llevarme los datos a otras url como posts
              localStorage.setItem('tocken', this.tocken);
              //Local storage solo puede tener string o numerico
              localStorage.setItem('identity', JSON.stringify(this.identity));

              form.reset();
              this._router.navigate(['inicio']);
            },
          )

        }

      },
    )
  }
  logout(){
    this._route.params.subscribe(
      params => {
        let logout= params['sure'];
        if(logout==1){
          
          //Se borra de el locl Storage
          localStorage.removeItem('identity');
          localStorage.removeItem('tocken');
          //Spone en null para que no de problemas
          this.identity= null;
          this.tocken= null;
          //Nos manda a la ruta de inicio
          this._router.navigate(['inicio']);
        }
    })
  }


}
