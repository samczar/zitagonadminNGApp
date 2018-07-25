import { NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { GenreRoutingModule} from './genre-routing.module';
import { GenreComponent } from './genre.component';


@NgModule({
    imports: [GenreRoutingModule,CommonModule,FormsModule,ReactiveFormsModule],
    declarations: [GenreComponent]
})


export class GenreModule{}