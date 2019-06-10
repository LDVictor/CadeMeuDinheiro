import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditaPagamentoPage } from './edita-pagamento';

@NgModule({
  declarations: [
    EditaPagamentoPage,
  ],
  imports: [
    IonicPageModule.forChild(EditaPagamentoPage),
  ],
})
export class EditaPagamentoPageModule {}
