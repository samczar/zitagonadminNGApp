import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {MessageService} from '../message/message.service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';



const httpOptions = {
    headers :new HttpHeaders({ "Content-Type":"application/json","Authorization":""})
  }

  @Injectable({
    providedIn: 'root'
  })
  

  export class CountryService {
 
    private serverUrl = "http://restcountries.eu/rest/v2/region";
    private genreApi = "/africa";
    private Url = this.serverUrl+this.genreApi;
    constructor(private http: HttpClient, private messageService : MessageService) { }
  

  /** GET genres from the server */
  getCountry(): Observable<any[]>{
    return this.http.get<any[]>(this.Url,httpOptions)
    .pipe(
      tap(data=>this.log(`fetched  Country`)),
      catchError(this.handleError('getCountry', []))
    );
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
      /** Log a genreService message with the MessageService */
      private log(message: string) {
        this.messageService.add('HeroService: ' + message);
      }



  }