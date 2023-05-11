import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../Models/post';
import { global } from './global';
import { UserService } from 'src/app/services/user.service';

@Injectable()
export class PostService {
    public url: string;
    public identity: any;
    public tocken: any;


    constructor(
        private _http: HttpClient,
        private _userService: UserService,
    ) {
        this.url = global.url;
        this.tocken = this._userService.getTocken();
        this.identity = this._userService.getIdentity();

    }

    create(token: string, post: Post): Observable<any> {
        //Limpiamos el campo por corrupcion de html entities
        post.content = global.htmlEntities(post.content);
        let json = JSON.stringify(post);
        let params = "json=" + json;

        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', token);

        return this._http.post(this.url + 'posts', params, { headers: headers });
    }



    getPosts(): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.get(this.url + 'posts', { headers: headers });
    }
    getPost(id: number): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.get(this.url + 'posts/' + id, { headers: headers });
    }


    update(tocken: string, post: Post, id: number) {
        //Limpiamos el campo por corrupcion de html entities
        post.content = global.htmlEntities(post.content);
        let json = JSON.stringify(post);
        let params = "json=" + json;

        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', tocken);

        return this._http.put(this.url + 'posts/' + id, params, { headers: headers });
    }
    delete(tocken: string, id: number) {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', tocken);
        return this._http.delete(this.url + 'posts/' + id, { headers: headers });
    }
}