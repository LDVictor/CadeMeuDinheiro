import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { AuthProvider } from '../../providers/auth/auth';
import { FinancaServiceProvider } from '../../providers/financa-service/financa-service';
import { Financa } from '../../models/financa';

@IonicPage()
@Component({
  selector: 'page-edita-financa',
  templateUrl: 'edita-financa.html',
})
export class EditaFinancaPage {

  public financa = {} as Financa;
  public tipoFinanca = "";

  valorInvalido = false;
  valorVazio = false;
  descricaoVazia = false;
  dataVazia = false;
  categoriaVazia = false;
  tipoVazio = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public statusBar: StatusBar,
    public authService: AuthProvider,
    public alertCtrl: AlertController,
    public financaService: FinancaServiceProvider) {
    this.financa = this.navParams.data;
    this.tipoFinanca = this.financa.ehDebito == true ? "debito" : "credito";
  }

  ionViewDidEnter() {
    this.navParams.data.valor = this.financaService.formataValor(this.financa.valor);
  }

  private abrirToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  editaFinanca() {
    if (!this.confirmaDados()) {
      this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
    }
    else {
      if (this.tipoFinanca === "debito") {
        this.financa = {
          ...this.financa,
          ehDebito: true
        };
      }
      else {
        this.financa = {
          ...this.financa,
          ehDebito: false
        };
      }


      this.financaService.editaFinancaFB(this.financa)
        .then(_ => {
          this.navCtrl.pop();
        })
    }
  }

  private confirmaDados() {
    this.valorInvalido = this.financa.valor <= 0;
    this.valorVazio = this.financa.valor == null;
    this.dataVazia = this.financa.data == null;
    this.categoriaVazia = this.financa.categoria == null;
    this.descricaoVazia = this.financa.descricao == "" || this.financa.descricao == null;
    this.tipoVazio = this.tipoFinanca == "" || this.tipoFinanca == null;
    return !this.valorInvalido && !this.valorVazio &&
      !this.dataVazia && !this.descricaoVazia &&
      !this.categoriaVazia && !this.tipoVazio;
  }




}
