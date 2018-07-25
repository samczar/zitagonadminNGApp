import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';

import {Song } from './songs';
import {MessageService} from '../message/message.service';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


const httpOptions = {
  headers :new HttpHeaders({ "Content-Type":"application/json"})
}

@Injectable({
  providedIn: 'root'
})
export class SongsService {
  
  private serverUrl = "http://127.0.0.1:3000/api";
  private songApi = "/songs";
  private Url = this.serverUrl+this.songApi;
  constructor(private http: HttpClient, private messageService : MessageService) { }
/** GET songs from the server */
getSongs(): Observable<Song[]>{
  return this.http.get<Song[]>(this.Url)
  .pipe(
    tap(songs=>this.log(`fetched  Song`)),
    catchError(this.handleError('getSong', []))
  );
}

      
//////// Save methods //////////


  /** GET song by id. Will 404 if id not found */
  getSong(id: string): Observable<Song> {
    const url = `${this.Url}/${id}`;
    return this.http.get<Song>(url).pipe(
      tap(_ => this.log(`fetched song id=${id}`)),
      catchError(this.handleError<Song>(`getSong id=${id}`))
    );
  }




/** POST: add a new song to the server */
addSong(song: Song): Observable<Song> {
  return this.http.post<Song>(this.Url, song, httpOptions)
  .pipe(
    tap((song: Song) => this.log(`added Song w/ id=${song.id}`)),
    catchError(this.handleError<Song>('addsong'))
  );
}
  

/** DELETE: delete the song from the server */
  deleteSong (song: Song | number): Observable<Song> {
    const id = typeof song === 'number' ? song : song.id;
    const url = `${this.Url}/${id}`;

    return this.http.delete<Song>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted song id=${id}`)),
      catchError(this.handleError<Song>('deleteSong'))
    );
  }

    /** PUT: update the song on the server */
 updateSong (song: Song): Observable<any> {
  return this.http.put(this.Url, song.id, httpOptions).pipe(
    tap(_ => this.log(`updated song id=${song.id}`)),
    catchError(this.handleError<any>('updateSong'))
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
    /** Log a songService message with the MessageService */
    private log(message: string) {
      this.messageService.add('SongService: ' + message);
    }

 
 
  //  //get number of songs
  //  getSongs(){
  //   return this.http.get(this.url+"/songs/count"); 
  //  }
  
  //   //count songs
  //   getVideos(){
  //     return this.http.get(this.url+"/songs/count");
  //   }
    //count videos

   //get names of songs

   //post songs and videos




}
