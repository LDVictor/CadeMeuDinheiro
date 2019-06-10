import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagamentosPage } from './pagamentos';

@NgModule({
  declarations: [
    PagamentosPage,
  ],
  imports: [
    IonicPageModule.forChild(PagamentosPage),
  ],
})
export class PagamentosPageModule {}
