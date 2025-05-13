import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor() { }
  private readonly _HttpClient = inject(HttpClient);
  postsNum:WritableSignal<number> = signal(0);

  createPost(body:object):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}posts`,body)
  }  
  getAllPosts():Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}posts`)
  }  
  getMyPosts():Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}users/664bcf3e33da217c4af21f00/posts`)
  }  
  getSinglePost(postId:string):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}posts/${postId}`)
  }  
  updatePost(postId:string,body:object):Observable<any>{
    return this._HttpClient.put(`${environment.baseUrl}posts/${postId}`,body)
  }  
  deletePost(postId:string):Observable<any>{
    return this._HttpClient.delete(`${environment.baseUrl}posts/${postId}`)
  }  
}
