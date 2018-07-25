import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

import {Single } from './single';
import {MessageService} from '../message/message.service';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


const httpOptions = {
  headers :new HttpHeaders({ "Content-Type":"application/json"})
}

@Injectable({
  providedIn: 'root'
})
export class SingleService {

  private serverUrl = "http://127.0.0.1:3000/api";
  private singleApi = "/songs";
  private Url = this.serverUrl+this.singleApi;
  constructor(private http: HttpClient, private messageService : MessageService) { }

/** GET singles from the server */
getSingles(): Observable<Single[]>{
  return this.http.get<Single[]>(this.Url)
  .pipe(
    tap(singles=>this.log(`fetched  Single`)),
    catchError(this.handleError('getSingle', []))
  );
}

      
//////// Save methods //////////||\\\\\\\\

/** POST: add a new single to the server */
addSingle(single: Single): Observable<Single> {
  return this.http.post<Single>(this.Url, single, httpOptions)
  .pipe(
    tap((single: Single) => this.log(`added Single w/ id=${single.id}`)),
    catchError(this.handleError<Single>('addsingle'))
  );
}

  /** GET hero by id. Will 404 if id not found */
  getSingle(id: string): Observable<Single> {
    const url = `${this.Url}/${id}`;
    return this.http.get<Single>(url).pipe(
      tap(_ => this.log(`fetched Single id=${id}`)),
      catchError(this.handleError<Single>(`getSIngle id=${id}`))
    );
  }
  

/** DELETE: delete the single from the server */
  deleteSingle (single: Single | number): Observable<Single> {
    const id = typeof single === 'number' ? single : single.id;
    const url = `${this.Url}/${id}`;

    return this.http.delete<Single>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted single id=${id}`)),
      catchError(this.handleError<Single>('deleteHero'))
    );
  }

    /** PUT: update the single on the server */
 updateSingle (single: Single): Observable<any> {
  return this.http.put(this.Url + "/" + single.id, single, httpOptions).pipe(
    tap(_ => this.log(`updated single id=${single.id}`)),
    catchError(this.handleError<any>('updateSingle'))
  );
}


/**
 * 
 * Single songs
 * 
 */
//Insert The Link
// const url = `${this.Url}/${id}/songs/${albumsongid}`;
 //Add Single Song
//  addSingleSong(SingleSong:SingleSong,id:string):Observable<SingleSong>{
//   const url = `${this.Url}/${id}/songs`;
//   return this.http.post<SingleSong>(url,SingleSong,httpOptions)
//   .pipe(
//     tap((SingleSong:SingleSong)=>this.log(`added SingleSong id=${SingleSong.id}`)),
//     catchError(this.handleError<SingleSong>('add SingleSong'))
//   )
// }
//Get SingleSong
// getSingleSong(id:string,singlesongid:string):Observable<SingleSong>{
//   const url = `${this.Url}/${id}/songs/${singlesongid}`;
//   return this.http.get<SingleSong>(url).pipe(
//     tap(_ => this.log(`fetched SingleSong id=${id}`)),
//     catchError(this.handleError<SingleSong>(`getSingleSong id=${id}`))
//   );
// }
 
 //Update Sing Song
//  updateSingleSong (singleSong: SingleSong,id:string): Observable<any> {
//    return this.http.put(this.Url + "/" + id + "/songs/" + singleSong.id, singleSong, httpOptions).pipe(
//     tap(_ => this.log(`updated singleSong id=${singleSong.id}`)),
//     catchError(this.handleError<any>('update singleSong'))
//   );
// }
 //Delete Sing Song
//  deleteSingleSong(singlesong:SingleSong | number,id:string):Observable<SingleSong>{
//   const singlesongid = typeof singlesong === 'number' ? singlesong:singlesong.id;
//   const url = `${this.Url}/${id}/songs/${singlesongid}`;
//   return this.http.delete<SingleSong>(url, httpOptions).pipe(
//     tap(_ => this.log(`deleted SingleSong id=${singlesongid}`)),
//     catchError(this.handleError<SingleSong>('deleteSingleSong'))
//   )
// }
 //List Single Song with Single Song

/**
 * Ends Here
 */

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
