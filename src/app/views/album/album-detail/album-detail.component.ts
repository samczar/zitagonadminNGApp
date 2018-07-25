import { Component, OnInit,Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute , Router, ParamMap} from '@angular/router';
import { Location } from '@angular/common';


import { Album} from '../album';
import { AlbumSong} from './album-song';
import { AlbumService } from '../album.service';
import {ArtistService} from '../../artist/artist.service';
import {Artist} from '../../artist/artist';
import {Song} from '../../songs/songs';
import { Genre} from '../../genre/genre';
import { GenreService } from '../../genre/genre.service';
import { Observable } from 'rxjs';
import { FileUploader , FileUploaderOptions, FileItem} from 'ng2-file-upload';
const URL = 'http://localhost:3000/api/Containers/Pics/upload';
const audioUrl = 'http://localhost:3000/api/Containers/audios/upload';
const videoUrl = 'http://localhost:3000/api/Containers/videos/upload';





//import album component
// import {AlbumComponent} from '../album.component';

@Component({
   selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  // styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit {
  @Input() albumSong: AlbumSong;

  artist:Observable<Artist[]>;
  SelectedArtist = [];
  genre:Observable<Genre[]>;
  SelectedGenre = [];
  // public albumId;
  album = {};
  albums:Album[];
  songs:Song[] ;
  albumSongs:AlbumSong[];
  albumsongsArr = []; 
  audioSelected  = null;
  videoSelected  = null;

  statusCode: number;
  requestProcessing = false;
  objectIdToUpdate = null;
  processValidation = false;
  //@Input() album: Album;
  objectForm = new FormGroup({
    name: new FormControl('', Validators.required),//albumId ref
    audio: new FormControl(''),  
    video: new FormControl(''),
    lyrics: new FormControl(''),
    coverimage: new FormControl(''),//ref
    artistId: new FormControl(''), //ref artist from Album
    releasedyear: new FormControl(''),//Ref released Year
    releasedmonth: new FormControl(''),//ref,
    featureArtist: new FormControl(''),
    genre:new FormControl()
});

public audioUploader:FileUploader = new FileUploader({url:audioUrl, itemAlias:'audio'})
public videoUploader:FileUploader = new FileUploader({url:videoUrl, itemAlias:'audio'})


  constructor(private albumService:AlbumService,
    private router: Router, 
    private route: ActivatedRoute,
    private location: Location,
    private artistService : ArtistService,
    private genreService: GenreService 
   
    ) { 

//Audio Upload

this.audioUploader.onAfterAddingFile = (audioFile:FileItem)=>{
  var audiofileExtension = '.' + audioFile.file.name.split('.').pop();
  audioFile.file.name = Math.random().toString(36).substring(7) + new Date().getTime() + audiofileExtension;
}
this.audioUploader.onCompleteItem = (item:any, response:any, status:any, header:any)=>{
  console.log('AudioUpload:uploaded:', item, status, response);
  this.audioSelected = item.file.name;
  console.log('Audio File Name',this.audioSelected);
  this.objectForm.get('audio').patchValue(`http://localhost:3000/api/Containers/audios/download/${this.audioSelected}`)
}
 
//Video Upload    
this.videoUploader.onAfterAddingFile = (videoFile:FileItem)=>{
  //algorithm here
  var videofileExtension = '.' + videoFile.file.name.split('.').pop();
  videoFile.file.name = Math.random().toString(36).substring(7) + new Date().getTime() + videofileExtension;
}
this.videoUploader.onCompleteItem = (item:any, response:any, status:any, header:any)=>{
  console.log('VideoUpload:uploaded:', item, status, response);
  this.videoSelected = item.file.name;
  console.log('Audio File Name',this.videoSelected);
  this.objectForm.get('video').patchValue(`http://localhost:3000/api/Containers/videos/download/${this.videoSelected}`)
}



    }

  ngOnInit() {
 //multiselect artist
 
  
 

    // this.album$ = this.route.paramMap.pipe(
    //   switchMap((params: ParamMap) =>
    //     this.albumService.getAlbum(params.get('id')))
    // );
   // let id = this.route.snapshot.paramMap.get('id');

   //this.album$ = this.albumService.getAlbum(id)
   this.getAlbum(this.route.snapshot.params['id']);
  //  this.songService.getSongs().subscribe(data=>{
  //    console.log(data);
  //  });
  this.getAlbumSongs(this.route.snapshot.params['id']);

  this.artist = this.artistService.getArtists();
  this.genre = this.genreService.getGenres();
  }
// End NgInit
  //getArtist

  getArtist():void{
    this.artistService.getArtists().subscribe(artist=>{
      console.log(artist)
    })
  }

    // Get Detail Of an Album   
    getAlbum(id){
      this.albumService.getAlbum(id).subscribe(data=>{
        console.log(data);
        this.album = data;
      })
    }

  getObject(id:string){
     this.route.params.subscribe(params=>{
   
      let paramId = params['id']; 
    this.preProcessConfigurations();
   
    this.albumService.getAlbumSong(paramId,id)
  
    .subscribe(data => {
      this.objectIdToUpdate = data.id;
      this.objectForm.setValue({name: data.name,audio:data.audio,video:data.video,
        lyrics:data.lyrics,coverimage:data.coverimage,
        releasedyear:data.releasedyear, releasedmonth:data.releasedmonth, artistId:data.artistId,
        genre:data.genre, featureArtist:data.featureArtist
      });
      /**
       * Add Genre and Featured Artists
       */
      this.processValidation = true;
      this.requestProcessing = false;
    },
     errorCode => this.statusCode= errorCode
  );
})
   }

  //Get  Songs Of an Album
  getAlbumSongs(id){
    this.albumService.getAlbumSongs(id).subscribe(albumSongs=>{
      if (albumSongs.length > 0){
        this.albumSongs = albumSongs;
        console.log(this.albumSongs);
      }else{
        console.log('No song');
      }
      
      
    })
  }

//Handle create and update article
onFormSubmit(id) {
  this.route.params.subscribe(params=>{

    id  = params['id'];

  this.processValidation = true;   
  if (this.objectForm.invalid) {
       return; //Validation failed, exit from method.
  }   
  //Form is valid, now perform create or update
    this.preProcessConfigurations();
  let objectValue = this.objectForm.value;
  if (this.objectIdToUpdate === null) {  
    //Generate article id then create article
      this.albumService.getAlbumSong(id,id)
     .subscribe(data => {
     //Create OBJECT

       
        this.albumService.addAlbumSong(objectValue,id)
      .subscribe(data => {
      
          this.albumsongsArr.push(data);
          this.statusCode = objectValue;
          this.getAlbumSongs(id);
          this.backToCreateObject();
         },
         errorCode => this.statusCode = errorCode
         );
        
      
   });		
  } else {  
       //Handle update article
      objectValue.id = this.objectIdToUpdate; 		
    this.albumService.updateAlbumSong(objectValue,id)
      .subscribe(successCode => {
              this.statusCode = successCode;
          this.getAlbumSongs(id);	
        this.backToCreateObject();
        },
          errorCode => this.statusCode = errorCode);	  
  }
 })
}





  goBack(): void {
    this.location.back();
  }

  //Add New Song to the Album
  //inserts Based on the settings
  addAlbumSongComp(audio:string,video:string,lyrics:string,name:string,albumId:string):void{  
    this.route.params.subscribe(params=>{

      albumId  = params['id'];
      if(!name){return}
    this.albumService.addAlbumSong({name,audio,video,lyrics,albumId} as AlbumSong,params['id'])
    .subscribe(data=>{
       this.albumsongsArr.push(data);
      console.log(data);
    })
  })
  }

  delete(albumSong:AlbumSong, id:string):void{
    this.route.params.subscribe(params=>{

      id = params['id'];
      this.albumSongs= this.albumSongs.filter(h=> h !== albumSong);
      this.albumService.deleteAlbumSong(albumSong,id).subscribe(data=>{
        console.log('param:' +id)
        console.log('deleted: '+ id);
        this.getAlbumSongs(id);
      });
    })
    

   
  }
  
    preProcessConfigurations(){
      this.statusCode = null;
      this.requestProcessing = true;
     }
    
     backToCreateObject(){
       this.objectIdToUpdate = null;
       this.objectForm.reset();
       this.processValidation = false;
     }


}

