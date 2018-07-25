
import {NgModule} from '@angular/core';
import {Routes, RouterModule } from '@angular/router';
import { SingleComponent} from './single.component';



const routes: Routes = [{
    path: '',
    component: SingleComponent,
    data: {
        title: 'Single'
    }

}]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SingleRoutingModule{}