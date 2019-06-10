import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Usuario } from '../../models/usuario';
import { StatusBar } from '@ionic-native/status-bar';
import { AuthProvider } from '../../providers/auth/auth';
import { AmigosServiceProvider } from '../../providers/amigos-service/amigos-service';
import { AdicionaAmigoPage } from '../adiciona-amigo/adiciona-amigo';
import { Amizade } from '../../models/amizade';
import { Verificacao } from '../../models/VerificacaoEnum';
import { ChatRoomPage } from '../chat-room/chat-room';
import { ChatService } from '../../providers/chat-service/chat-service';
import { DetalhesAmigosPage } from '../detalhes-amigos/detalhes-amigos';

/**
 * Generated class for the AmigosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-amigos',
  templateUrl: 'amigos.html',
})
export class AmigosPage {

  public amigos: Usuario[] = [];
  public amigosPendentes: Usuario[] = [];
  public amigosSolicitantes: Usuario[] = [];
  public amizades: Amizade[] = [];
  public solicitacoes: Amizade[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public statusBar: StatusBar,
    public amigosService: AmigosServiceProvider,
    public alertCtrl: AlertController,
    public chatService: ChatService) {
      this.carregaAmigos();
  }

  ionViewDidLoad() {  }

  carregaAmigos() {
    this.amigos = []; this.amigosPendentes = [];
    this.amizades = []; this.solicitacoes = [];
    this.amigosService.recebeAmizadesFB()
      .then(amizades => {
        var allAmizades = amizades as Amizade[];
        allAmizades.forEach(amizade => {
          if (amizade.verificacao == Verificacao.Confirmado) {
            this.amizades.push(amizade as Amizade);
          } else if (amizade.verificacao == Verificacao.Pendente) {
            this.solicitacoes.push(amizade as Amizade);
          }

          this.authProvider.getUsuarioRef(amizade.amigo).then(amigo => {
            if (amizade.verificacao == Verificacao.Confirmado) {
              this.amigos.push(amigo as Usuario);
            } else if (amizade.verificacao == Verificacao.Pendente) {
              this.amigosPendentes.push(amigo as Usuario);
              if (amizade.criador == amizade.amigo) {
                this.amigosSolicitantes.push(amigo as Usuario);
              }
            }
          });
        });
    });
  }

  modalAdicionaAmigo() {
    this.navCtrl.push(AdicionaAmigoPage);
  }

  removeAmigo(usuario: Usuario) {
    let alert = this.alertCtrl.create({
      title: "Excluir amigo",
      message: "Você tem certeza que deseja excluir este amigo?"
        + "\n\n" + "Todas as informações serão deletadas.",
      buttons: [{
        text: 'Cancelar',
        handler: () => {}
      },
      {
        text: 'Excluir',
        handler: () => {
          this.amigosService.removeAmizadeFB(usuario)
          .then(_ => {
            this.amigos = this.amigos
              .filter(amg => amg.username !== usuario.username);
          })
        }
      }

      ]
    });
    alert.present();
  }

  existeAmigos() {
    return this.amizades.length > 0;
  }

  existeSolicitacoesPendentes() {
    return this.solicitacoes.length > 0;
  }

  podeAceitarSolicitacao(usuario: Usuario){
    return this.amigosSolicitantes.indexOf(usuario) > -1;
  }

  aceitaSolicitacao(usuario: Usuario) {
    this.solicitacoes.forEach(amizade => {
      if (usuario.username == amizade.amigo) {
        this.amigosService.confirmaAmizadeFB(amizade, Verificacao.Confirmado)
        .then(_ => {
          this.carregaAmigos();
        });
      }
    });
  }

  rejeitaSolicitacao(usuario: Usuario) {
    this.solicitacoes.forEach(amizade => {
      if (usuario.username == amizade.amigo) {
        this.amigosService.confirmaAmizadeFB(amizade, Verificacao.Negado)
        .then(_ => {
          this.carregaAmigos();
        });
      }
    });
  }

  retornaFoto(usuario: Usuario) {
    return this.authProvider.getGravatarUsuario(usuario.email, "https://cdn.pbrd.co/images/HwxHoFO.png");
  }

  conversar(amigo: Usuario) {
    this.authProvider.getUsuarioLogado()
      .then(user => {
        const usuarioLogado = user as Usuario;
        this.chatService.setupChat(usuarioLogado, amigo)
        .then(_ => {
          this.navCtrl.push(ChatRoomPage);
        });
      });    
  }

  modalEstatisticasAmigo(usuario){
    this.navCtrl.push(DetalhesAmigosPage, usuario);
  }

  modalMostraDetalhes(amizade) {

  }
}
