import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditaPerfilPage } from './edita-perfil';

@NgModule({
  declarations: [
    EditaPerfilPage,
  ],
  imports: [
    IonicPageModule.forChild(EditaPerfilPage),
  ],
})
export class EditaPerfilPageModule {}
