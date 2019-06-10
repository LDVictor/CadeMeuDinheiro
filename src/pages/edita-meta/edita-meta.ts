import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { MetaGasto } from '../../models/meta';
import { AuthProvider } from '../../providers/auth/auth';
import { MetaServiceProvider } from '../../providers/meta-service/meta-service';

/**
 * Generated class for the EditaMetaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edita-meta',
  templateUrl: 'edita-meta.html',
})
export class EditaMetaPage {

  public meta = {} as MetaGasto;

  //booleans de verificação
  limiteInvalido = false;
  limiteVazio = false;
  categoriaVazia = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, public authService: AuthProvider,
    public metaService: MetaServiceProvider
  ) {
    this.meta = this.navParams.data;
  }

  ionViewDidLoad() {
    this.navParams.data.limite = this.metaService.formataValor(this.meta.limite);
  }

  private abrirToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }


  public editaMeta() {
    // TODO: remover depois de adicionar os campos
    // categoria e ehDebito ao form de criação de financas
    if (!this.confirmaDados()) {
      this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
    }
    else {
      this.metaService.editaMetaFB(this.meta)
        .then(_ => {
          this.navCtrl.pop();
        })
    }
  }

  private confirmaDados() {
    this.limiteInvalido = this.meta.limite <= 0;
    this.limiteVazio = this.meta.limite == null;
    this.categoriaVazia = this.meta.categoria == null;
    return !this.limiteInvalido && !this.limiteVazio &&
      !this.categoriaVazia;
  }

}
