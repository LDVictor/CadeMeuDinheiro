import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MostraDividaPage } from '../mostra-divida/mostra-divida';

@NgModule({
  declarations: [
    MostraDividaPage,
  ],
  imports: [
    IonicPageModule.forChild(MostraDividaPage),
  ],
})
export class MostraDividaPageModule {}
