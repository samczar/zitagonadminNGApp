import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

import {Genre } from './genre';
import {MessageService} from '../message/message.service';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


const httpOptions = {
  headers :new HttpHeaders({ "Content-Type":"application/json"})
}

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  private serverUrl = "http://127.0.0.1:3000/api";
  private genreApi = "/genres";
  private Url = this.serverUrl+this.genreApi;
  constructor(private http: HttpClient, private messageService : MessageService) { }

  /** GET genres from the server */
  getGenres(): Observable<Genre[]>{
    return this.http.get<Genre[]>(this.Url)
    .pipe(
      tap(genres=>this.log(`fetched  Genre`)),
      catchError(this.handleError('getGenre', []))
    );
  }

    //////// Save methods //////////

  /** POST: add a new genre to the server */
  addGenre(genre: Genre): Observable<Genre> {
    return this.http.post<Genre>(this.Url, genre, httpOptions)
    .pipe(
      tap((genre: Genre) => this.log(`added Genre w/ id=${genre.id}`)),
      catchError(this.handleError<Genre>('addgenre'))
    );
  }
     /** GET hero by id. Will 404 if id not found */
  getGenre(id: string): Observable<Genre> {
    const url = `${this.Url}/${id}`;
    return this.http.get<Genre>(url).pipe(
      tap(_ => this.log(`fetched Genre id=${id}`)),
      catchError(this.handleError<Genre>(`getGenre id=${id}`))
    );
  }     
    /** PUT: update the genre on the server */
    updateGenre (genre: Genre): Observable<any> {
      return this.http.put(this.Url + "/" + genre.id, genre, httpOptions).pipe(
        tap(_ => this.log(`updated genre id=${genre.id}`)),
        catchError(this.handleError<any>('updateGenre'))
      );
    }
    
  
  /** DELETE: delete the genre from the server */
    deleteGenre (genre: Genre | number): Observable<Genre> {
      const id = typeof genre === 'number' ? genre : genre.id;
      const url = `${this.Url}/${id}`;
  
      return this.http.delete<Genre>(url, httpOptions).pipe(
        tap(_ => this.log(`deleted genre id=${id}`)),
        catchError(this.handleError<Genre>('deleteHero'))
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
