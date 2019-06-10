import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdicionaDividaPage } from './adiciona-divida';

@NgModule({
  declarations: [
    AdicionaDividaPage,
  ],
  imports: [
    IonicPageModule.forChild(AdicionaDividaPage),
  ],
})
export class AdicionaDividaPageModule {}
