import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Pagamento } from '../../models/pagamento';
import { StatusBar } from '@ionic-native/status-bar';
import { AuthProvider } from '../../providers/auth/auth';
import { PagamentoServiceProvider } from '../../providers/pagamento-service/pagamento-service';

/**
 * Generated class for the EditaPagamentoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edita-pagamento',
  templateUrl: 'edita-pagamento.html',
})
export class EditaPagamentoPage {

  public pagamento = {} as Pagamento;
  
  valorInvalido = false;
  valorVazio = false;
  descricaoVazia = false;
  nomeVazio = false;
  dataVazia = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController, 
    public statusBar: StatusBar,
    public authService: AuthProvider,
    public alertCtrl: AlertController,
    public pagamentoService: PagamentoServiceProvider) {
      this.pagamento = this.navParams.data;
  }

  ionViewDidLoad() {
    this.navParams.data.valor = this.pagamentoService.formataValor(this.pagamento.valor);
  }

  private abrirToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  public editaPagamento() {
    if (!this.confirmaDados()) {
      this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
    }
    else {
      this.pagamentoService.editaPagamentoFB(this.pagamento)
    .then(_ => {
      this.navCtrl.pop();
      this.abrirToast("Pagamento editado.");
    });
  }
}

private confirmaDados() {
  this.valorInvalido = this.pagamento.valor <= 0;
  this.valorVazio = this.pagamento.valor == null;
  this.dataVazia = this.pagamento.data == null;
  this.descricaoVazia = this.pagamento.descricao == "" || this.pagamento.descricao == null;
  this.nomeVazio = this.pagamento.nomeDoFiador == "" || this.pagamento.nomeDoFiador == null;
  return !this.valorInvalido && !this.valorVazio && !this.dataVazia && !this.descricaoVazia && !this.nomeVazio;
}

}
