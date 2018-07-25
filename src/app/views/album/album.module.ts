import {NgModule } from '@angular/core';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {CommonModule } from '@angular/common';
import { AlbumRoutingModule} from './album-routing.module';
import { AlbumComponent } from './album.component';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
    imports: [AlbumRoutingModule,CommonModule,ButtonsModule,ReactiveFormsModule,FormsModule,FileUploadModule],
    declarations: [AlbumComponent]
})

export class AlbumModule{}