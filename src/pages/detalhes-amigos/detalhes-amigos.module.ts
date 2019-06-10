import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalhesAmigosPage } from './detalhes-amigos';

@NgModule({
  declarations: [
    DetalhesAmigosPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalhesAmigosPage),
  ],
})
export class DetalhesAmigosPageModule {}
