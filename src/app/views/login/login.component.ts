import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {User} from '../login/user';
import {AuthService} from '../../auth.service';
import { Observable } from 'rxjs';
import { AuthserviceService } from '../auth/authservice.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  providers:[AuthService]
})
export class LoginComponent implements OnInit{ 
  
  public user: User;
  returnUrl: string;

  constructor(private Auths:AuthService, 
    private routeState:ActivatedRoute,
    private authservice:AuthserviceService, 
    private router:Router){
    this.user = new User();
  }

  // onSubmit(f: NgForm) {
  //   // console.log(f.value);  // { first: '', last: '' }
  //   // console.log(f.valid);  // false
  //   // console.log(f.target);
  //   console.log('login');
  // }
 ngOnInit(){

          // get return url from route parameters or default to '/'
       // this.returnUrl = this.routeState.snapshot.queryParams['returnUrl'] || '/';
 }

   onLogin(f: NgForm){
     let user = this.user;
     if (this.user.email && this.user.password ){
       this.Auths.login(this.user).subscribe(result=>{
         console.log('result is ', result);
         //store token in localstorage
         //localStorage.setItem("accessToken", result.id);
         localStorage.setItem('currentUser', JSON.stringify({token:result.id,id:result.userId}));
        //  localStorage.setItem('accessToken', JSON.stringify(result.id));
         //store user in storage
        //  localStorage.setItem('currentUser', result.userId);
        
       
         this.returnUrl = this.routeState.snapshot.queryParams['returnUrl'] || '/dashboard/dashboard';
        
       
            //now redirect to dasboard
       this.router.navigate([this.returnUrl]);
      // this.router.navigate(['/']); 
         
       },
      err=>{
          console.log(err);
      })

     }
     else{
       alert('Enter Email and Password');
     }
    //  this.Auths.login(user.email,user.password);
     //event.preventDefault();
     //const target  = event.target;
     //const email = target.querySelector('#email').value;
     //const password = target.querySelector('#password').value;
     //console.log(`${email} & ${password}`);
    // console.log('Login tapped', this.user);
     localStorage.setItem('userEmail', JSON.stringify({email:this.user.email}));
   }

   logOff(){
    this.authservice.logout();
    this.router.navigate(['/login']);
   }

 
}
