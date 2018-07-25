import {NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import {CommonModule } from '@angular/common';
import { AlbumDetailRoutingModule} from './album-detail-routing.module';
import { AlbumDetailComponent } from './album-detail.component';
import {AlbumService} from '../album.service';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
    imports: [AlbumDetailRoutingModule,CommonModule,ReactiveFormsModule, FormsModule,NgSelectModule,FileUploadModule],
    declarations: [AlbumDetailComponent],
    providers:[AlbumService]
})

export class AlbumDetailModule{}