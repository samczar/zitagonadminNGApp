import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Album} from './album';
import { AlbumService } from './album.service';
import {ArtistService } from '../artist/artist.service';
import { Artist } from '../artist/artist';
import { AlbumDetailComponent} from './album-detail/album-detail.component';
import { Observable } from 'rxjs';
import {AuthService} from '../../auth.service';
import {User} from '../login/user';
import { RecordLabelService} from '../record-label/record-label.service';
import { RecordLabel } from '../record-label/record-label';
import { FileUploader , FileUploaderOptions, FileItem} from 'ng2-file-upload';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
const URL = 'http://localhost:3000/api/Containers/Pics/upload';


@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  providers:[AuthService]
  // styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit, OnDestroy { 
  @Input() album: Album;
  currentUser: User;

  albums: Album[];
  artists : Artist[];
  recordLabels:RecordLabel[];
  objectSelected = null; //this hold the image name

  statusCode: number;
  requestProcessing = false;
  albumIdToUpdate = null;
  albumIdToUpdateName = null;
  processValidation = false;

  public albumId;
  public selectedId;



    //Create Form
   //Create form
   objectForm = new FormGroup({
    name: new FormControl('', Validators.required),
    artistId: new FormControl('', Validators.required),	
    releasedMonth: new FormControl(''),
    releasedYear: new FormControl(''), 
    coverimage: new FormControl(''),
    recordLabel: new FormControl('')
    // featureArtist: new FormControl('')  
});


public filePreviewPath: SafeUrl;
public uploader:FileUploader = new FileUploader({url: URL,itemAlias: 'photo'}); 


  constructor(private albumService:AlbumService, 
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private location: Location,
    private router : Router,
    private artistService : ArtistService,
    private recordLabelService: RecordLabelService,
    
) { 

      // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      // console.log(this.currentUser)

      this.uploader.onAfterAddingFile = (fileItem:FileItem)=>{
      
      
        var fileExtension = '.' + fileItem.file.name.split('.').pop();
  
        fileItem.file.name = Math.random().toString(36).substring(7) + new Date().getTime() + fileExtension;
      
        this.filePreviewPath = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
        
      } 
      
      
      this.uploader.onCompleteItem = (item:any, response:any, status:any,header:any)=>{
        this.filePreviewPath = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(item._file)));
        console.log('ImageUpload:uploaded:', item, status, response);
        alert('File uploaded successfully');
        this.objectSelected = item.file.name;
        console.log('object File Name',this.objectSelected);
       this.objectForm.get('coverimage').patchValue(`http://localhost:3000/api/Containers/Pics/download/${this.objectSelected}`);
       
       // this.uploader.destroy();
      }


    }

    removePics(fileItem:FileItem){
      fileItem.remove =  this.filePreviewPath = null;
     }
  

  ngOnInit() {
    this.getAlbums();
    this.getArtist();
    this.getRecordLabels();
  
  }
  
  ngOnDestroy(){
    
  }


  getRecordLabels(){
    this.recordLabelService.getRecordLabels().
    subscribe(recordLabels=>this.recordLabels= recordLabels);
  }
 
  getArtist() {
    this.artistService.getArtists()
    .subscribe(artists=>this.artists = artists);
}

gotonextpage(){

}

  getAlbums():void{
    this.albumService.getAlbums()
    .subscribe(albums=>this.albums = albums);
  }

  getAlbum(id:string){
    this.preProcessConfigurations();
    this.albumService.getAlbum(id)
    .subscribe(data => {
      this.albumIdToUpdate = data.id;
      this.albumIdToUpdateName = data.name;
      this.objectForm.setValue({name: data.name,releasedYear:data.releasedYear,releasedMonth:data.releasedMonth,artistId:data.artistId,coverimage:data.coverimage,recordLabel:data.recordLabel});
      this.processValidation = true;
      this.requestProcessing = false;
    },
     errorCode => this.statusCode= errorCode
  );
  }

  delete(album:Album):void{
  this.albums= this.albums.filter(h=> h !== album);
  this.albumService.deleteAlbum(album).subscribe();
  }


  gotoAlbum():void{
    let selectedId = this.albumId ? this.albumId : null ;
    this.router.navigate(['album-details',{id:selectedId}])
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
  if (this.albumIdToUpdate === null) {  
    //Generate article id then create article
      this.albumService.getAlbums()
     .subscribe(data => {
     
     //Create genre
        this.albumService.addAlbum(objectValue)
      .subscribe(data => {
        this.filePreviewPath = null; //remove the pics preview
        this.albums.push(data);
        this.statusCode = objectValue;
        this.getAlbums();
        this.backToCreateObject();
       },
       errorCode => this.statusCode = errorCode
       );
   });		
  } else {  
       //Handle update article
      objectValue.id = this.albumIdToUpdate; 		
    this.albumService.updateAlbum(objectValue)
      .subscribe(successCode => {
              this.statusCode = successCode;
          this.getAlbums();	
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
   this.albumIdToUpdate = null;
   this.objectForm.reset();
   this.processValidation = false;
 }

}
