import {NgModule} from '@angular/core';
import { UserComponent } from './user.component';
import {UserRoutingModule } from './user-routing.module';


@NgModule({
    imports:[UserRoutingModule],
    declarations:[UserComponent]
})

export class UserModule{}