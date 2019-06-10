import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdicionaEmprestimoPage } from './adiciona-emprestimo';

@NgModule({
  declarations: [
    AdicionaEmprestimoPage,
  ],
  imports: [
    IonicPageModule.forChild(AdicionaEmprestimoPage),
  ],
})
export class AdicionaEmprestimoPageModule {}
