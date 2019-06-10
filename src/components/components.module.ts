import { NgModule } from '@angular/core';
import { ItemCardComponent } from './item-card/item-card';
import { IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [ItemCardComponent],
	imports: [IonicModule],
	exports: [ItemCardComponent]
})
export class ComponentsModule {}
