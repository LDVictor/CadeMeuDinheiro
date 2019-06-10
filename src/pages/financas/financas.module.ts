import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinancasPage } from './financas';

@NgModule({
  declarations: [
    FinancasPage,
  ],
  imports: [
    IonicPageModule.forChild(FinancasPage),
  ],
})
export class FinancasPageModule {}
