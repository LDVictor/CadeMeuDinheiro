import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Pagamento } from '../../models/pagamento';
import { PagamentoServiceProvider } from '../../providers/pagamento-service/pagamento-service';
import { EditaPagamentoPage } from '../edita-pagamento/edita-pagamento';
import { AdicionaPagamentoPage } from '../adiciona-pagamento/adiciona-pagamento';
import { AuthProvider } from '../../providers/auth/auth';
import { ImageViewerController } from 'ionic-img-viewer';
import { NotificationProvider } from '../../providers/notification/notification';
import { Usuario } from '../../models/usuario';
import { Financa } from '../../models/financa';
import { Verificacao } from '../../models/VerificacaoEnum';
import { FinancaServiceProvider } from '../../providers/financa-service/financa-service';
import { RealizaPagamentoPage } from '../realiza-pagamento/realiza-pagamento';

/**
 * Generated class for the PagamentosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pagamentos',
  templateUrl: 'pagamentos.html',
})
export class PagamentosPage {

  public usuario = {} as Usuario;
  public financa = {} as Financa;
  private pagamentos: Pagamento[] = [];
  private hoje = new Date();

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public pagamentoService: PagamentoServiceProvider,
    public auth: AuthProvider,
    public imageViewerCtrl: ImageViewerController,
    public notificacao: NotificationProvider,
    public authService: AuthProvider,
    public toastCtrl: ToastController,
    public financaService: FinancaServiceProvider) {
      authService.getUsuario().subscribe(res =>{
        this.usuario = res as Usuario;
      });
  }

  ionViewWillEnter() {
    this.carregaPagamentosFB();
  }

  private abreToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  carregaPagamentosFB() {
    this.pagamentoService.recebePagamentosFB()
      .then(pagamentos => {
        this.pagamentos = pagamentos as Pagamento[];
        this.verificaPagamentos();
      });
  }

  private verificaPagamentos() {
    const proxDeVencer = this.pagamentos
      .filter(p => this.venceHoje(new Date(p.data)));

    this.notifica(proxDeVencer.length);
  }

  private venceHoje(data: Date) {
    const hoje = this.hoje.toISOString().slice(0, 10);
    const prazo = data.toISOString().slice(0, 10);
    return hoje === prazo;
  }

  private notifica(pagamentos: number) {
    const titulo = "Pagamentos a se vencer"
    const msg = this.criaMensagem(pagamentos);
    this.auth.getUserId()
      .then(userId => {
        this.notificacao.enviarNotificacao(userId, titulo, msg);
      })
  }

  private criaMensagem(pagamentos: number) {
    if (pagamentos > 1) {
      return pagamentos + " pagamento se vence hoje"
    } else {
      return pagamentos + " pagamentos se vencem hoje"
    }
  }

  modalAdicionaPagamento() {
    this.navCtrl.push(AdicionaPagamentoPage);
  }

  modalEditaPagamento(pagamento: Pagamento) {
    this.navCtrl.push(EditaPagamentoPage, pagamento);
  }

  modalRealizaPagamento() {
    this.navCtrl.push(RealizaPagamentoPage);
  }

  removePagamento(pagamento: Pagamento) {
    let alert = this.alertCtrl.create({
      title: "Excluir pagamento",
      message: "Você tem certeza que deseja excluir este pagamento?"
        + "\n\n" + "Todas as informações serão deletadas.",
      buttons: [{
        text: 'Cancelar',
        handler: () => { }
      },
      {
        text: 'Excluir',
        handler: () => {
          this.pagamentoService.removePagamentoFB(pagamento)
            .then(_ => {
              this.pagamentos = this.pagamentos.filter(pag => pag.key !== pagamento.key);
            })
        }
      }

      ]
    });
    alert.present();
  }

  fechaPagamento(pagamento: Pagamento) {
    let alert = this.alertCtrl.create({
      title: "Finalizar pagamento",
      message: "Você tem certeza que deseja concluir este pagamento?"
        + "\n\n" + "Confirme apenas se já tiver pago. O pagamento será incluído em suas estatísticas.",
      buttons: [{
        text: 'Cancelar',
        handler: () => { }
      },
      {
        text: 'Concluir',
        handler: () => {
            this.financa = {
              ...this.financa,
              ehDebito: true,
              descricao: "Pagamento de " + pagamento.nomeDoFiador,
              valor: pagamento.valor,
              data: pagamento.data,
              categoria: "Dívida",
              verificacao: Verificacao.Confirmado,
              usuarioCriador: this.usuario.username
            };
            this.financaService.adicionaFinancaEmUsuarioFB(this.financa.usuarioCriador, this.financa).then(_ => {
              this.authService.incrementarNumPagamentos(this.usuario.numPagamentos);
              this.pagamentoService.removePagamentoFB(pagamento)
                .then(_ => {
                  this.pagamentos = this.pagamentos.filter(pag => pag.key !== pagamento.key);
                })
              this.abreToast("Pagamento concluído.");
            })
        }
      }

      ]
    });
    alert.present();
  }

  getTextoData(pagamento: Pagamento) {
    var options = { weekday: "long", month: 'long', day: '2-digit' };
    let dataSeparada = pagamento.data.toString().split("-");
    let ano = Number(dataSeparada[0]);
    let mes = Number(dataSeparada[1]) - 1;
    let dia = Number(dataSeparada[2]);
    let dataAjustada = new Date(ano, mes, dia);
    return dataAjustada.toLocaleDateString("pt-br", options);
  }

  filtraPagamentos(pagamentos: Pagamento[]) {
    var pagamentosFiltrados: Pagamento[] = [];

    for (var i = 0; i < pagamentos.length; i++) {
      var dataFinancaAtual = new Date(pagamentos[i].data);
      if (dataFinancaAtual >= this.hoje) {
        pagamentosFiltrados.push(pagamentos[i]);
      }
    }
    return pagamentosFiltrados;
  }

  filtraPagamentosAtrasados(pagamentos: Pagamento[]) {
    var pagamentosFiltrados: Pagamento[] = [];

    for (var i = 0; i < pagamentos.length; i++) {
      var dataFinancaAtual = new Date(pagamentos[i].data);
      if (dataFinancaAtual < this.hoje) {
        pagamentosFiltrados.push(pagamentos[i]);
      }
    }
    return pagamentosFiltrados;
  }


  existePagamento() {
    return this.filtraPagamentos(this.pagamentos).length > 0;
  }

  temPagamentosAtrasados() {
    return this.filtraPagamentosAtrasados(this.pagamentos).length > 0;
  }

  abreFoto(foto) {
    const imageViewer = this.imageViewerCtrl.create(foto);
    imageViewer.present();
  }

  existeFoto(pagamento) {
    return !(pagamento.imagem == null) && !(pagamento.imagem === "") && !(pagamento.imagem === "nnn");
  }

  formataValor(valor: number) {
    return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
  }

}
