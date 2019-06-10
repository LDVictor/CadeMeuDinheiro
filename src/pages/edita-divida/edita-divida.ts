import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { DividaServiceProvider } from '../../providers/divida-service/divida-service';
import { Divida } from '../../models/divida';

@IonicPage()
@Component({
  selector: 'page-edita-divida',
  templateUrl: 'edita-divida.html',
})
export class EditaDividaPage {

  public divida = {} as Divida;

  nomeVazio = false;
  valorInvalido = false;
  valorVazio = false;
  dataVazia = false;
  descricaoVazia = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dividaService: DividaServiceProvider,
    public toastCtrl: ToastController) {
      this.divida = this.navParams.data;
  }

  ionViewDidEnter() {
    this.navParams.data.valor = this.dividaService.formataValor(this.divida.valor);
  }

  private abrirToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  editaDivida() {
    if (!this.confirmaDados()) {
      this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
    } else {
      this.atualizaDividaFB();
    }
  }

  atualizaDividaFB() {
    this.dividaService.editaDividaEmprestimoFB(this.divida).then(_ => {
      this.navCtrl.pop();
      this.abrirToast("Dívida editada.");
    }).catch(err => {
      this.abrirToast("Ops... Ocorreu algum erro!");
    })
  }

  private confirmaDados() {
    this.nomeVazio = this.divida.nomeUsuarioDevedor == "" || this.divida.nomeUsuarioDevedor == null;
    this.valorInvalido = this.divida.valor <= 0;
    this.valorVazio = this.divida.valor == null;
    this.dataVazia = this.divida.data == null;
    this.descricaoVazia = this.divida.descricao == "" || this.divida.descricao == null;
    return !this.valorInvalido && !this.nomeVazio && !this.valorVazio &&
      !this.dataVazia && !this.descricaoVazia;
  }

}
