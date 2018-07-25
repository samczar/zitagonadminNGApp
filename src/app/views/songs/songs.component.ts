import { Component, OnInit } from '@angular/core';
import { SongsService }  from './songs.service';
import {Observable} from 'rxjs'
@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
  
})
export class SongsComponent implements OnInit {

  constructor(private data:SongsService) { }

  ngOnInit() {
    
  }
  getsongs(){
    this.data.getSongs().subscribe(result=>{
      console.log(result);
    })
  }

}
