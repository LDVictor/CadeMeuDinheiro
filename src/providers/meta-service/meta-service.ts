import { Injectable } from '@angular/core';
import { MetaGasto } from '../../models/meta';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthProvider } from '../auth/auth';
import { Financa } from '../../models/financa';
import { NotificationProvider } from '../notification/notification';
import { FinancaServiceProvider } from '../financa-service/financa-service';
import { Verificacao } from '../../models/VerificacaoEnum';
import Utils from '../../Helper/Utils';


@Injectable()
export class MetaServiceProvider {

  private metas: MetaGasto[] = [];
  private financas: Financa[] = [];

  constructor(public db: AngularFireDatabase,
    public auth: AuthProvider,
    public notificacao: NotificationProvider,
    public financasService: FinancaServiceProvider) {
      this.carregaFinancas();
      this.recebeMetasFB();
  }
 
  public adicionaMetaFB(meta: MetaGasto) {
    meta.limite = Utils.formataValorFB(meta.limite);
    return new Promise((resolve) => {
      this.getMetaListRef().push(meta)
        .then(resp => {
          const novaMeta = this.setMetaKey(meta, resp.key);
          resolve(novaMeta);
      });
    });
  }

  public editaMetaFB(meta: MetaGasto) {
    meta.limite = Utils.formataValorFB(meta.limite);
    return this.getMetaListRef().update(meta.key, meta);
  }

  public removeMetaFB(meta: MetaGasto) {
    return this.getMetaListRef().remove(meta.key);
  }

  public recebeMetasFB() {
    return new Promise((resolve) => {
      this.getMetaObjRef()
      .valueChanges()
      .subscribe(metas => {
        this.metas = metas && this.mapFinObjectToList(metas) || [];
        resolve(this.metas);
      });
    });
  }

  private carregaFinancas() {
    this.financasService.getFinancaListRef().valueChanges().subscribe(financas => {
      this.financas = this.filtraFinancasConfirmadas(financas as Financa[]);
    });
  }

  filtraFinancasConfirmadas(lista) {
    return lista.filter(x => x.verificacao === Verificacao.Confirmado);
  }

  public debitaFinanca(financa: Financa) {
    this.financas = this.financas.filter(f => f.key !== financa.key);
    this.verificaMetas(financa.categoria);
  }

  public verificaMetas(categoria: string) {
    this.metas.filter(meta => meta.categoria === categoria)
      .map(meta => {
        this.notificaMetas(this.calcProgessoMeta(meta), categoria);
      });
  }

  public calcProgessoMeta(meta: MetaGasto) {
    var porcentagem = parseFloat(((this.calcTotalMeta(meta) / meta.limite) * 100).toFixed(2));
    return porcentagem >= 100 ? 100 : porcentagem;
  }

  public calcTotalMeta(meta: MetaGasto) {
    const mesAtual = new Date().getMonth();
    return this.financas
      .filter(f => f.categoria === meta.categoria && new Date(f.data).getMonth() === mesAtual)
      .reduce((soma, financa) => soma + financa.valor, 0.0);
  }

  private notificaMetas(progresso: number, categoria: string) {
    let titulo, msg = "";
    if(progresso >= 100) {
      titulo = "Meta alcançada";
      msg = "A meta estipulada para a categoria " +
        categoria + " foi alcançada"; 
        this.enviarNotificacao(titulo, msg);
    } else if(progresso >= 75) {
      titulo = "Meta próxima do limite";
      msg = "A meta estipulada para a categoria " +
        categoria + " está prestes de ser alcançada"; 
        this.enviarNotificacao(titulo, msg);
    } 
  }
  
  private enviarNotificacao(titulo: string, msg: string) {
    this.auth.getUserId()
      .then(userId => {
        this.notificacao.enviarNotificacao(userId, titulo, msg);
      });
  }

  getMetaListRef() {
    return this.db.list(this.getMetaPath());
  }

  getMetaObjRef() {
    return this.db.object(this.getMetaPath());
  }

  getMetaPath() {
    return "meta-list/" + this.auth.getUID();
  }

  mapFinObjectToList(metaObj:{}) {
    return Object.keys(metaObj)
      .map(key => {
        let meta = metaObj[key];
        return this.setMetaKey(meta, key);
      });
  }

  setMetaKey(meta: {}, key: string) {
    return {
      ...meta,
      key: key
    } as MetaGasto;
  }

  formataValor(valor: number) {
    return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
  }

}
