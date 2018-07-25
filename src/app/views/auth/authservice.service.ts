import { Injectable } from '@angular/core';
import { User } from '../login/user';
import { isNullOrUndefined } from 'util';
import {AuthService} from '../../auth.service';




@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  //Url = "http://localhost:3000/api/Users/"+"/accessTokens"
  constructor(private authService:AuthService) { }


  setUser(user){
    let UserString = JSON.stringify(user);
    //localStorage.setItem("currentUser",UserString);
    //localStorage.setItem("currentUser",UserString);
    if (user && user.token) {
    localStorage.setItem('currentUser', UserString);
    }
  }

  getCurrentUser():User{
    let userString = localStorage.getItem("currentUser");
    if(!isNullOrUndefined(userString)){
      let user:User  = JSON.parse(userString);
      return user;
    }else{
      return  null;
    }
  }
  setToken(token:string){
    localStorage.setItem("accessToken", token);
  }
  getToken():string{
    return localStorage.getItem("accessToken");
  }
  logout(){
    this.authService.logout();
    localStorage.removeItem("currentUser");
    localStorage.removeItem("accessToken");
  }
}

