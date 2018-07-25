import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard } from './auth.guard';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard/dashboard',
    pathMatch: 'full',
    //canActivate: [AuthGuard]
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
   
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'dashboard',
    component: DefaultLayoutComponent,
     canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'base',
        loadChildren: './views/base/base.module#BaseModule'
      },
      {
        path: 'buttons',
        loadChildren: './views/buttons/buttons.module#ButtonsModule'
      },
      {
        path: 'charts',
        loadChildren: './views/chartjs/chartjs.module#ChartJSModule'
      },
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'icons',
        loadChildren: './views/icons/icons.module#IconsModule'
      },
      {
        path: 'notifications',
        loadChildren: './views/notifications/notifications.module#NotificationsModule'
      },
      {
        path: 'theme',
        loadChildren: './views/theme/theme.module#ThemeModule'
      },
      {
        path: 'widgets',
        loadChildren: './views/widgets/widgets.module#WidgetsModule'
      },
      {
       path: 'artist',
       loadChildren: './views/artist/artist.module#ArtistModule'
      },
      {
        path: 'users',
        loadChildren: './views/user/user.module#UserModule'
       },
       {
         path: 'genre',
         loadChildren: './views/genre/genre.module#GenreModule'
       }
        ,
       {
         path: 'album',
         loadChildren: './views/album/album.module#AlbumModule'
        } 
        ,
        {
          path: 'album/album-detail/:id',
          loadChildren: './views/album/album-detail/album-detail.module#AlbumDetailModule'
         }, 
        {
          path: 'single',
          loadChildren: './views/single/single.module#SingleModule'
         },
        {
          path: 'songs',
          loadChildren: './views/songs/songs.module#SongsModule'
         } ,
         {
          path: 'recordLabel',
          loadChildren: './views/record-label/record-label.module#RecordLabelModule'
         } ,
         {
           path: 'events',
           loadChildren: './views/events/events.module#EventsModule'
          }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
