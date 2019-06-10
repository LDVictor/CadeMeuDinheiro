import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdicionaAcordoPage } from './adiciona-acordo';

@NgModule({
  declarations: [
    AdicionaAcordoPage,
  ],
  imports: [
    IonicPageModule.forChild(AdicionaAcordoPage),
  ],
})
export class AdicionaAcordoPageModule {}
