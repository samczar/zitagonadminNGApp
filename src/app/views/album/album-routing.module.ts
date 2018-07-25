
import {NgModule} from '@angular/core';
import {Routes, RouterModule } from '@angular/router';
import { AlbumComponent} from './album.component';

const routes: Routes = [
    {path: '', component: AlbumComponent,data: { title: 'Album' },
    // children: [
    //     {path: 'album-detail', 
    //     loadChildren: './views/album/album-detail/album-detail.module#AlbumDetailModule'
    //     }
         
    // ]

},



]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AlbumRoutingModule{}