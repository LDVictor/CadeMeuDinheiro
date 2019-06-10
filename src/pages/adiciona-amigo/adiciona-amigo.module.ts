import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdicionaAmigoPage } from './adiciona-amigo';

@NgModule({
  declarations: [
    AdicionaAmigoPage,
  ],
  imports: [
    IonicPageModule.forChild(AdicionaAmigoPage),
  ],
})
export class AdicionaAmigoPageModule {}
