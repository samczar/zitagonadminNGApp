import { NgModule} from '@angular/core';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { ArtistComponent} from './artist.component';
import {ArtistRoutingModule } from './artist-routing.module';
import { FileUploadModule } from 'ng2-file-upload';



@NgModule({
    imports:[ArtistRoutingModule,CommonModule,ReactiveFormsModule,FormsModule,FileUploadModule],
    declarations: [ArtistComponent]
})

export class ArtistModule{};