import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

import {Album } from './album';
import { AlbumSong} from './album-detail/album-song';
import {MessageService} from '../message/message.service';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


// const httpOptions = {
//  // headers :new HttpHeaders({ "Content-Type":"application/json"}),
//   headers : new HttpHeaders({"Authorization":localStorage.getItem('currentUser')})
// }
let currentUser = localStorage.getItem('currentUser');
const httpOptions = {
headers: new HttpHeaders({
  'Content-Type':  'application/json',
  // 'Authorization': currentUser
})
}
@Injectable({
  providedIn: 'root'
})
export class AlbumService {


 
  private serverUrl = "http://127.0.0.1:3000/api";
  private albumApi = "/albums";
  private Url = this.serverUrl+this.albumApi;
  constructor(private http: HttpClient, private messageService : MessageService) { }

/** GET albums from the server */
getAlbums(): Observable<Album[]>{
  return this.http.get<Album[]>(this.Url,httpOptions)
  .pipe(
    tap(albums=>this.log(`fetched  Album`)),
    catchError(this.handleError('getAlbum', []))
  );
}

      
//////// Save methods //////////


  /** GET hero by id. Will 404 if id not found */
  getAlbum(id: string): Observable<Album> {
    const url = `${this.Url}/${id}`;
    return this.http.get<Album>(url,httpOptions).pipe(
      tap(_ => this.log(`fetched album id=${id}`)),
      catchError(this.handleError<Album>(`getHero id=${id}`))
    );
  }

  getAlbumSongs(id: string): Observable<AlbumSong[]> {
    const url = `${this.Url}/${id}/songs`;
    return this.http.get<AlbumSong[]>(url).pipe(
      tap(_ => this.log(`fetched albumSongs id=${id}`)),
      catchError(this.handleError<AlbumSong[]>(`getAlbumSongs id=${id}`))
    );
  }

  getAlbumSong(id:string,albumsongid:string):Observable<AlbumSong>{
    const url = `${this.Url}/${id}/songs/${albumsongid}`;
    return this.http.get<AlbumSong>(url).pipe(
      tap(_ => this.log(`fetched albumSong id=${id}`)),
      catchError(this.handleError<AlbumSong>(`getAlbumSong id=${id}`))
    );
  }



/** POST: add a new album to the server */
addAlbum(album: Album): Observable<Album> {
  return this.http.post<Album>(this.Url, album, httpOptions)
  .pipe(
    tap((album: Album) => this.log(`added Album w/ id=${album.id}`)),
    catchError(this.handleError<Album>('addalbum'))
  );
}

/**POST: add a new song to album */
addAlbumSong(albumSong:AlbumSong,id:string):Observable<AlbumSong>{
  const url = `${this.Url}/${id}/songs`;
  return this.http.post<AlbumSong>(url,albumSong,httpOptions)
  .pipe(
    tap((albumSong:AlbumSong)=>this.log(`added AlbumSong id=${albumSong.id}`)),
    catchError(this.handleError<AlbumSong>('addAlbumSong'))
  )
}
  
//this.Url with /albums/${album.id}/songs

/** DELETE: delete the album from the server */
  deleteAlbum (album: Album | number): Observable<Album> {
    const id = typeof album === 'number' ? album : album.id;
    const url = `${this.Url}/${id}`;

    return this.http.delete<Album>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted album id=${id}`)),
      catchError(this.handleError<Album>('deleteHero'))
    );
  }

  deleteAlbumSong(albumSong:AlbumSong | number,id:string):Observable<AlbumSong>{
    const albumsongid = typeof albumSong === 'number' ? albumSong:albumSong.id;
    const url = `${this.Url}/${id}/songs/${albumsongid}`;
    return this.http.delete<AlbumSong>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted albumSong id=${albumsongid}`)),
      catchError(this.handleError<AlbumSong>('deleteAlbumSong'))
    )
  }

    /** PUT: update the album on the server */
 updateAlbum (album: Album): Observable<any> {
  return this.http.put(this.Url + "/" + album.id, album, httpOptions).pipe(
    tap(_ => this.log(`updated album id=${album.id}`)),
    catchError(this.handleError<any>('updateAlbum'))
  );
}


    /** PUT: update the album on the server */
    updateAlbumSong (albumSong: AlbumSong,id:string): Observable<any> {
      //const url = `${this.Url}/${id}/songs`;
     // const albumsongid = typeof albumSong === 'number' ? albumSong:albumSong.id;
      return this.http.put(this.Url + "/" + id + "/songs/" + albumSong.id, albumSong, httpOptions).pipe(
        tap(_ => this.log(`updated albumSong id=${albumSong.id}`)),
        catchError(this.handleError<any>('updateAlbumSong'))
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
    /** Log a albumService message with the MessageService */
    private log(message: string) {
      this.messageService.add('AlbumService: ' + message);
    }


}
