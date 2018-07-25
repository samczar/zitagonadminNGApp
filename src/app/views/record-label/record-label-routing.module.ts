import { NgModule} from '@angular/core';
import {Routes ,RouterModule} from '@angular/router';
import {RecordLabelComponent } from './record-label.component';


const routes:Routes = [{
    path: '',
    component: RecordLabelComponent,
    data:{
        title : 'Record Label'
        }
    
}]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
}) 

export class RecordLabelRoutingModule{};