import { NgModule} from '@angular/core';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { RecordLabelComponent} from './record-label.component';
import { RecordLabelRoutingModule} from './record-label-routing.module';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
   imports:[RecordLabelRoutingModule,CommonModule,ReactiveFormsModule, FormsModule,FileUploadModule],
   declarations:[RecordLabelComponent]
})

export class RecordLabelModule{}