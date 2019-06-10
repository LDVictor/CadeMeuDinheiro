// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Acordo } from '../../models/acordo';
import { Divida } from '../../models/divida';
import { DividaServiceProvider } from '../divida-service/divida-service';
import { NotificationProvider } from '../notification/notification';
import { AuthProvider } from '../auth/auth';
import { Usuario } from '../../models/usuario';
import { AngularFireDatabase } from 'angularfire2/database';


@Injectable()
export class AcordoServiceProvider {

  constructor(public db: AngularFireDatabase,
    public dividaProvider: DividaServiceProvider,
    public notificacao: NotificationProvider,
    public authProvider: AuthProvider) {

  }

  public adicionaAcordo(divida: Divida, acordo: Acordo, tipo: string) {
    return new Promise((resolve, reject) => {
      if (divida.acordos) {
        divida.acordos.push(acordo);
      } else {
        divida.acordos = [acordo];
      }
      this.editaAcordoEmDivEmp(divida, acordo, tipo, "adicionou").then(_ => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  public fechaAcordo(divida: Divida, acordo: Acordo, tipo: string) {
    return new Promise((resolve, reject) => {
      var index = divida.acordos.indexOf(acordo);
      divida.acordos.splice(index, 1);
      this.editaAcordoEmDivEmp(divida, acordo, tipo, "fechou").then(_ => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  public editaAcordo(divida: Divida, acordo: Acordo, tipo: string) {
    return new Promise((resolve, reject) => {
      var index = divida.acordos.indexOf(acordo);
      divida.acordos[index] = acordo;
      this.editaAcordoEmDivEmp(divida, acordo, tipo, "editou").then(_ => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  public editaAcordoEmDivEmp(divida: Divida, acordo: Acordo, tipo: string, acao: string) {
    return new Promise((resolve, reject) => {
      this.db.list("divida-list").update(divida.key, divida).then(_ => {
        this.notificaAcordoUsuario(divida, acordo, acao, tipo)
          .then(_ => resolve(divida));
      }).catch(err => {
        reject(err);
      });
    });
  }

  notificaAcordoUsuario(divida: Divida, acordo: Acordo, acao:string, tipo: string) {
    const ehEmprestimo = tipo === "emprestimo";
    const nomeUsuarioNotificado = ehEmprestimo ? divida.nomeUsuarioDevedor : divida.nomeUsuarioEmprestador;
    const nomeEditor = ehEmprestimo ? divida.nomeUsuarioEmprestador : divida.nomeUsuarioDevedor;
    
    return new Promise(resolve => {
      this.authProvider.getUsuarioRef(nomeUsuarioNotificado).then(usuario => {
        const usuarioNotificado = usuario as Usuario;
        if (Object.keys(usuarioNotificado).length > 0 && usuarioNotificado.userId != null) {
          this.enviarNotificacao(usuarioNotificado.userId, nomeEditor, acordo, acao);
        }
        resolve(divida);
      }).catch(_ => {
        resolve(divida);
      });
    });
  }

  enviarNotificacao(usuarioId: string , nomeEditor: string, acordo: Acordo, acao: string) {
    this.notificacao.enviarNotificacao(usuarioId, nomeEditor + " " + acao + " um acordo.",
      this.getTextoData(acordo.data) + " às " + acordo.hora + " em " + acordo.local
    );
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

