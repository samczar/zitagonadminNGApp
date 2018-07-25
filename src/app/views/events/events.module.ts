import {NgModule } from '@angular/core';
import {EventsRoutingMoule} from './events-routing.module';
import { EventsComponent} from './events.component';

@NgModule({
    imports:[EventsRoutingMoule],
    declarations:[EventsComponent]
})

export class EventsModule{}