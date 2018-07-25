import {NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import {CommonModule } from '@angular/common';
import { SingleRoutingModule} from './single-routing.module';
import { SingleComponent } from './single.component';
import { FileUploadModule } from 'ng2-file-upload';


@NgModule({
    imports: [NgSelectModule, SingleRoutingModule,CommonModule,ReactiveFormsModule,FormsModule,FileUploadModule],
    declarations: [SingleComponent]
})

export class SingleModule{}