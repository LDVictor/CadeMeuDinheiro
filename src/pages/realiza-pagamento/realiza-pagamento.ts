import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the RealizaPagamentoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-realiza-pagamento',
  templateUrl: 'realiza-pagamento.html',
})
export class RealizaPagamentoPage {

  public codigoDeBarras: number;
  public descricao: string;

  public codigoVazio = false;
  public codigoInvalido = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public authService: AuthProvider) {
  }

  private abrirToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  public realizaPagamento() {
    if (!this.confirmaDados()) {
      this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
    }
    else {
      this.navCtrl.pop();
      this.abrirToast("Pagamento realizado.");
  }
}

/*realizaPagamentoAux() {
  let usuario = this.authService.getUsuarioUser();
  console.log(divida.valor);
  console.log(usuario.carteira);
  if (divida.valor > usuario.carteira) {
    this.abreToast("Ops! Você não tem dinheiro suficiente.");
  }
  else {
    let alert = this.alertCtrl.create({
      title: "Pagar dívida",
      message: "Deseja pagar essa dívida com seu dinheiro da carteira? ",
      buttons: [{
        text: 'Sim',
        handler: () => {
          this.authService.decrementaCarteira(usuario.carteira, divida.valor);
          this.abreToast("Pagamento efetuado.");
          this.fechaDivida(divida);
        }
      },
      {
        text: 'Não',
        handler: () => {
        }
      }
      ]
    });
    alert.present();
  }
} */

  ionViewDidLoad() {
    console.log('ionViewDidLoad RealizaPagamentoPage');
  }

  public confirmaDados() {
    this.codigoVazio = this.codigoDeBarras == null;
    this.codigoInvalido = this.codigoDeBarras.toString().length != 20;

    return !this.codigoVazio && !this.codigoInvalido;
  }

}
