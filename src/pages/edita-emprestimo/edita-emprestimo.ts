import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { DividaServiceProvider } from '../../providers/divida-service/divida-service';
import { Divida } from '../../models/divida';

@IonicPage()
@Component({
  selector: 'page-edita-emprestimo',
  templateUrl: 'edita-emprestimo.html',
})
export class EditaEmprestimoPage {

  public emprestimo = {} as Divida;

  nomeVazio = false;
  valorInvalido = false;
  valorVazio = false;
  dataVazia = false;
  descricaoVazia = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastController: ToastController,
    public emprestimoService: DividaServiceProvider) {
      this.emprestimo = this.navParams.data;
  }

  ionViewDidEnter() {
    this.navParams.data.valor = this.emprestimoService.formataValor(this.emprestimo.valor);
  }

  private abrirToast(text) {
    let toast = this.toastController.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  editaEmprestimo() {
    if (!this.confirmaDados()) {
      this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
    } else {
      this.atualizaEmprestimoFB();
    }
  }

  atualizaEmprestimoFB() {
    this.emprestimoService.editaDividaEmprestimoFB(this.emprestimo).then(_ => {
      this.navCtrl.pop();
      this.abrirToast("Empréstimo editado.");
    }).catch(err => {
      this.abrirToast("Ops... Ocorreu algum erro!");
    })
  }

  private confirmaDados() {
    this.nomeVazio = this.emprestimo.nomeUsuarioDevedor == "" || this.emprestimo.nomeUsuarioDevedor == null;
    this.valorInvalido = this.emprestimo.valor <= 0;
    this.valorVazio = this.emprestimo.valor == null;
    this.dataVazia = this.emprestimo.data == null;
    this.descricaoVazia = this.emprestimo.descricao == "" || this.emprestimo.descricao == null;
    return !this.valorInvalido && !this.nomeVazio && !this.valorVazio &&
      !this.dataVazia && !this.descricaoVazia;
  }

}
