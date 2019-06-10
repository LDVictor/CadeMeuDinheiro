import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Dinheiro } from '../../models/dinheiro';
import { Cartao } from '../../models/cartao';
import { AuthProvider } from '../../providers/auth/auth';
import { Usuario } from '../../models/usuario';
import Utils from '../../Helper/Utils';

/**
 * Generated class for the AdicionaDinheiroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adiciona-dinheiro',
  templateUrl: 'adiciona-dinheiro.html',
})
export class AdicionaDinheiroPage {

  public usuario = {} as Usuario;
  public dinheiro = {} as Dinheiro;
  public cartao = {} as Cartao;

  //booleans de Verificacao
  public valorVazio = false;
  public nomeTitularVazio = false;
  public numeroCartaoVazio = false;
  public dataVencimentoVazia = false;
  public codigoSegurancaVazio = false;
  public numeroCartaoInvalido = false;
  public codigoSegurancaInvalido = false;


  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public authProvider: AuthProvider, public alertCtrl: AlertController) {
    this.usuario = this.navParams.data;
    if (this.usuario.cartao.numeroCartao != null) {
      this.cartao.nomeTitular = this.usuario.cartao.nomeTitular;
      this.cartao.numeroCartao = this.usuario.cartao.numeroCartao;
      this.cartao.dataVencimento = this.usuario.cartao.dataVencimento;
      this.cartao.codigoSeguranca = this.usuario.cartao.codigoSeguranca;
    }
  }

  public adicionaDinheiro() {
    if (!this.confirmaDados()) {
      this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
    } else if (this.dinheiro.valor < 0) {
            this.abrirToast("Ops! Você não pode adicionar um valor negativo.");
        } else {
          this.dinheiro.cartao = this.cartao;
          let alert = this.alertCtrl.create({
            title: "Salvar dados do cartão",
            message: "Deseja manter os dados do seu cartão salvos para futuras transações? ",
            buttons: [{
              text: 'Sim',
              handler: () => {                
                this.authProvider.salvarCartaoUsuario(this.dinheiro.cartao).then(result => {
                  this.abrirToast("Cartão salvo.");
                });
                this.adicionaDinheiroAux();
              }
            },
            {
              text: 'Não',
              handler: () => {
                this.adicionaDinheiroAux();
              }
            }
            ]
          });
          alert.present();
        }
      }

      public adicionaDinheiroAux() {
        const valorDinheiro = Utils.formataValorFB(this.dinheiro.valor);
        this.authProvider.salvarCarteiraUsuario(valorDinheiro, this.usuario.carteira).then(result => {
          this.navCtrl.pop();
          this.abrirToast("Transação autorizada.");
        })
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
        this.valorVazio = this.dinheiro.valor <= 0;
        this.nomeTitularVazio = this.cartao.nomeTitular == null;
        this.numeroCartaoVazio = this.cartao.numeroCartao == null;
        this.dataVencimentoVazia = this.cartao.dataVencimento == null;
        this.numeroCartaoInvalido = this.cartao.numeroCartao.toString().length != 16 && !this.numeroCartaoVazio;
        this.codigoSegurancaVazio = this.cartao.codigoSeguranca == null;   
        this.codigoSegurancaInvalido = this.cartao.codigoSeguranca.toString().length != 3 && !this.codigoSegurancaVazio;
        

        return !this.valorVazio && !this.nomeTitularVazio && !this.numeroCartaoVazio && !this.dataVencimentoVazia
                && !this.codigoSegurancaVazio && !this.numeroCartaoInvalido && !this.codigoSegurancaInvalido; 
      }

    }