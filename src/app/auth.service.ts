import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import {User} from "./views/login/user";
//import { Http } from "@angular/http";
import { Observable, of } from 'rxjs';
import {MessageService} from './views/message/message.service';
import {Auth} from './views/auth/auth';
import { catchError, map, tap } from 'rxjs/operators';


import {AuthserviceService} from './views/auth/authservice.service';

const httpOptions = {
  headers :new HttpHeaders({ "Content-Type":"application/json"})
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  headers = new Headers({
    "Content-Type":"application/json",
    });
 // tokenUrl = "http://localhost:3000/api/Users/"+"/accessTokens"
  serverUrl = "http://127.0.0.1:3000/api";
  private userApi = "/Users/login";
  private Url = this.serverUrl+this.userApi;
  constructor(private http: HttpClient, private messageService:MessageService) { }  
  // getUserDetails(email,password){
  //   //post these details  to API server and return user info if correct
  // }
token(id:string):Observable<Auth>{
  const authUrl = `${this.Url}/Users/${id}/accessTokens`
  return this.http.get<Auth>(authUrl).pipe(
    tap(_ => this.log(`fetched auth id=${id}`)),
    catchError(this.handleError<Auth>(`authId id=${id}`))
  );
}


  login(user:User):Observable<User>{
    
    // let url = this.serverUrl+"/Users/login"; 
    // return this.http.post(url, {email ,  password}).subscribe(data=>{
    //   console.log(data, "is wgta we got from the server");
    return this.http.post<User>(this.Url, {
      email :   user.email,
      password: user.password
      },httpOptions).pipe(
      
        tap((user:User,)=>this.log(`added Single w/ id=${user.id}`)),

      
      catchError(this.handleError<User>('addsingle'))
    )  
  }




 logout(){
  localStorage.removeItem('currentUser'); 
   return this.http.post<any>(this.serverUrl+'/Users/logout',this.headers).subscribe(data=>{

    
   })
 }


    /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
    /** Log a singleService message with the MessageService */
    private log(message: string) {
      this.messageService.add('HeroService: ' + message);
    }
}



