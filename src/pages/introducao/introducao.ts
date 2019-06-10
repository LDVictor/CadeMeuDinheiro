import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginCadastroPage } from '../login-cadastro/login-cadastro';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the IntroducaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-introducao',
  templateUrl: 'introducao.html',
})
export class IntroducaoPage {

  @ViewChild('slides') slidesIntro: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
  }

  ionViewDidLoad() {  }

  irParaLogin() {
    this.storage.set('introducaoVista', true);
    this.navCtrl.push(LoginCadastroPage);
    this.navCtrl.setRoot(LoginCadastroPage);
  }

  ultimoSlide() {
    return this.slidesIntro.isEnd();
  }

  avancaParaUltimo() {
    return this.slidesIntro.slideTo(8);
  }

  avancaSlide() {
    this.slidesIntro.slideNext();
  }

  retornaSlide() {
    this.slidesIntro.slideTo(0);
  }

}
