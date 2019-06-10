import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginCadastroPage } from './login-cadastro';

@NgModule({
  declarations: [
    LoginCadastroPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginCadastroPage),
  ],
})
export class LoginCadastroPageModule {}
