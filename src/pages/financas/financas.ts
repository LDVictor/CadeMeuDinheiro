import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Financa } from '../../models/financa';
import { AdicionaFinancaPage } from '../adiciona-financa/adiciona-financa';
import { EditaFinancaPage } from '../edita-financa/edita-financa';
import { FinancaServiceProvider } from '../../providers/financa-service/financa-service';
import { AdicionaMetaPage } from '../adiciona-meta/adiciona-meta';
import { MetaGasto } from '../../models/meta';
import { MetaServiceProvider } from '../../providers/meta-service/meta-service';
import { EditaMetaPage } from '../edita-meta/edita-meta';
import { Verificacao } from '../../models/VerificacaoEnum';
import { AuthProvider } from '../../providers/auth/auth';
import { map } from 'rxjs/operators';


@IonicPage()
@Component({
  selector: 'page-financas',
  templateUrl: 'financas.html',
})
export class FinancasPage {

  public financas: Financa[] = [];
  public financasPendentes: Financa[] = [];
  public metas: MetaGasto[] = [];

  // Mês Atual
  public hoje = new Date();
  public mesAtual = this.hoje.getMonth() + 1;

  // Mostrar financas mensal ou geral
  public selecionouFinancasGerais = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public financaService: FinancaServiceProvider,
    public metaService: MetaServiceProvider,
    public authService: AuthProvider,
    public alertCtrl: AlertController) {
    this.carregaFinancasFB();
    this.carregaMetasFB();
  }

  ionViewWillEnter() {
    this.carregaFinancasFB();
    this.carregaMetasFB();
  }

  carregaFinancasFB() {
    this.financaService.getFinancaListRef().snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.val();
          return { key: a.key, ...data };
        }))
      ).subscribe(financas => {
        financas = financas as Financa[];
        this.financas = this.filtraFinancasConfirmadas(financas);
        this.financasPendentes = this.filtraFinancasPendentes(financas);
      });
  }

  filtraFinancasPendentes(lista) {
    return lista.filter(x => x.verificacao === Verificacao.Pendente);
  }

  filtraFinancasConfirmadas(lista) {
    return this.filtraFinancas(lista.filter(x => x.verificacao === Verificacao.Confirmado));
  }

  carregaMetasFB() {
    this.metaService.recebeMetasFB()
      .then(metas => {
        this.metas = metas as MetaGasto[] || [];
      });
  }

  modalAdicionaFinanca() {
    this.navCtrl.push(AdicionaFinancaPage);
  }

  modalAdicionaMeta() {
    this.navCtrl.push(AdicionaMetaPage);
  }

  modalEditaFinanca(financa: Financa) {
    this.navCtrl.push(EditaFinancaPage, financa);
  }

  modalEditaMeta(meta: MetaGasto) {
    this.navCtrl.push(EditaMetaPage, meta);
  }

  removeFinanca(financa: Financa) {
    let alert = this.alertCtrl.create({
      title: "Excluir finança",
      message: "Você tem certeza que deseja excluir esta finança?"
        + "\n\n" + "Todas as informações serão deletadas.",
      buttons: [{
        text: 'Cancelar',
        handler: () => { }
      },
      {
        text: 'Excluir',
        handler: () => {
          this.financaService.removeFinancaFB(financa)
            .then(_ => {
              this.financas = this.financas.filter(fin => fin.key !== financa.key);
              this.metaService.debitaFinanca(financa);
            })
        }
      }

      ]
    });
    alert.present();
  }

  removeMeta(meta: MetaGasto) {
    let alert = this.alertCtrl.create({
      title: "Excluir meta",
      message: "Você tem certeza que deseja excluir esta meta?"
        + "\n\n" + "Todas as informações serão deletadas.",
      buttons: [{
        text: 'Cancelar',
        handler: () => { }
      },
      {
        text: 'Excluir',
        handler: () => {
          this.metaService.removeMetaFB(meta)
            .then(_ => {
              this.metas = this.metas
                .filter(met => met.key !== meta.key);
            })
        }
      }

      ]
    });
    alert.present();
  }

  existeFinanca() {
    return this.financas.length > 0;
  }

  existeMeta() {
    return this.metas.length > 0;
  }

  existeFinancaPendente() {
    return this.financasPendentes.length > 0;
  }

  public retornaSomaCredito(lista) {
    var soma = 0.0;
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].ehDebito == false) {
        soma += +lista[i].valor;
      }
    }
    return this.formataValor(soma);
  }

  public retornaSomaDebito(lista) {
    var soma = 0.0;
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].ehDebito == true) {
        soma += +lista[i].valor;
      }
    }
    return this.formataValor(soma);
  }

  formataValor(valor: number) {
    return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
  }

  public retornaCategoria(cat: string) {
    const categoria = {
      "alimentacao": "Alimentação",
      "vestuario": "Vestuário",
      "entretenimento": "Entretenimento",
      "bebida": "Bebida",
      "supermercado": "Supermercado",
      "transporte": "Transporte",
      "eletronicos": "Eletrônicos",
      "outros": "Outros"
    }
    return categoria[cat];
  }

  public getIcon(categoria: string) {
    switch(categoria) {
      case "alimentacao": return "pizza";
      case "vestuario": return "shirt";
      case "entretenimento": return "football";
      case "bebida": return "beer";
      case "supermercado": return "cart";
      case "transporte": return "car";
      case "eletronicos": return "phone-portrait";
      case "outros": return "grid";
      default: return 'cash';
    }
  }

  private createItemCardBtn(icon, color, title, action) {
    return { icon, color, title, action };
  }

  public getFinancaBtns(financa:Financa) {
    const showEditBtn = !(financa.categoria == 'Dívida' || financa.categoria == 'Empréstimo');

    const deleteBtn = this.createItemCardBtn('trash', 'corDivida', 'Excluir', () => this.removeFinanca(financa));
    const editBtn = this.createItemCardBtn('create', 'corEmprestimo', 'Editar', () => this.modalEditaFinanca(financa));           
    return showEditBtn ? [deleteBtn, editBtn] : [deleteBtn];
  }

  public getFinancaPendBtns(financa:Financa) {
    const rejectBtn = this.createItemCardBtn('close', 'corDivida', 'Rejeitar', () => this.rejeitaFinanca(financa));
    const acceptBtn = this.createItemCardBtn('checkmark', 'corPrimaria', 'Aceitar', () => this.aceitaFinanca(financa));           
    return this.podeAnalisarFinanca(financa) ? [rejectBtn, acceptBtn] : [];
  }

  public getMetaBtns(meta:MetaGasto) {
    const deleteBtn = this.createItemCardBtn('trash', 'corDivida', 'Excluir', () => this.removeMeta(meta));
    const editBtn = this.createItemCardBtn('create', 'corEmprestimo', 'Editar', () => this.modalEditaMeta(meta));           
    return [deleteBtn, editBtn];
  }

  public getMetaProgressClass(meta:MetaGasto) {
    if(this.retornaPorcentagemMeta(meta) <= 30) {
      return "financaCredito";
    } else if(this.retornaPorcentagemMeta(meta) <= 80) {
      return "classeMeta";
    } else {
      return "financaDebito";
    }
  }

  getTextoData(financa: Financa) {
    var options = { weekday: "long", month: 'long', day: '2-digit' };
    let dataSeparada = financa.data.toString().split("-");
    let ano = Number(dataSeparada[0]);
    let mes = Number(dataSeparada[1]) - 1;
    let dia = Number(dataSeparada[2]);
    let dataAjustada = new Date(ano, mes, dia);
    return dataAjustada.toLocaleDateString("pt-br", options);
  }

  filtraFinancas(financas: Financa[]) {
    if (this.selecionouFinancasGerais) {
      return financas;
    }
    else {
      var financasFiltradas: Financa[] = [];

      for (var i = 0; i < financas.length; i++) {
        var dataFinancaAtual = new Date(financas[i].data);
        if (dataFinancaAtual.getMonth() == this.mesAtual - 1) {
          financasFiltradas.push(financas[i]);
        }
      }
      return financasFiltradas;
    }
  }

  financasGerais(resposta) {
    if (resposta == "sim") {
      this.selecionouFinancasGerais = true;
      this.ionViewWillEnter();
    }
    else {
      this.selecionouFinancasGerais = false;
      this.ionViewWillEnter();
    }
  }

  public retornaNomeMes() {
    switch (this.mesAtual) {
      case 1: return "janeiro";
      case 2: return "fevereiro";
      case 3: return "março";
      case 4: return "abril";
      case 5: return "maio";
      case 6: return "junho";
      case 7: return "julho";
      case 8: return "agosto";
      case 9: return "setembro";
      case 10: return "outubro";
      case 11: return "novembro";
      default: return "dezembro";
    }
  }

  public retornaPorcentagemMeta(meta: MetaGasto) {
    return this.metaService.calcProgessoMeta(meta);
  }

  public retornaTotalMeta(meta: MetaGasto) {
    return this.metaService.calcTotalMeta(meta);
  }

  public podeAnalisarFinanca(financa: Financa) {
    let criador: string;

    this.authService.getUsername().then(username => {
      criador = username;
    })

    return financa.usuarioCriador !== criador;
  }

  aceitaFinanca(financa: Financa) {
    financa.verificacao = Verificacao.Confirmado;
    this.financaService.getFinancaListRef().update(financa.key, financa);
  }

  rejeitaFinanca(financa: Financa) {
    financa.verificacao = Verificacao.Negado;
    this.removeFinanca(financa);
  }

}
