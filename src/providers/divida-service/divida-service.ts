import { Injectable } from '@angular/core';
import { Divida } from "../../models/divida";
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthProvider } from '../auth/auth'
import { Usuario } from '../../models/usuario';
import { NotificationProvider } from '../notification/notification';
import { Verificacao } from '../../models/VerificacaoEnum';
import Utils from '../../Helper/Utils';

@Injectable()
export class DividaServiceProvider {

  private usuario = {} as Usuario;

  constructor(public db: AngularFireDatabase,
    public authProvider: AuthProvider,
    public notificacao: NotificationProvider) {
    this.authProvider.getUsuario().subscribe(user => {
      this.usuario = user as Usuario;
    })
  }

  public adicionaDividaFB(divida: Divida) {
    divida.valor = Utils.formataValorFB(divida.valor);
    this.setVerificacao(divida);
    return new Promise((resolve) => {
      this.associaDividaFB(divida).then(div => {
        this.db.list("divida-list").push(div).then(resp => {
          const novaDiv = {
            ...div,
            key: resp.key
          };
          resolve(novaDiv);
        });
      });
    });
  }

  associaDividaFB(divida: Divida) {
    return new Promise((resolve) => {
      if (divida.usuarioDevedor != null && divida.usuarioEmprestador != null) {
        this.authProvider.getUsuarioRef(divida.usuarioEmprestador).then(usuario => {
          var usuarioAssociado = usuario as Usuario;
          if (Object.keys(usuarioAssociado).length > 0) {
            divida.usuarioEmprestador = usuarioAssociado.username;
            divida.nomeUsuarioEmprestador = usuarioAssociado.nome;
            divida.emailUsuarioEmprestador = usuarioAssociado.email;
            if (usuarioAssociado.userId != null) {
              this.enviarNotificacao(usuarioAssociado.userId, divida, false);
            }
          }
          resolve(divida);
        }).catch(_ => {
          resolve(divida);
        });
      } else {
        resolve(divida);
      }
    });
  }

  public adicionaEmprestimoFB(emprestimo: Divida) {
    emprestimo.valor = Utils.formataValorFB(emprestimo.valor);
    this.setVerificacao(emprestimo);
    return new Promise((resolve) => {
      this.associaEmprestimoFB(emprestimo).then(emp => {
        this.db.list("divida-list").push(emp).then(resp => {
          const novoEmp = {
            ...emp,
            key: resp.key
          };
          resolve(novoEmp);
        });
      });
    });
  }

  associaEmprestimoFB(emprestimo: Divida) {
    return new Promise((resolve) => {
      if (emprestimo.usuarioDevedor != null && emprestimo.usuarioEmprestador != null) {
        this.authProvider.getUsuarioRef(emprestimo.usuarioDevedor).then(usuario => {
          var usuarioAssociado = usuario as Usuario;
          if (Object.keys(usuarioAssociado).length > 0) {
            emprestimo.usuarioDevedor = usuarioAssociado.username;
            emprestimo.nomeUsuarioDevedor = usuarioAssociado.nome;
            emprestimo.emailUsuarioDevedor = usuarioAssociado.email;
            if (usuarioAssociado.userId != null) {
              this.enviarNotificacao(usuarioAssociado.userId, emprestimo, true);
            }
          }
          resolve(emprestimo);
        }).catch(_ => {
          resolve(emprestimo);
        });
      } else {
        resolve(emprestimo);
      }
    });
  }

  public editaDividaEmprestimoFB(divida: Divida) {
    divida.valor = Utils.formataValorFB(divida.valor);
    return new Promise((resolve, reject) => {
      this.db.list("divida-list").update(divida.key, divida).then(_ => {
        resolve(divida);
      }).catch(err => {
        reject(err);
      });
    });
  }

  enviarNotificacao(usuarioId: string, divida: Divida, ehEmprestimo: boolean) {
    const inicioMsg = ehEmprestimo ? "Nova dívida de " : "Novo empréstimo de ";
    const nomeEditor = ehEmprestimo ? divida.nomeUsuarioDevedor : divida.nomeUsuarioEmprestador;
    this.notificacao.enviarNotificacao(
      usuarioId, inicioMsg + nomeEditor, divida.descricao + " \nR$" + this.formataValor(divida.valor)
    );
  }

  public recebeDividasFB(username: string) {
    return this.db.list('/divida-list/', ref => ref.orderByChild('usuarioDevedor').equalTo(username));
  }

  public recebeEmprestimosFB(username: string) {
    return this.db.list('/divida-list/', ref => ref.orderByChild('usuarioEmprestador').equalTo(username));
  }

  public removeDividaFB(divida: Divida) {
    return this.db.list("divida-list/").remove(divida.key);
  }

  public removeEmprestimoFB(emprestimo: Divida) {
    return this.removeDividaFB(emprestimo);
  }

  public retornaSomaDividas() {
    return new Promise((resolve, reject) => {
      this.recebeDividasFB(this.usuario.username).valueChanges().subscribe(dividas => {
        const somaDividas = (dividas as Divida[]).reduce((acum, divida) => {
          return acum + divida.valor;
        }, 0.0);
        resolve(somaDividas);
      });
    });
  }

  formataValor(valor: number) {
    return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
  }

  private setVerificacao(divEmp: Divida) {
    const semOutroUsuario = !divEmp.usuarioDevedor || !divEmp.usuarioEmprestador;
    divEmp.verificacao = semOutroUsuario ? Verificacao.Confirmado : Verificacao.Pendente;
  }

  getTextoData(data) {
    var options = { weekday: "long", month: 'long', day: '2-digit' };
    let dataSeparada = data.toString().split("-");
    let ano = Number(dataSeparada[0]);
    let mes = Number(dataSeparada[1]) - 1;
    let dia = Number(dataSeparada[2]);
    let dataAjustada = new Date(ano, mes, dia);
    return dataAjustada.toLocaleDateString("pt-br", options);
  }

}
