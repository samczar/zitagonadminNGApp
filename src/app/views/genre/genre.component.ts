import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute , Router, ParamMap} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { Genre} from './genre';
import { GenreService } from './genre.service';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  // styleUrls: ['./genre.component.scss']
})
export class GenreComponent implements OnInit {
  @Input() genre:Genre;
  genres: Genre[];
  statusCode: number;
  requestProcessing = false;
  genreIdToUpdate = null;
  genreIdToUpdateName = null;
  processValidation = false;
  
  //Create Form
   //Create form
   genreForm = new FormGroup({
    name: new FormControl('', Validators.required),
    // category: new FormControl('', Validators.required)	   
});

  constructor(private genreService:GenreService,
    private router: Router, 
    private route: ActivatedRoute,
    private location: Location,) { }

  ngOnInit() {
    this.getGenres();
    //this.getGenre( this.route.snapshot.params['id']);
  }

  getGenres():void{
    this.genreService.getGenres()
    .subscribe(genres=>this.genres = genres);
  }

  add(name:string):void{
    name = name.trim();
  
    if(!name){return;}
     this.genreService.addGenre({name } as Genre)
     .subscribe(genre=>{
       this.genres.push(genre);
     })
  }
  
  // getGenre(id): void {
  //   this.genreService.getGenre(id)
  //     .subscribe(genre => this.genre = genre);
  // }
  update(genre:Genre){
     return this.genreService.updateGenre(genre).subscribe(data=>{
       this.genres = data;
       console.log(data);
     })
  }

  getGenre(id:string){
    this.preProcessConfigurations();
    this.genreService.getGenre(id)
    .subscribe(genre => {
      this.genreIdToUpdate = genre.id;
      this.genreIdToUpdateName = genre.name;
      this.genreForm.setValue({name: genre.name});
      this.processValidation = true;
      this.requestProcessing = false;
    },
     errorCode => this.statusCode= errorCode
  );
  }
  delete(genre:Genre):void{
  this.genres= this.genres.filter(h=> h !== genre);
  this.genreService.deleteGenre(genre).subscribe();
  }

  save(): void {
    this.genreService.updateGenre(this.genre)
      .subscribe();
  }


//Handle create and update article
onGenreFormSubmit() {
  this.processValidation = true;   
  if (this.genreForm.invalid) {
       return; //Validation failed, exit from method.
  }   
  //Form is valid, now perform create or update
    this.preProcessConfigurations();
  let genreValue = this.genreForm.value;
  if (this.genreIdToUpdate === null) {  
    //Generate article id then create article
      this.genreService.getGenres()
     .subscribe(genre => {
    //   this.genreService.addGenre({name } as Genre)
    //  .subscribe(genre=>{
    //    this.genres.push(genre);
    //  })
     
     //Generate article id	 
    //  let maxIndex = articles.length - 1;
    //  let articleWithMaxIndex = articles[maxIndex];
    //  let genreId = articleWithMaxIndex.id + 1;
    //  genre.id = articleId;
     
     //Create genre
        this.genreService.addGenre(genreValue)
      .subscribe(genre => {
        this.genres.push(genre);
        this.statusCode = genreValue;
        this.getGenres();
        this.backToCreateGenre();
       },
       errorCode => this.statusCode = errorCode
       );
   });		
  } else {  
       //Handle update article
      genreValue.id = this.genreIdToUpdate; 		
    this.genreService.updateGenre(genreValue)
      .subscribe(successCode => {
              this.statusCode = successCode;
          this.getGenres();	
        this.backToCreateGenre();
        },
          errorCode => this.statusCode = errorCode);	  
  }
 }

 preProcessConfigurations(){
  this.statusCode = null;
  this.requestProcessing = true;
 }

 backToCreateGenre(){
   this.genreIdToUpdate = null;
   this.genreForm.reset();
   this.processValidation = false;
 }


}
