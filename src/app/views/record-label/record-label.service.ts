import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

import {RecordLabel } from './record-label';
import {MessageService} from '../message/message.service';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


const httpOptions = {
  headers :new HttpHeaders({ "Content-Type":"application/json"})
}

@Injectable({
  providedIn: 'root'
})
export class RecordLabelService {

  private serverUrl = "http://127.0.0.1:3000/api";
  private recordLabelApi = "/recordLabels";
  private Url = this.serverUrl+this.recordLabelApi;
  constructor(private http: HttpClient, private messageService : MessageService) { }

/** GET recordLabels from the server */
getRecordLabels(): Observable<RecordLabel[]>{
  return this.http.get<RecordLabel[]>(this.Url)
  .pipe(
    tap(recordLabels=>this.log(`fetched  RecordLabel`)),
    catchError(this.handleError('getRecordLabel', []))
  );
}

      
//////// Save methods //////////

/** POST: add a new recordLabel to the server */
addRecordLabel(recordLabel: RecordLabel): Observable<RecordLabel> {
  return this.http.post<RecordLabel>(this.Url, recordLabel, httpOptions)
  .pipe(
    tap((recordLabel: RecordLabel) => this.log(`added RecordLabel w/ id=${recordLabel.id}`)),
    catchError(this.handleError<RecordLabel>('addrecordLabel'))
  );
}

getRecordLabel(id:string):Observable<RecordLabel>{
  const url = `${this.Url}/${id}`;
  return this.http.get<RecordLabel>(url).pipe(
    tap(_=>this.log(`fetched recordLabel id=${id}`)),
    catchError(this.handleError<RecordLabel>(`getRecordLabel id=${id}`))
  )
}
  

/** DELETE: delete the recordLabel from the server */
  deleteRecordLabel (recordLabel: RecordLabel | number): Observable<RecordLabel> {
    const id = typeof recordLabel === 'number' ? recordLabel : recordLabel.id;
    const url = `${this.Url}/${id}`;

    return this.http.delete<RecordLabel>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted recordLabel id=${id}`)),
      catchError(this.handleError<RecordLabel>('deleteHero'))
    );
  }

    /** PUT: update the recordLabel on the server */
 updateRecordLabel (recordLabel: RecordLabel): Observable<any> {
  return this.http.put(this.Url + "/" + recordLabel.id, recordLabel, httpOptions).pipe(
    tap(_ => this.log(`updated recordLabel id=${recordLabel.id}`)),
    catchError(this.handleError<any>('updateRecordLabel'))
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
    /** Log a recordLabelService message with the MessageService */
    private log(message: string) {
      this.messageService.add('HeroService: ' + message);
    }



}
