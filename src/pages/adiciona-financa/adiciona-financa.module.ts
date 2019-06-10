import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdicionaFinancaPage } from './adiciona-financa';

@NgModule({
  declarations: [
    AdicionaFinancaPage,
  ],
  imports: [
    IonicPageModule.forChild(AdicionaFinancaPage),
  ],
})
export class AdicionaFinancaPageModule {}
