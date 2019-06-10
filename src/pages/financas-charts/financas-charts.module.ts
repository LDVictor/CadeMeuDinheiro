import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinancasChartsPage } from './financas-charts';

@NgModule({
  declarations: [
    FinancasChartsPage,
  ],
  imports: [
    IonicPageModule.forChild(FinancasChartsPage),
  ],
})
export class FinancasChartsPageModule {}
