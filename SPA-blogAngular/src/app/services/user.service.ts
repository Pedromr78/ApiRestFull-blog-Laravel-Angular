import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Models/user';
import { global } from './global';

@Injectable()
export class UserService {
    public url: string;
    public identity: any;
    public tocken: any;


    constructor(
        public _http: HttpClient
    ) {
        this.url = global.url;
    }

    update(token:string, user:any): Observable<any>{
         //Limpiamos el campo por corrupcion de html entities
         user.description = global.htmlEntities(user.description);
        let json = JSON.stringify(user);
        let params="json="+json;

        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', token);
                                      
        return this._http.put(this.url + 'update', params, { headers: headers });        
    }

    register(user: User): Observable<any> {
        
        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'register', params, { headers: headers });
    }

    signup(user: User, gettoken = false): Observable<any> {

        if (gettoken == true) {
            user.gettoken = true;
        }

        let json = JSON.stringify(user);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'login', params, { headers: headers });
    }
    checkIdentity(){
        if(this.getIdentity()){
            return true;
        }else{
            return false;   
        }
    }

    getIdentity() {
        let json= localStorage.getItem('identity')
        //Hay que comprobar que sea true por que no aceota posibles nulls
        let identity = json != null ? JSON.parse(json) : null;

        if (identity && identity != null) {
            
            this.identity = identity;
        } else {
            this.identity = null;
        }

        return this.identity;
    }
    getTocken() {
        let tocken = localStorage.getItem('tocken');
        if (!tocken && tocken == 'undefined') {
           
            this.tocken = null;
        } else {
            this.tocken = tocken;
        }
        return this.tocken;
    }

    getPost(id:number): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.get(this.url + 'post/user/'+id, { headers: headers });  
    }
    getUser(id:number): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.get(this.url + 'detail/'+id, { headers: headers });  
    }
}