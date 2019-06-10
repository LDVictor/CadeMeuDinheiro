import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdicionaDinheiroPage } from './adiciona-dinheiro';
import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    AdicionaDinheiroPage,
  ],
  imports: [
    IonicPageModule.forChild(AdicionaDinheiroPage),
    BrMaskerModule
  ],
})
export class AdicionaDinheiroPageModule {}
