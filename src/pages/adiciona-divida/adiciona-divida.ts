import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { DividaServiceProvider } from '../../providers/divida-service/divida-service';
import { Divida } from '../../models/divida';
import { StatusBar } from '@ionic-native/status-bar';
import { AuthProvider } from '../../providers/auth/auth';
import { Usuario } from '../../models/usuario';


@IonicPage()
@Component({
  selector: 'page-adiciona-divida',
  templateUrl: 'adiciona-divida.html',
})
export class AdicionaDividaPage {

  public usuario = {} as Usuario;
  public divida = {} as Divida;

  data: Date;
  usuarioNaoEncontrado: boolean = false;
  nomeVazio = false;
  valorInvalido = false;
  valorVazio = false;
  dataVazia = false;
  descricaoVazia = false;
  usuarioInvalido = false;
  usuarioRepetido = false;
  usuarioNaoMarcouOpcao = false;
  usuarioUsaAplicativo: String;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dividaService: DividaServiceProvider,
    public toastCtrl: ToastController, 
    public statusBar: StatusBar,
    public authService: AuthProvider,
    public alertCtrl: AlertController) { 
      authService.getUsuario().subscribe(res =>{
        this.usuario = res as Usuario;
        this.usuarioUsaAplicativo = "possui";
      });      
    }     

  ionViewWillEnter() {
    this.statusBar.backgroundColorByHexString("#d30000");
  }

  private abrirToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  
  adicionaDivida() {
    if (!this.confirmaDados()) {
      this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
    } else {
      if(!this.usuarioNaoEncontrado && this.usuarioPossuiConta()) {
        this.authService.getUsuarioRef(this.divida.usuarioEmprestador).then(result => {
          this.adicionaDividaAux();
        }).catch(error => {
          console.log("entrei");
          this.abrirToast("Ops! Parece que o usuário que você está procurando não existe.");
        })
      } else {
        this.adicionaDividaAux();
      } 
    }
  }

  public adicionaDividaAux() {
    this.divida.aberta = true;
    this.divida.data = this.data;
    this.divida.usuarioDevedor = this.usuario.username;
    this.divida.nomeUsuarioDevedor = this.usuario.nome;
    this.divida.emailUsuarioDevedor = this.usuario.email;
    this.divida.usuarioCriador = this.usuario.username;
    this.dividaService.adicionaDividaFB(this.divida);
    this.navCtrl.pop();
    this.divida.usuarioEmprestador == null ? this.abrirToast("Dívida adicionada.") : this.abrirToast("Dívida pendente enviada para usuário.");
  }

  private usuarioPossuiConta() {
    return this.usuarioUsaAplicativo == "possui";
  }

  private confirmaDados() {
    if(this.usuarioNaoEncontrado) {
      this.nomeVazio = this.divida.nomeUsuarioEmprestador == "" || this.divida.nomeUsuarioEmprestador == null;
    } else {
      this.usuarioInvalido = this.divida.usuarioEmprestador == "" || this.divida.usuarioEmprestador == null;
    }
    this.valorInvalido = this.divida.valor <= 0;
    this.valorVazio = this.divida.valor == null;
    this.dataVazia = this.data == null;
    this.descricaoVazia = this.divida.descricao == "" || this.divida.descricao == null;
    this.usuarioNaoMarcouOpcao = (this.usuarioUsaAplicativo == null);
    return !this.valorInvalido && !this.nomeVazio && !this.valorVazio &&
      !this.dataVazia && !this.descricaoVazia && !this.usuarioNaoMarcouOpcao;
  }

}
