import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { DividaServiceProvider } from '../../providers/divida-service/divida-service';
import { Divida } from '../../models/divida';
import { Financa } from '../../models/financa';
import { FinancaServiceProvider } from '../../providers/financa-service/financa-service';
import { Verificacao } from '../../models/VerificacaoEnum';
import { HomePage } from '../home/home';

/**
 * Generated class for the PagaDividaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-paga-divida',
  templateUrl: 'paga-divida.html',
})
export class PagaDividaPage {

  public divida = {} as Divida;
  public financa: Financa;
  
  parcial;

  nomeVazio = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dividaService: DividaServiceProvider,
    public toastCtrl: ToastController,
    public financaService: FinancaServiceProvider
  ) {
      this.divida = this.navParams.data;
  }

  ionViewDidEnter() {
    this.parcial = this.dividaService.formataValor(this.divida.valor - this.divida.valorParcial);
  }

  private abrirToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  pagaDivida() {
    if (this.formataValorFB(this.parcial) > (this.divida.valor - this.divida.valorParcial)) {
      this.abrirToast("Ops... Pagamento maior que o valor total da dívida");
    } else if (this.formataValorFB(this.parcial) == (this.divida.valor - this.divida.valorParcial)) {
      this.divida.valorParcial += this.formataValorFB(this.parcial);
      this.fechaDivida(this.divida);
    } else {
      console.log(this.divida.valor)
      console.log(this.parcial)
      this.divida.valorParcial += this.formataValorFB(this.parcial);
      this.atualizaDividaFB();
    }
  }

  atualizaDividaFB() {
    this.dividaService.editaDividaEmprestimoFB(this.divida).then(_ => {
      this.navCtrl.pop();
      this.abrirToast("Dívida parcialmente paga.");
    }).catch(err => {
      this.abrirToast("Ops... Ocorreu algum erro!");
    })
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
        this.navCtrl.push(HomePage);
        this.abrirToast("Dívida concluída.");
      })
    }).catch(err => {
      this.abrirToast("Erro ao tentar fechar dívida.");
      this.divida.aberta = true;
    });
  }

  formataValorFB(valorV: number) {
    let valor = String(valorV);
    while (valor.includes(".")) {
      valor = valor.replace(".", "");
    }
    return Number(valor.replace(",", "."));
  }


}
