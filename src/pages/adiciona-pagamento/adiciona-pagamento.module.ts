import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdicionaPagamentoPage } from './adiciona-pagamento';

@NgModule({
  declarations: [
    AdicionaPagamentoPage,
  ],
  imports: [
    IonicPageModule.forChild(AdicionaPagamentoPage),
  ],
})
export class AdicionaPagamentoPageModule {}
