import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { StatusBar } from '@ionic-native/status-bar';
import { Financa } from '../../models/financa';
import { FinancaServiceProvider } from '../../providers/financa-service/financa-service';
import { MetaServiceProvider } from '../../providers/meta-service/meta-service';
import { Amizade } from '../../models/amizade';
import { AmigosServiceProvider } from '../../providers/amigos-service/amigos-service';
import { Verificacao } from '../../models/VerificacaoEnum';
import Utils from '../../Helper/Utils';

@IonicPage()
@Component({
  selector: 'page-adiciona-financa',
  templateUrl: 'adiciona-financa.html',
})
export class AdicionaFinancaPage {

  public financa = {} as Financa;
  public valorFinanca;
  public valorCompartilhado;
  public tipoFinanca = "";
  public financaCompartilhada = false;
  public usuarioCompartilhado = "";
  public usuarioCompartilhado2 = "";
  public usuarioCompartilhado3 = "";
  public usuarioCompartilhado4 = "";
  public usuarioCompartilhado5 = "";
  public usuarioCompartilhado6 = "";
  public usuarioCompartilhado7 = "";
  public usuarioCompartilhado8 = "";
  public usuarioCompartilhado9 = "";
  public liberaUsuario2 = false;
  public liberaUsuario3 = false;
  public liberaUsuario4 = false;
  public liberaUsuario5 = false;
  public liberaUsuario6 = false;
  public liberaUsuario7 = false;
  public liberaUsuario8 = false;
  public liberaUsuario9 = false;
  public numeroUsuariosCompartilhados = 0;
  public listaDeAmigos: Amizade[] = [];
  public listaCompartilhada: String[] = [];

