import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdicionaMetaPage } from './adiciona-meta';

@NgModule({
  declarations: [
    AdicionaMetaPage,
  ],
  imports: [
    IonicPageModule.forChild(AdicionaMetaPage),
  ],
})
export class AdicionaMetaPageModule {}
