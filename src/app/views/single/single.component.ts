import { Component, OnInit , Input} from '@angular/core';
import {FormGroup, FormControl,Validators} from '@angular/forms';
import { Single} from './single';
import { SingleService } from './single.service';
import {ArtistService } from '../artist/artist.service';
import {GenreService} from '../genre/genre.service';
import {Genre} from '../genre/genre';
import { Artist } from '../artist/artist';
import { Observable } from 'rxjs';
import { RecordLabelService} from '../record-label/record-label.service';
import { RecordLabel } from '../record-label/record-label';
import { FileUploader , FileUploaderOptions, FileItem} from 'ng2-file-upload';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
const URL = 'http://localhost:3000/api/Containers/Pics/upload';
const audioUrl = 'http://localhost:3000/api/Containers/audios/upload';
const videoUrl = 'http://localhost:3000/api/Containers/videos/upload';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  // styleUrls: ['./single.component.scss']
})
export class SingleComponent implements OnInit {
  @Input() single:Single;
 artists : Artist[];
  singles: Single[];
  recordLabels: RecordLabel[];
  statusCode: number;
  requestProcessing = false;
  objectIdToUpdate = null;
  objectIdToUpdateName = null;
  processValidation = false;
  objectSelected = null; //this hold the image name
  audioSelected  = null;
  videoSelected  = null;

  
  people$1:Observable<Artist[]>;
  selectedPeople1 = [];

  genre$1:Observable<Genre[]>;
  selectedGenre = [];

  public singleId;
  public selectedId;

    //Create Form
   //Create form
   objectForm = new FormGroup({
    name: new FormControl('', Validators.required),
    artistId: new FormControl('', Validators.required),	
    releasedMonth: new FormControl('', Validators.required),
    releasedYear: new FormControl('', Validators.required),
    audio:new FormControl(''),
    video:new FormControl(''),
    lyrics:new FormControl(''), 
    coverimage:new FormControl(''),
    featureArtist: new FormControl(''),
    genre:new FormControl(),
    recordLabel: new FormControl('')
    
});

public filePreviewPath: SafeUrl;
public uploader:FileUploader = new FileUploader({url: URL,itemAlias: 'photo'}); 
public audioUploader:FileUploader = new FileUploader({url:audioUrl, itemAlias:'audio'})
public videoUploader:FileUploader = new FileUploader({url:videoUrl, itemAlias:'audio'})

constructor(private singleService:SingleService ,
  private sanitizer: DomSanitizer,
   private artistService : ArtistService, 
   private genreService:GenreService,
   private recordLabelService: RecordLabelService) {


// image Upload
    this.uploader.onAfterAddingFile = (fileItem:FileItem)=>{
      
      
      var fileExtension = '.' + fileItem.file.name.split('.').pop();

      fileItem.file.name = Math.random().toString(36).substring(7) + new Date().getTime() + fileExtension;
    
      this.filePreviewPath = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
      
    } 
       
    this.uploader.onCompleteItem = (item:any, response:any, status:any,header:any)=>{
      this.filePreviewPath = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(item._file)));
      console.log('ImageUpload:uploaded:', item, status, response);
      this.objectSelected = item.file.name;
      console.log('Image File Name',this.objectSelected);
     this.objectForm.get('coverimage').patchValue(`http://localhost:3000/api/Containers/Pics/download/${this.objectSelected}`);
     
     // this.uploader.destroy();
    }

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


    removePics(fileItem:FileItem){
      fileItem.remove =  this.filePreviewPath = null;
     }
  

  ngOnInit() {
    this.getSingles();
    this.getArtist();
    this.people$1 = this.artistService.getArtists();
    this.genre$1=this.genreService.getGenres();
    this.getRecordLabels();
  }

  getRecordLabels(){
    this.recordLabelService.getRecordLabels().
    subscribe(recordLabels=>this.recordLabels= recordLabels);
  }
//Get the Artist on the drup downlist
  getArtist() {
    this.artistService.getArtists()
    .subscribe(artists=>this.artists = artists);
}
 //Get the Total List of Songs
  getSingles():void{
    this.singleService.getSingles()
    .subscribe(singles=>this.singles = singles);
  }

  // add(name:string,artist:string,releasedYear:string,releasedMonth:string):void{
  //   name = name.trim();
  //   if(!name){return;}
  //    this.singleService.addSingle({name,artist, releasedYear,releasedMonth} as Single)
  //    .subscribe(single=>{
  //      this.singles.push(single);
  //    })
  // }
 //Get a song
  getSinglecomp(id:string){
    this.preProcessConfigurations();
    this.singleService.getSingle(id)
    .subscribe(data => {
      this.objectIdToUpdate = data.id;
      this.objectIdToUpdateName = data.name;
      this.objectForm.setValue({name: data.name,releasedYear:data.releasedYear,
        releasedMonth:data.releasedMonth,artistId:data.artistId,
         audio:data.audio, video:data.video, lyrics:data.lyrics,
        coverimage:data.coverimage,featureArtist:data.featureArtist,genre:data.genre,
      recordLabel:data.recordLabel
      });
      this.processValidation = true;
      this.requestProcessing = false;
    },
     errorCode => this.statusCode= errorCode
  );
  }

  delete(single:Single):void{
  this.singles= this.singles.filter(h=> h !== single);
  this.singleService.deleteSingle(single).subscribe();
  }

//Handle create and update article
onFormSubmit() {
  this.processValidation = true;   
  if (this.objectForm.invalid) {
       return; //Validation failed, exit from method.
  }   
  //Form is valid, now perform create or update
    this.preProcessConfigurations();
  let objectValue = this.objectForm.value;
  if (this.objectIdToUpdate === null) {  
    //Generate article id then create article
      this.singleService.getSingles()
     .subscribe(data => {
     
     //Create genre
        this.singleService.addSingle(objectValue)
      .subscribe(data => {
        this.filePreviewPath = null; //remove the pics preview
        this.singles.push(data);
        this.statusCode = objectValue;
        this.getSingles();
        this.backToCreateObject();
       },
       errorCode => this.statusCode = errorCode
       );
   });		
  } else {  
       //Handle update article
      objectValue.id = this.objectIdToUpdate; 		
    this.singleService.updateSingle(objectValue)
      .subscribe(successCode => {
              this.statusCode = successCode;
          this.getSingles();	
        this.backToCreateObject();
        },
          errorCode => this.statusCode = errorCode);	  
  }
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
