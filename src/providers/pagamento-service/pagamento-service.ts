import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthProvider } from '../auth/auth';
import { Pagamento } from '../../models/pagamento';
import Utils from '../../Helper/Utils';

@Injectable()
export class PagamentoServiceProvider {

  private pagamentos: Pagamento[] = [];

  constructor(private db: AngularFireDatabase,
    private auth: AuthProvider) {
  }


  public adicionaPagamentoFB(pagamento: Pagamento) {
    pagamento.valor = Utils.formataValorFB(pagamento.valor);
    return new Promise((resolve) => {
      this.getPagamentoListRef().push(pagamento)
        .then(resp => {
          const novoPagamento = this.setPagamentoKey(pagamento, resp.key);
          resolve(novoPagamento);
        });
    });
  }

  public editaPagamentoFB(pagamento: Pagamento) {
    pagamento.valor = Utils.formataValorFB(pagamento.valor);
    return this.getPagamentoListRef().update(pagamento.key, pagamento);
  }

  public removePagamentoFB(pagamento: Pagamento) {
    return this.getPagamentoListRef().remove(pagamento.key);
  }

  public recebePagamentosFB() {
    return new Promise((resolve) => {
      this.getPagamentoObjRef()
        .valueChanges()
        .subscribe(pagamentos => {
          if (pagamentos) {
            this.pagamentos = this.mapFinObjectToList(pagamentos);
          }
          resolve(this.pagamentos);
        });
    });
  }

  private getPagamentoListRef() {
    return this.db.list(this.getPagamentoPath());
  }

  private getPagamentoObjRef() {
    return this.db.object(this.getPagamentoPath());
  }

  private getPagamentoPath() {
    return "Pagamento-list/" + this.auth.getUID();
  }

  private getPagamentoListRefParam(username: string) {
    return new Promise((resolve, reject) => {
      this.auth.getUsuarioKey(username).then(key => {
        resolve("Pagamento-list/" + key);
      });
    });
  }

  private mapFinObjectToList(PagamentoObj: {}) {
    return Object.keys(PagamentoObj)
      .map(key => {
        let Pagamento = PagamentoObj[key];
        return this.setPagamentoKey(Pagamento, key);
      });
  }

  private setPagamentoKey(Pagamento: {}, key: string) {
    return {
      ...Pagamento,
      key: key
    } as Pagamento;
  }

  formataValor(valor: number) {
    return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
  }
  
}
