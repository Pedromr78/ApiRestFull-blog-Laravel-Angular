import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../Models/category';
import { global } from './global';

@Injectable()
export class CategoryService {
    public url: string;
    public identity: any;
    public tocken: any;


    constructor(
        private _http: HttpClient
    ) {
        this.url = global.url;
    }

    create(token:string, category:Category): Observable<any>{
        let json = JSON.stringify(category);
        let params="json="+json;

        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', token);
                                      
        return this._http.post(this.url + 'category', params, { headers: headers });        
    }

    getCategories(): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.get(this.url + 'category', { headers: headers });  
    }
    getCategory(id:number): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.get(this.url + 'category/'+id, { headers: headers });  
    }
    getPost(id:number): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.get(this.url + 'post/category/'+id, { headers: headers });  
    }
}