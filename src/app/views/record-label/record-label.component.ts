import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { RecordLabel} from './record-label';
import { RecordLabelService } from './record-label.service';
import { FileUploader , FileUploaderOptions, FileItem} from 'ng2-file-upload';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
const URL = 'http://localhost:3000/api/Containers/Pics/upload';


@Component({
  selector: 'app-record-label',
  templateUrl: './record-label.component.html',
  // styleUrls: ['./record-label.component.scss']
})
export class RecordLabelComponent implements OnInit {
  @Input() recordLabel:RecordLabel;

  recordLabels: RecordLabel[];
  statusCode: number;
  requestProcessing = false;
  objectIdToUpdate = null;
  objectIdToUpdateName = null;
  processValidation = false;
  objectSelected = null; //this hold the image name

  objectForm = new FormGroup({
    name: new FormControl('', Validators.required),
    country: new FormControl(''), 
    labelinfo: new FormControl(''),  
    labelimg: new FormControl('')	 
});

public filePreviewPath: SafeUrl;
public uploader:FileUploader = new FileUploader({url: URL,itemAlias: 'photo'}); 
  
  constructor(private recordLabelService:RecordLabelService,
    private sanitizer: DomSanitizer,) { 


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
     this.objectForm.get('labelimg').patchValue(`http://localhost:3000/api/Containers/Pics/download/${this.objectSelected}`);
     
     // this.uploader.destroy();
    }


    }


    removePics(fileItem:FileItem){
      fileItem.remove =  this.filePreviewPath = null;
     }

  ngOnInit() {
    this.getRecordLabels();
  }

  getRecordLabels():void{
    this.recordLabelService.getRecordLabels()
    .subscribe(recordLabels=>this.recordLabels = recordLabels);
  }

  getObject(id:string){
    this.preProcessConfigurations();
    this.recordLabelService.getRecordLabel(id)
    .subscribe(data => {
      this.objectIdToUpdate = data.id;
      this.objectIdToUpdateName = data.name;
      this.objectForm.setValue({name: data.name,labelimg:data.labelimg,country:data.country,labelinfo:data.labelinfo});
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
  if (this.objectIdToUpdate === null) {  
    //Generate article id then create article
      this.recordLabelService.getRecordLabels()
     .subscribe(data => {
     
     //Create genre
        this.recordLabelService.addRecordLabel(objectValue)
      .subscribe(data => {
        this.filePreviewPath = null; //remove the pics preview
        this.recordLabels.push(data);
        this.statusCode = objectValue;
        this.getRecordLabels();
        this.backToCreateObject();
       },
       errorCode => this.statusCode = errorCode
       );
   });		
  } else {  
       //Handle update article
      objectValue.id = this.objectIdToUpdate; 		
    this.recordLabelService.updateRecordLabel(objectValue)
      .subscribe(successCode => {
              this.statusCode = successCode;
          this.getRecordLabels();	
        this.backToCreateObject();
        },
          errorCode => this.statusCode = errorCode);	  
  }
 }

  delete(recordLabel:RecordLabel):void{
  this.recordLabels= this.recordLabels.filter(h=> h !== recordLabel);
  this.recordLabelService.deleteRecordLabel(recordLabel).subscribe();
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
