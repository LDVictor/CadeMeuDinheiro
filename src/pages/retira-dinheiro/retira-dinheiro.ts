import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Usuario } from '../../models/usuario';
import Utils from '../../Helper/Utils';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the RetiraDinheiroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-retira-dinheiro',
  templateUrl: 'retira-dinheiro.html',
})
export class RetiraDinheiroPage {

  public usuario = {} as Usuario;
  public valor: number;
  public codigoBanco: number;
  public numeroAgencia: number;
  public numeroConta: number;

    //booleans de Verificacao
    public valorVazio = false;
    public valorNegativo = false;
    public valorMaiorQueCarteira = false;
    public codigoBancoVazio = false;
    public codigoBancoInvalido = false;
    public numeroAgenciaVazio = false;
    public numeroAgenciaInvalido = false;
    public numeroContaVazio = false;
    public numeroContaInvalido = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController, public authProvider: AuthProvider) {
    this.usuario = this.navParams.data;
  }
  private abrirToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  public retiraDinheiro() {
    if (!this.confirmaDados()) {
      this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
    }
      else {
          let alert = this.alertCtrl.create({
            title: "Transferir dinheiro",
            message: "Deseja transferir o valor para sua conta? O dinheiro levará em torno de 3 dias úteis para ser transferido.",
            buttons: [{
              text: 'Sim',
              handler: () => {                
                const valorDinheiro = Utils.formataValorFB(this.valor);
                this.authProvider.salvarCarteiraUsuario(-valorDinheiro, this.usuario.carteira).then(result => {
                  this.navCtrl.pop();
                  this.abrirToast("Transferência realizada.");
                })
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
      }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RetiraDinheiroPage');
  }

  private confirmaDados() {
    this.valorVazio = this.valor == null;
    this.valorNegativo = this.valor <= 0;
    this.valorMaiorQueCarteira = this.valor > this.usuario.carteira;
    this.codigoBancoVazio = this.codigoBanco == null;
    this.codigoBancoInvalido = this.codigoBanco.toString().length > 3 && !this.codigoBancoVazio;
    this.numeroAgenciaVazio = this.numeroAgencia == null;
    this.numeroAgenciaInvalido = (this.numeroAgencia.toString().length > 6 || this.numeroAgencia.toString().length < 4) && !this.numeroAgenciaVazio;
    this.numeroContaVazio = this.numeroConta == null;
    this.numeroContaInvalido = (this.numeroConta.toString().length > 12 || this.numeroConta.toString().length < 6) && !this.numeroContaVazio;

    return !this.valorVazio && !this.valorNegativo && !this.valorMaiorQueCarteira && !this.codigoBancoVazio && !this.codigoBancoInvalido
            && !this.numeroAgenciaVazio && !this.numeroAgenciaInvalido && !this.numeroContaVazio && !this.numeroContaInvalido; 
  }


}