  //booleans de verificação
  valorInvalido = false;
  valorVazio = false;
  descricaoVazia = false;
  dataVazia = false;
  categoriaVazia = false;
  tipoVazio = false;
  usuarioCompartilhadoVazio = false;
  usuarioCompartilhadoVazio2 = false;
  usuarioCompartilhadoVazio3 = false;
  usuarioCompartilhadoVazio4 = false;
  usuarioCompartilhadoVazio5 = false;
  usuarioCompartilhadoVazio6 = false;
  usuarioCompartilhadoVazio7 = false;
  usuarioCompartilhadoVazio8 = false;
  usuarioCompartilhadoVazio9 = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public statusBar: StatusBar,
    public authService: AuthProvider,
    public alertCtrl: AlertController,
    public financaService: FinancaServiceProvider,
    public metaService: MetaServiceProvider,
    public amigosService: AmigosServiceProvider) {
  }

  private abrirToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  public adicionaFinanca() {
    // TODO: remover depois de adicionar os campos
    // categoria e ehDebito ao form de criação de financas
    if (!this.financaCompartilhada) {
      this.adicionaFinancaAux();
    }
    else {
      if (!this.confirmaDados()) {
        this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
      }
      else {
        if (this.tipoFinanca === "debito") {
          this.financa = {
            ...this.financa,
            ehDebito: true,
            valor: this.valorFinanca,
            verificacao: Verificacao.Pendente,
            ehCompartilhada: true
          };
        }
        else {
          this.financa = {
            ...this.financa,
            ehDebito: false,
            valor: this.valorFinanca,
            verificacao: Verificacao.Pendente,
            ehCompartilhada: true
          };
        }
        // No caso, precisa criar um adicionaFinancaEmUsuarioFB para adicionar o objeto financa novo (com valor dividido por usuários) em cada usuário da finança
        this.authService.getUsername().then(username => {
          this.financa.usuarioCriador = username as string;

          this.valorCompartilhado = this.retornaValorPorUsuario();

          let financa = {
            ...this.financa,
            valor: this.valorCompartilhado,
            verificacao: Verificacao.Confirmado
          };

          this.financaService.adicionaFinancaEmUsuarioFB(username, financa);
        });

        this.carregaAmigos().then(listaDeAmigos => {
          this.listaCompartilhada.forEach(username => {
            this.financaService.adicionaFinancaEmUsuarioFB(username as string, { ...this.financa, valor: this.valorCompartilhado });
          });


        }).then(_ => {
          this.navCtrl.pop();
        }).catch(_ => {//nao adiciona a dívida
          this.abrirToast("Ops! Parece que um ou mais usuários que você registrou na finança não está na sua lista de amizades.");
        });
      }
    }
  }

  public adicionaFinancaAux() {
    if (!this.confirmaDados()) {
      this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
    } else {
      if (this.tipoFinanca === "debito") {
        this.financa = {
          ...this.financa,
          ehDebito: true,
          valor: this.valorFinanca,
          verificacao: Verificacao.Confirmado,
          ehCompartilhada: false
        };
      } else {
        this.financa = {
          ...this.financa,
          ehDebito: false,
          valor: this.valorFinanca,
          verificacao: Verificacao.Confirmado,
          ehCompartilhada: false
        };
      }

      this.authService.getUsername().then(username => {
        this.financa.usuarioCriador = username as string;
        this.financaService.adicionaFinancaEmUsuarioFB(username, this.financa)
          .then(_ => {
            this.metaService.verificaMetas(this.financa.categoria);
            this.navCtrl.pop();
          });
      });
    }
  }

  public updateFinancaCompartilhada() {
    if (!this.financaCompartilhada) {
      this.financaCompartilhada = true;
    }
    else {
      this.financaCompartilhada = false;
    }
  }

  public retornaValorPorUsuario() {
    var valor = 0.0;
    this.numeroUsuariosCompartilhados = this.getNumeroUsuariosCompartilhados();
    valor = Utils.formataValorFB(this.valorFinanca) / this.numeroUsuariosCompartilhados;
    return this.formataValor(valor);
  }

  private formataValor(valor: number) {
    return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
  }

  public getNumeroUsuariosCompartilhados() {
    if (this.liberaUsuario9) {
      return 10;
    }
    else if (this.liberaUsuario8) {
      return 9;
    }
    else if (this.liberaUsuario7) {
      return 8;
    }
    else if (this.liberaUsuario6) {
      return 7;
    }
    else if (this.liberaUsuario5) {
      return 6;
    }
    else if (this.liberaUsuario4) {
      return 5;
    }
    else if (this.liberaUsuario3) {
      return 4;
    }
    else if (this.liberaUsuario2) {
      return 3;
    }
    else {
      return 2;
    }
  }

  public usuarioEstaNaListaDeAmigos(usuario) {
    if (this.financaCompartilhada) {
      this.carregaAmigos();
      for (var i = 0; i < this.listaDeAmigos.length; i + 1) {
        if (usuario === this.listaDeAmigos[i].amigo) {
          return true;
        }
      }
      return false;
    }
  }

  public adicionaOutroUsuario() {
    if (this.liberaUsuario9) {
      this.abrirToast("Ops! Você não pode adicionar finança com mais de 10 usuários.");
    }
    else if (this.liberaUsuario8) {
      this.liberaUsuario9 = true;
    }
    else if (this.liberaUsuario7) {
      this.liberaUsuario8 = true;
    }
    else if (this.liberaUsuario6) {
      this.liberaUsuario7 = true;
    }
    else if (this.liberaUsuario5) {
      this.liberaUsuario6 = true;
    }
    else if (this.liberaUsuario4) {
      this.liberaUsuario5 = true;
    }
    else if (this.liberaUsuario3) {
      this.liberaUsuario4 = true;
    }
    else if (this.liberaUsuario2) {
      this.liberaUsuario3 = true;
    }
    else {
      this.liberaUsuario2 = true;
    }
  }

  public removeOutroUsuario() {
    if (!this.liberaUsuario2) {
      this.abrirToast("Ops! Você não pode adicionar finança com menos de 1 usuário.");
    }
    else if (!this.liberaUsuario3) {
      this.liberaUsuario2 = false;
    }
    else if (!this.liberaUsuario4) {
      this.liberaUsuario3 = false;
    }
    else if (!this.liberaUsuario5) {
      this.liberaUsuario4 = false;
    }
    else if (!this.liberaUsuario6) {
      this.liberaUsuario5 = false;
    }
    else if (!this.liberaUsuario7) {
      this.liberaUsuario6 = false;
    }
    else if (!this.liberaUsuario8) {
      this.liberaUsuario7 = false;
    }
    else if (!this.liberaUsuario9) {
      this.liberaUsuario8 = false;
    }
    else {
      this.liberaUsuario9 = false;
    }
  }

  private confirmaDados() {
    this.valorInvalido = this.financa.valor <= 0;
    this.valorVazio = this.valorFinanca == null;
    this.dataVazia = this.financa.data == null;
    this.categoriaVazia = this.financa.categoria == null;
    this.descricaoVazia = this.financa.descricao == "" || this.financa.descricao == null;
    this.tipoVazio = this.tipoFinanca == "";
    this.usuarioCompartilhadoVazio = this.usuarioCompartilhado == "";
    this.usuarioCompartilhadoVazio2 = this.usuarioCompartilhado2 == "" && this.liberaUsuario2;
    this.usuarioCompartilhadoVazio3 = this.usuarioCompartilhado3 == "" && this.liberaUsuario3;
    this.usuarioCompartilhadoVazio4 = this.usuarioCompartilhado4 == "" && this.liberaUsuario4;
    this.usuarioCompartilhadoVazio5 = this.usuarioCompartilhado5 == "" && this.liberaUsuario5;
    this.usuarioCompartilhadoVazio6 = this.usuarioCompartilhado6 == "" && this.liberaUsuario6;
    this.usuarioCompartilhadoVazio7 = this.usuarioCompartilhado7 == "" && this.liberaUsuario7;
    this.usuarioCompartilhadoVazio8 = this.usuarioCompartilhado8 == "" && this.liberaUsuario8;
    this.usuarioCompartilhadoVazio9 = this.usuarioCompartilhado9 == "" && this.liberaUsuario9;

    if (this.financaCompartilhada) {
      if (this.liberaUsuario9) {
        return !this.valorInvalido && !this.valorVazio &&
          !this.dataVazia && !this.descricaoVazia &&
          !this.categoriaVazia && !this.tipoVazio && !this.usuarioCompartilhadoVazio
          && !this.usuarioCompartilhadoVazio2 && !this.usuarioCompartilhadoVazio3 && !this.usuarioCompartilhadoVazio4
          && !this.usuarioCompartilhadoVazio5 && !this.usuarioCompartilhadoVazio6 && !this.usuarioCompartilhadoVazio7
          && !this.usuarioCompartilhadoVazio8 && !this.usuarioCompartilhadoVazio9;
      }
      else if (this.liberaUsuario8) {
        return !this.valorInvalido && !this.valorVazio &&
          !this.dataVazia && !this.descricaoVazia &&
          !this.categoriaVazia && !this.tipoVazio && !this.usuarioCompartilhadoVazio
          && !this.usuarioCompartilhadoVazio2 && !this.usuarioCompartilhadoVazio3 && !this.usuarioCompartilhadoVazio4
          && !this.usuarioCompartilhadoVazio5 && !this.usuarioCompartilhadoVazio6 && !this.usuarioCompartilhadoVazio7
          && !this.usuarioCompartilhadoVazio8;
      }
      else if (this.liberaUsuario7) {
        return !this.valorInvalido && !this.valorVazio &&
          !this.dataVazia && !this.descricaoVazia &&
          !this.categoriaVazia && !this.tipoVazio && !this.usuarioCompartilhadoVazio
          && !this.usuarioCompartilhadoVazio2 && !this.usuarioCompartilhadoVazio3 && !this.usuarioCompartilhadoVazio4
          && !this.usuarioCompartilhadoVazio5 && !this.usuarioCompartilhadoVazio6 && !this.usuarioCompartilhadoVazio7;
      }
      else if (this.liberaUsuario6) {
        return !this.valorInvalido && !this.valorVazio &&
          !this.dataVazia && !this.descricaoVazia &&
          !this.categoriaVazia && !this.tipoVazio && !this.usuarioCompartilhadoVazio
          && !this.usuarioCompartilhadoVazio2 && !this.usuarioCompartilhadoVazio3 && !this.usuarioCompartilhadoVazio4
          && !this.usuarioCompartilhadoVazio5 && !this.usuarioCompartilhadoVazio6;
      }
      else if (this.liberaUsuario5) {
        return !this.valorInvalido && !this.valorVazio &&
          !this.dataVazia && !this.descricaoVazia &&
          !this.categoriaVazia && !this.tipoVazio && !this.usuarioCompartilhadoVazio
          && !this.usuarioCompartilhadoVazio2 && !this.usuarioCompartilhadoVazio3 && !this.usuarioCompartilhadoVazio4
          && !this.usuarioCompartilhadoVazio5;
      }
      else if (this.liberaUsuario4) {
        return !this.valorInvalido && !this.valorVazio &&
          !this.dataVazia && !this.descricaoVazia &&
          !this.categoriaVazia && !this.tipoVazio && !this.usuarioCompartilhadoVazio
          && !this.usuarioCompartilhadoVazio2 && !this.usuarioCompartilhadoVazio3 && !this.usuarioCompartilhadoVazio4;
      }
      else if (this.liberaUsuario3) {
        return !this.valorInvalido && !this.valorVazio &&
          !this.dataVazia && !this.descricaoVazia &&
          !this.categoriaVazia && !this.tipoVazio && !this.usuarioCompartilhadoVazio
          && !this.usuarioCompartilhadoVazio2 && !this.usuarioCompartilhadoVazio3;
      }
      else if (this.liberaUsuario2) {
        return !this.valorInvalido && !this.valorVazio &&
          !this.dataVazia && !this.descricaoVazia &&
          !this.categoriaVazia && !this.tipoVazio && !this.usuarioCompartilhadoVazio
          && !this.usuarioCompartilhadoVazio2;
      }
      else {
        return !this.valorInvalido && !this.valorVazio &&
          !this.dataVazia && !this.descricaoVazia &&
          !this.categoriaVazia && !this.tipoVazio && !this.usuarioCompartilhadoVazio;
      }

    }
    else {
      return !this.valorInvalido && !this.valorVazio &&
        !this.dataVazia && !this.descricaoVazia &&
        !this.categoriaVazia && !this.tipoVazio;
    }
  }

  public carregaAmigos() {
    return new Promise((resolve, reject) => {
      this.amigosService.recebeAmizadesFB()
        .then(amizades => {
          this.listaCompartilhada = [];
          var allAmizades = amizades as Amizade[];
          allAmizades.forEach(amizade => {
            if (amizade.verificacao == Verificacao.Confirmado) {
              this.listaDeAmigos.push(amizade as Amizade);
              if (this.carregaAmigosAux(amizade.amigo)) {
                this.listaCompartilhada.push(amizade.amigo);
              }
            }
          });
        }).then(_ => {
          if ((this.getNumeroUsuariosCompartilhados() - 1) != this.listaCompartilhada.length) {
            reject();
          } else {
            resolve(this.listaDeAmigos);
          }
        });
    });

  }

  private carregaAmigosAux(username: string) {
    return username.toLowerCase() === this.usuarioCompartilhado.toLowerCase()
      || username.toLowerCase() === this.usuarioCompartilhado2.toLowerCase()
      || username.toLowerCase() === this.usuarioCompartilhado3.toLowerCase()
      || username.toLowerCase() === this.usuarioCompartilhado4.toLowerCase()
      || username.toLowerCase() === this.usuarioCompartilhado5.toLowerCase()
      || username.toLowerCase() === this.usuarioCompartilhado6.toLowerCase()
      || username.toLowerCase() === this.usuarioCompartilhado7.toLowerCase()
      || username.toLowerCase() === this.usuarioCompartilhado8.toLowerCase()
      || username.toLowerCase() === this.usuarioCompartilhado9.toLowerCase();
  }

  public amigoDeTodosUsuarios() {
    if (this.liberaUsuario9) {
      return (this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado2)
        && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado3) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado4)
        && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado5) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado6)
        && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado7) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado8)
        && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado9));
    }
    else if (this.liberaUsuario8) {
      return (this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado2)
        && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado3) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado4)
        && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado5) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado6)
        && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado7) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado8));
    }
    else if (this.liberaUsuario7) {
      return (this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado2)
        && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado3) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado4)
        && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado5) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado6)
        && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado7));
    }
    else if (this.liberaUsuario6) {
      return (this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado2)
        && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado3) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado4)
        && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado5) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado6));
    }
    else if (this.liberaUsuario5) {
      return (this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado2)
        && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado3) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado4)
        && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado5));
    }
    else if (this.liberaUsuario4) {
      return (this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado2)
        && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado3) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado4));
    }
    else if (this.liberaUsuario3) {
      return (this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado2)
        && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado3));
    }
    else if (this.liberaUsuario2) {
      return (this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado2));
    }
    else {
      return (this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado));
    }
  }

}
