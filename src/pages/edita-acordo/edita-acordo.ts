import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Acordo } from '../../models/acordo';
import { Divida } from '../../models/divida';
import { AcordoServiceProvider } from '../../providers/acordo-service/acordo-service';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the EditaAcordoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edita-acordo',
  templateUrl: 'edita-acordo.html',
})
export class EditaAcordoPage {

  public acordo = {} as Acordo;
  public divida = {} as Divida;
  public tipo: string;

  dataVazia = false;
  horaVazia = false;
  localVazio = false;
  descricaoVazia = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public toastCtrl: ToastController, 
    public acordoService: AcordoServiceProvider,
    public statusBar: StatusBar) {
    this.divida = this.navParams.data[0];
    this.acordo = this.navParams.data[1];
    this.tipo = this.navParams.data[2];
  }

  ionViewDidLoad() {  }

  ionViewWillEnter() {
    this.statusBar.backgroundColorByHexString("#006400");
  }

  editaAcordo() {
    if (!this.confirmaDados()) {
      this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
    } else {
      this.acordoService.editaAcordo(this.divida, this.acordo, this.tipo).then(_ => {
        this.navCtrl.pop();
        this.abrirToast(`O acordo foi editado.`);
      }).catch(err => {
        this.abrirToast("Ocorreu um erro ao tentar editar o acordo! :(");
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
