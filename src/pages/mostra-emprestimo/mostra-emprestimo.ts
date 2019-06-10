import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Divida } from '../../models/divida';
import { DividaServiceProvider } from '../../providers/divida-service/divida-service';
import { EditaEmprestimoPage } from '../edita-emprestimo/edita-emprestimo';
import { StatusBar } from '@ionic-native/status-bar';
import { AdicionaAcordoPage } from '../adiciona-acordo/adiciona-acordo';
import { Acordo } from '../../models/acordo';
import { AcordoServiceProvider } from '../../providers/acordo-service/acordo-service';
import { EditaAcordoPage } from '../edita-acordo/edita-acordo';
import { Financa } from '../../models/financa';
import { FinancaServiceProvider } from '../../providers/financa-service/financa-service';
import { AuthProvider } from '../../providers/auth/auth';
import { Verificacao } from '../../models/VerificacaoEnum';


@IonicPage()
@Component({
  selector: 'page-mostra-emprestimo',
  templateUrl: 'mostra-emprestimo.html',
})
export class MostraEmprestimoPage {

  public emprestimo = {} as Divida;
  public financa: Financa;

  criadorEmprestimo: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public emprestimoService: DividaServiceProvider,
    public toastController: ToastController,
    public alertController: AlertController,
    public statusBar: StatusBar,
    public authService: AuthProvider,
    public acordoService: AcordoServiceProvider,
    public financaService: FinancaServiceProvider
  ) {
    this.emprestimo = this.navParams.data;
  }

  private abreToast(text) {
    let toast = this.toastController.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  formataValor(valor: number) {
    return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
  }

  existeAcordo() {
    return this.emprestimo.acordos !== undefined && this.emprestimo.acordos.length > 0;
  }

  editarAcordo(acordo: Acordo) {
    this.navCtrl.push(EditaAcordoPage, [this.emprestimo, acordo, "emprestimo"]);
  }

  fechaEmprestimo(emprestimo: Divida) {
    this.emprestimo.aberta = false;
    this.emprestimoService.editaDividaEmprestimoFB(this.emprestimo).then(_ => {
      this.financa = {
        ...this.financa,
        ehDebito: false,
        descricao: "Empréstimo para " + this.emprestimo.nomeUsuarioDevedor,
        valor: this.emprestimo.valor,
        data: this.emprestimo.data,
        categoria: "Empréstimo",
        verificacao: Verificacao.Confirmado,
        usuarioCriador: this.emprestimo.usuarioCriador
      };
      this.financaService.adicionaFinancaEmUsuarioFB(this.financa.usuarioCriador, this.financa).then(_ => {
        this.navCtrl.pop();
        this.abreToast("Empréstimo concluído.");
      })
    }).catch(err => {
      this.abreToast("Erro ao tentar fechar empréstimo.");
      this.emprestimo.aberta = true;
    });
  }

  deletaEmprestimo(emprestimo: Divida) {
    let alert = this.alertController.create({
      title: "Excluir empréstimo",
      message: "Você tem certeza que deseja excluir este empréstimo?"
        + "\n\n" + "Todas as informações serão deletadas.",
      buttons: [{
        text: 'Cancelar',
        handler: () => { }
      },
      {
        text: 'Excluir',
        handler: () => {
          this.emprestimoService.removeEmprestimoFB(emprestimo);
          this.navCtrl.pop();
          this.abreToast("Empréstimo removido.");
        }
      }

      ]
    });
    alert.present();
  }

  modalAdicionaAcordo() {
    this.navCtrl.push(AdicionaAcordoPage, [this.emprestimo, "emprestimo"]);
  }

  fecharAcordo(acordo: Acordo) {
    this.acordoService.fechaAcordo(this.emprestimo, acordo, "emprestimo");
  }

  modalEditaEmprestimo(emprestimo: Divida) {
    this.navCtrl.push(EditaEmprestimoPage, emprestimo);
  }

  getTextoData() {
    var options = { weekday: "long", month: 'long', day: '2-digit' };
    let dataSeparada = this.emprestimo.data.toString().split("-");
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
      this.criadorEmprestimo = username === this.emprestimo.usuarioCriador;
    });
    return this.criadorEmprestimo;
  }
  
}
