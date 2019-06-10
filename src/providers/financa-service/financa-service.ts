import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthProvider } from '../auth/auth';
import { Financa } from '../../models/financa';
import Utils from '../../Helper/Utils';


@Injectable()
export class FinancaServiceProvider {

  private financas: Financa[] = [];
  private financasDoUsuario: Financa[] = [];

  constructor(private db: AngularFireDatabase,
    private auth: AuthProvider) {
  }

  public adicionaFinancaEmUsuarioFB(username: string, financa: Financa) {
    financa.valor = Utils.formataValorFB(financa.valor);
    return new Promise((resolve) => {
      this.getFinancaListRefParam(username).then(resp => {
        var financaList = resp as string;
        this.db.list(financaList)
          .push(financa)
          .then(resp => {
            const novaFinanca = this.setFinancaKey(financa, resp.key);
            resolve(novaFinanca);
          })
      });
    });
  }

  public editaFinancaFB(financa: Financa) {
    financa.valor = Utils.formataValorFB(financa.valor);
    return this.getFinancaListRef().update(financa.key, financa);
  }

  public removeFinancaFB(financa: Financa) {
    return this.getFinancaListRef().remove(financa.key);
  }

  public recebeFinancasFB() {
    return new Promise((resolve) => {
      this.getFinancaObjRef()
        .valueChanges()
        .subscribe(financas => {
          if (financas) {
            this.financas = this.mapFinObjectToList(financas);
          }
          resolve(this.financas);
        });
    });
  }

  public recebeFinancasDeUsuarioFB(username: string) {
    return new Promise((resolve) => {
      this.getFinancaListRefParam(username).then(result => {
        this.db.object(result as string)
        .valueChanges()
        .subscribe(financasUser => {
          if (financasUser) {
            this.financasDoUsuario = this.mapFinObjectToList(financasUser);
          }
          resolve(this.financasDoUsuario);
        });
      })
    });
  }

  public getFinancaListRef() {
    return this.db.list(this.getFinancaPath());
  }

  private getFinancaObjRef() {
    return this.db.object(this.getFinancaPath());
  }

  private getFinancaPath() {
    return "financa-list/" + this.auth.getUID();
  }

  private getFinancaListRefParam(username: string) {
    return new Promise((resolve, reject) => {
      this.auth.getUsuarioKey(username).then(key => {
        resolve("financa-list/" + key);
      });
    });
  }

  private mapFinObjectToList(financaObj: {}) {
    return Object.keys(financaObj)
      .map(key => {
        let financa = financaObj[key];
        return this.setFinancaKey(financa, key);
      });
  }

  private setFinancaKey(financa: {}, key: string) {
    return {
      ...financa,
      key: key
    } as Financa;
  }

  formataValor(valor: number) {
    return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
  }

}
