import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { DividaServiceProvider } from '../../providers/divida-service/divida-service';
import { Divida } from '../../models/divida';
import { StatusBar } from '@ionic-native/status-bar';
import { Usuario } from '../../models/usuario';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-adiciona-emprestimo',
  templateUrl: 'adiciona-emprestimo.html',
})
export class AdicionaEmprestimoPage {

  public usuario = {} as Usuario;
  public emprestimo = {} as Divida;

  nomeVazio = false;
  valorInvalido = false;
  valorVazio = false;
  dataVazia = false;
  descricaoVazia = false;
  usuarioNaoEncontrado: boolean = false;
  usuarioInvalido = false;
  usuarioRepetido = false;
  usuarioNaoMarcouOpcao = false;
  usuarioUsaAplicativo: String;

  data: Date;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public emprestimoService: DividaServiceProvider,
    public statusBar: StatusBar,
    public authService: AuthProvider,
    public alertCtrl: AlertController
  ) {
    authService.getUsuario().subscribe(res => {
      this.usuario = res as Usuario;
      this.usuarioUsaAplicativo = "possui";
    });
  }

  ionViewWillEnter() {
    this.statusBar.backgroundColorByHexString("#00006b");
  }

  private abrirToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  adicionaEmprestimo() {
    if (!this.confirmaDados()) {
      this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
    } else {
      if (!this.usuarioNaoEncontrado  && this.usuarioPossuiConta()) {
        this.authService.getUsuarioRef(this.emprestimo.usuarioDevedor).then(result => {
          this.adicionaEmprestimoAux();
        }).catch(error => {
          console.log("entrei");
          this.abrirToast("Ops! Parece que o usuário que você está procurando não existe.");
        })
      } else {
        this.adicionaEmprestimoAux();
      }
    }
  }

  adicionaEmprestimoAux() {
    console.log(this.emprestimo.data);
    this.emprestimo.aberta = true;
    this.emprestimo.usuarioEmprestador = this.usuario.username;
    this.emprestimo.nomeUsuarioEmprestador = this.usuario.nome;
    this.emprestimo.emailUsuarioEmprestador = this.usuario.email;
    this.emprestimo.data = this.data;
    this.emprestimo.usuarioCriador = this.usuario.username;
    this.emprestimoService.adicionaEmprestimoFB(this.emprestimo);
    this.navCtrl.pop();
    this.emprestimo.usuarioEmprestador == null ? this.abrirToast("Empréstimo adicionado.") : this.abrirToast("Empréstimo pendente enviado para usuário.");
  }

  private usuarioPossuiConta() {
    return this.usuarioUsaAplicativo == "possui";
  }

  private confirmaDados() {
    if(this.usuarioNaoEncontrado) {
      this.nomeVazio = this.emprestimo.nomeUsuarioDevedor == "" || this.emprestimo.nomeUsuarioDevedor == null;
    } else {
      this.usuarioInvalido = this.emprestimo.usuarioDevedor == "" || this.emprestimo.usuarioDevedor == null;
    }
    this.valorInvalido = this.emprestimo.valor <= 0;
    this.valorVazio = this.emprestimo.valor == null;
    this.dataVazia = this.data == null;
    this.descricaoVazia = this.emprestimo.descricao == "" || this.emprestimo.descricao == null;
    this.usuarioNaoMarcouOpcao = (this.usuarioUsaAplicativo == null);
    return !this.valorInvalido && !this.nomeVazio && !this.valorVazio &&
      !this.dataVazia && !this.descricaoVazia && !this.usuarioNaoMarcouOpcao;
  }

}
