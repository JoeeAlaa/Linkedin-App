import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor() { }
  private readonly _HttpClient = inject(HttpClient);
  private readonly _Router = inject(Router);
  userData:any = null;

  signUp(data:object):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}users/signup`,data)
  }
  signIn(data:object):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}users/signin`,data)
  }
  signOut():void{
    localStorage.removeItem('linkedInUserToken');
    this.userData = null;
    this._Router.navigate(['/login']);
  }
  saveUserData():void{
    if (localStorage.getItem('linkedInUserToken') !== null) {
      this.userData = jwtDecode(localStorage.getItem('linkedInUserToken')!);
      localStorage.setItem('linkedInUserId',this.userData.user);      
    }
  }
  changePassword(data:object):Observable<any>{
    return this._HttpClient.patch(`${environment.baseUrl}users/change-password`,data)
  }
  uploadProfilePhoto(data:object):Observable<any>{
    return this._HttpClient.put(`${environment.baseUrl}users/upload-photo`,data)
  }
  getUserData():Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}users/profile-data`)
  }
}
