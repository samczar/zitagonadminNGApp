import { Component, OnInit, Input } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Artist} from './artist';
import { ArtistService } from './artist.service';
import { FileUploader , FileUploaderOptions, FileItem} from 'ng2-file-upload';
// import { CountryService} from '../country/country.service';


const URL = 'http://localhost:3000/api/Containers/Pics/upload';


@Component({
   selector: 'app-artist',
  templateUrl: './artist.component.html',
  // styleUrls: ['./artist.component.scss']
  // providers:[CountryService]
})
export class ArtistComponent implements OnInit {
  @Input() artist:Artist;
  artists: Artist[];
  statusCode: number;
  //recordLabels: RecordLabel[];
  country = [];
  requestProcessing = false;
  objectIdToUpdate = null;
  processValidation = false;
  objectToUpdateName = null;
  objectSelected = null;
  

 

  objectForm = new FormGroup({
     name: new FormControl('', Validators.required),
     picsUrl: new FormControl(),  
     country: new FormControl(),
     bio: new FormControl()	 
    
});


  public filePreviewPath: SafeUrl;
  public uploader:FileUploader = new FileUploader({url: URL,itemAlias: 'photo'}); 
  
  constructor(private artistService:ArtistService,
    private sanitizer: DomSanitizer,
    // private countryService: CountryService
  ) {
    
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
       this.objectForm.get('picsUrl').patchValue(`http://localhost:3000/api/Containers/Pics/download/${this.objectSelected}`);
       
       // this.uploader.destroy();
      }


   }
   
   removePics(fileItem:FileItem){
    fileItem.remove =  this.filePreviewPath = null;
   }


  ngOnInit() {
    this.getArtists();
    
    // this.getCountry();
   
  }


  // getCountry(){
  //   this.countryService.getCountry()
  //   .subscribe(data=>this.country = data);
  // }

  getArtists():void{
    this.artistService.getArtists()
    .subscribe(artists=>{
      if(artists.length > 0){
        this.artists = artists
        console.log(this.artists);
        
      }else{
         console.log('No Artist');
      }
    });
  }

 getObject(id:string){
  this.preProcessConfigurations();
  this.artistService.getArtist(id)
  .subscribe(data => {
    this.objectToUpdateName = data.name;
    this.objectIdToUpdate = data.id;
    this.objectForm.setValue({name: data.name,bio:data.bio,country:data.country,picsUrl:data.picsUrl});
    this.processValidation = true;
    this.requestProcessing = false;
  },
   errorCode => this.statusCode= errorCode
);
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
  console.log("obj: ", objectValue)
  if (this.objectIdToUpdate === null) {  
    //Generate article id then create article
      this.artistService.getArtists()
     .subscribe(data => {
     //Create genre
    
        this.artistService.addArtist(objectValue)
      .subscribe(data => {
        this.filePreviewPath = null;
        this.statusCode = objectValue;
        this.getArtists();
        this.backToCreateObject();
       },
       errorCode => this.statusCode = errorCode
       );
   });		
  } else {  
       //Handle update article
      objectValue.id = this.objectIdToUpdate; 		
    this.artistService.updateArtist(objectValue)
      .subscribe(successCode => {
              this.statusCode = successCode;
          this.getArtists();	
        this.backToCreateObject();
        },
          errorCode => this.statusCode = errorCode);	  
  }
 }


  delete(artist:Artist):void{
  this.artists= this.artists.filter(h=> h !== artist);
  this.artistService.deleteArtist(artist).subscribe();
  //get the API of container to delete path;
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
