import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { DividaServiceProvider } from '../../providers/divida-service/divida-service';
import { Divida } from '../../models/divida';
import { EditaDividaPage } from '../edita-divida/edita-divida';
import { StatusBar } from '@ionic-native/status-bar';
import { AdicionaAcordoPage } from '../adiciona-acordo/adiciona-acordo';
import { Acordo } from '../../models/acordo';
import { AcordoServiceProvider } from '../../providers/acordo-service/acordo-service';
import { EditaAcordoPage } from '../edita-acordo/edita-acordo';
import { FinancaServiceProvider } from '../../providers/financa-service/financa-service';
import { Financa } from '../../models/financa';
import { AuthProvider } from '../../providers/auth/auth';
import { Verificacao } from '../../models/VerificacaoEnum';

@IonicPage()
@Component({
  selector: 'page-mostra-divida',
  templateUrl: 'mostra-divida.html',
})
export class MostraDividaPage {

  public divida = {} as Divida;
  public financa: Financa;

  dividaLocal: boolean = false;
  criadorDivida: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dividaService: DividaServiceProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public statusBar: StatusBar,
    public authService: AuthProvider,
    public acordoService: AcordoServiceProvider,
    public financaService: FinancaServiceProvider
  ) {
    this.divida = this.navParams.data;
    this.dividaLocal = this.divida.usuarioEmprestador == null;
  }

  private abreToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  existeAcordo() {
    return this.divida.acordos !== undefined && this.divida.acordos.length > 0;
  }

  editarAcordo(acordo: Acordo) {
    this.navCtrl.push(EditaAcordoPage, [this.divida, acordo, "divida"]);
  }

  pagaDivida(divida: Divida) {
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
  }

  fechaDivida(divida: Divida) {
    this.divida.aberta = false;
    this.dividaService.editaDividaEmprestimoFB(this.divida).then(_ => {
      this.financa = {
        ...this.financa,
        ehDebito: true,
        descricao: "Dívida com " + this.divida.nomeUsuarioEmprestador,
        valor: this.divida.valor,
        data: this.divida.data,
        categoria: "Dívida",
        verificacao: Verificacao.Confirmado,
        usuarioCriador: this.divida.usuarioCriador
      };
      this.financaService.adicionaFinancaEmUsuarioFB(this.financa.usuarioCriador, this.financa).then(_ => {
        this.navCtrl.pop();
        this.abreToast("Dívida concluída.");
      })
    }).catch(err => {
      this.abreToast("Erro ao tentar fechar dívida.");
      this.divida.aberta = true;
    });
  }

  formataValor(valor: number) {
    return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
  }

  deletaDivida(divida: Divida) {
    let alert = this.alertCtrl.create({
      title: "Excluir dívida",
      message: "Você tem certeza que deseja excluir esta dívida?"
        + "\n\n" + "Todas as informações serão deletadas.",
      buttons: [{
        text: 'Cancelar',
        handler: () => { }
      },
      {
        text: 'Excluir',
        handler: () => {
          this.apagaDivida(divida);
        }
      }

      ]
    });
    alert.present();
  }

  apagaDivida(divida: Divida) {
    this.dividaService.removeDividaFB(divida);
    this.navCtrl.pop();
    this.abreToast("Dívida removida.");
  }

  fecharAcordo(acordo: Acordo) {
    this.acordoService.fechaAcordo(this.divida, acordo, "divida");
  }

  modalAdicionaAcordo() {
    this.navCtrl.push(AdicionaAcordoPage, [this.divida, "divida"]);
  }

  modalEditaDivida(divida: Divida) {
    this.navCtrl.push(EditaDividaPage, divida);
  }

  getData(divida: Divida) {
    return divida.data.toLocaleString("pt-BR");
  }

  getTextoData() {
    var options = { weekday: "long", month: 'long', day: '2-digit' };
    let dataSeparada = this.divida.data.toString().split("-");
    let ano = Number(dataSeparada[0]);
    let mes = Number(dataSeparada[1]) - 1;
    let dia = Number(dataSeparada[2]);
    let dataAjustada = new Date(ano, mes, dia);
    return dataAjustada.toLocaleDateString("pt-br", options);
  }

  getTextoDataAcordo(dataAcordo) {
    var options = { weekday: "long", month: 'long', day: '2-digit' };
    let dataSeparada = dataAcordo.toString().split("-");
    let ano = Number(dataSeparada[0]);
    let mes = Number(dataSeparada[1]) - 1;
    let dia = Number(dataSeparada[2]);
    let dataAjustada = new Date(ano, mes, dia);
    return dataAjustada.toLocaleDateString("pt-br", options);
  }

  ehCriador() {
    this.authService.getUsername().then(username => {
      this.criadorDivida = username === this.divida.usuarioCriador;
    });
    return this.criadorDivida;
  }
  
}
