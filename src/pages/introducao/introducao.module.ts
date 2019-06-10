import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntroducaoPage } from './introducao';

@NgModule({
  declarations: [
    IntroducaoPage,
  ],
  imports: [
    IonicPageModule.forChild(IntroducaoPage),
  ],
})
export class IntroducaoPageModule {}
