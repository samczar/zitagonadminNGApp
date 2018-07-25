import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

import {Artist} from './artist';
import {MessageService} from '../message/message.service';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


const httpOptions = {
  headers :new HttpHeaders({ "Content-Type":"application/json"})
}

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

 private serverUrl = "http://127.0.0.1:3000/api";
 private artistApi = "/artists";
 private artistUrl = this.serverUrl+this.artistApi;
 constructor(private http: HttpClient, private messageService: MessageService) { }
  
  /** GET artists from the server */
  getArtists(): Observable<Artist[]>{
    return this.http.get<Artist[]>(this.artistUrl)
    .pipe(
      tap(artists=>this.log(`fetched  Artist`)),
      catchError(this.handleError('getArtist', []))
    );
  }

  getArtist(id:string):Observable<Artist>{
    const url = `${this.artistUrl}/${id}`;
    return this.http.get<Artist>(url).pipe(
      tap(_=>this.log(`fetched artist id=${id}`)),
      catchError(this.handleError<Artist>(`getArtist id=${id}`))
    );
  } 

    //////// Save methods //////////

  /** POST: add a new artist to the server */
  addArtist (artist: Artist): Observable<Artist> {
    return this.http.post<Artist>(this.artistUrl, artist, httpOptions)
    .pipe(
      tap((artist: Artist) => this.log(`added Artist w/ id=${artist.id}`)),
      catchError(this.handleError<Artist>('addArtist'))
    );
  }
 
   
    /** DELETE: delete the artist from the server */
    deleteArtist (artist: Artist | number): Observable<Artist> {
      const id = typeof artist === 'number' ? artist : artist.id;
      const url = `${this.artistUrl}/${id}`;
  
      return this.http.delete<Artist>(url, httpOptions).pipe(
        tap(_ => this.log(`deleted artist id=${id}`)),
        catchError(this.handleError<Artist>('deleteHero'))
      );
    }

  /** PUT: update the Artist on the server */
   updateArtist (artist: Artist): Observable<any> {
    return this.http.put(this.artistUrl + "/" + artist.id, artist, httpOptions).pipe(
      tap(_ => this.log(`updated artist id=${artist.id}`)),
      catchError(this.handleError<any>('updateArtist'))
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
      /** Log a ArtistService message with the MessageService */
      private log(message: string) {
        this.messageService.add('HeroService: ' + message);
      }


   
    

}
