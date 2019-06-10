import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagaDividaPage } from './paga-divida';

@NgModule({
  declarations: [
    PagaDividaPage,
  ],
  imports: [
    IonicPageModule.forChild(PagaDividaPage),
  ],
})
export class PagaDividaPageModule {}
