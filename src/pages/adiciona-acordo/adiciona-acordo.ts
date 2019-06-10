import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Acordo } from '../../models/acordo';
import { Divida } from '../../models/divida';
import { AcordoServiceProvider } from '../../providers/acordo-service/acordo-service';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the AdicionaAcordoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adiciona-acordo',
  templateUrl: 'adiciona-acordo.html',
})
export class AdicionaAcordoPage {

  public acordo = {} as Acordo;
  public divida = {} as Divida;

  dataVazia = false;
  horaVazia = false;
  localVazio = false;
  descricaoVazia = false;
  tipo: string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public toastCtrl: ToastController, 
    public acordoService: AcordoServiceProvider,
    public statusBar: StatusBar) {
    
    
  }

  ionViewDidLoad() {  }

  ionViewWillEnter() {
    this.divida = this.navParams.data[0] as Divida;
    this.tipo = this.navParams.data[1];
    this.statusBar.backgroundColorByHexString("#006400");
  }

  adicionaAcordo() {
    if (!this.confirmaDados()) {
      this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
    } else {
      this.acordoService.adicionaAcordo(this.divida, this.acordo, this.tipo).then(_ => {
        this.navCtrl.pop();
        this.abrirToast(`O acordo adicionado.`);
      }).catch(err => {
        this.abrirToast("Ocorreu um erro ao tentar adicionar o acordo! :(");
      });
    }
  }

  private abrirToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  private confirmaDados() {
    this.dataVazia = this.acordo.data == null;
    this.horaVazia = this.acordo.hora == null;
    this.descricaoVazia = this.acordo.descricao == "" || this.acordo.descricao == null;
    this.localVazio = this.acordo.local == "" || this.acordo.local == null;
    return !this.dataVazia && !this.horaVazia && !this.descricaoVazia &&
      !this.localVazio;
  }

}
