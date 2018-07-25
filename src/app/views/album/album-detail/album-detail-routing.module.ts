
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule } from '@angular/router';
import { AlbumDetailComponent} from './album-detail.component';



const routes: Routes = [{
    path: '',
    component: AlbumDetailComponent,
    data: {
        title: 'Album-Detail'
    }
},
]

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AlbumDetailRoutingModule{}