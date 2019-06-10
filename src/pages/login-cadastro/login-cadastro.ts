import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController } from 'ionic-angular';
import { Usuario } from '../../models/usuario';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginCadastroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login-cadastro',
  templateUrl: 'login-cadastro.html',
})
export class LoginCadastroPage {

  public nome: string;
  public email: string;
  public username: string;
  public senha: string;
  public profissao: string;
  public salario: number;
  public usuario = {} as Usuario;
  public isCadastro = 0; // 0 = login, 1 = cadastro, 2 = esqueci minha senha


  nomeVazio = false;
  usernameVazio = false;
  emailVazio = false;
  senhaVazia = false;
  senhaInvalida = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams, 
    public toastCtrl: ToastController, 
    public autenticacao: AuthProvider,
    public menuController: MenuController) {
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  ionViewWillLeave() {
    this.menuController.enable(true);
  }

  ionViewDidLoad() {  }

  loginOuCadastro(resposta: string) {
    if (resposta === "login") {
      this.isCadastro = 0;
    }
    else if (resposta === "cadastro") {
      this.isCadastro = 1;
    }
    else {
      this.isCadastro = 2;
    }
  }

  private abrirToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  esqueciSenhaTemp() {
    this.abrirToast("Essa função será implementada em breve!");
  }

  realizaLogin() {
    if (!this.confirmaDadosLogin()) {
      this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
    } else {
      this.autenticacao.login(this.email, this.senha).then(result => {
        this.navCtrl.setRoot(HomePage);
        this.abrirToast("Bem-vindo(a) de volta!");
      }, error => {
        this.abrirToast(error);
      }) 
      }
  }

  realizaCadastro() {
    if (!this.confirmaDadosCadastro()) {
      this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
    } else {
      this.autenticacao.registrar(this.email, this.senha, this.username, this.nome, this.profissao, this.salario).then(result => {
        this.navCtrl.setRoot(HomePage);
        this.abrirToast("Olá, " + this.nome + "!");
      }, error => {
        this.abrirToast(error);
      });
      }
  }

  alterarSenha(email) {
    this.autenticacao.resetarSenha(email).then(result => {
      this.abrirToast("E-mail para recuperação de senha enviado.");
      this.isCadastro = 0;
    }, error => {
      this.abrirToast(error);
    })
  }

  private confirmaDadosLogin() {
    this.emailVazio = this.email == "" || this.email == null;
    this.senhaVazia = this.senha == "" || this.senha == null;
    return !this.emailVazio && !this.senhaVazia;
  }

  private confirmaDadosCadastro() {
    this.nomeVazio = this.nome == "" || this.nome == null;
    this.usernameVazio = this.username == "" || this.username == null;
    this.emailVazio = this.email == "" || this.email == null;
    this.senhaVazia = this.senha == "" || this.senha == null;
    this.senhaInvalida = this.senha != "" && this.senha.length < 6;
    return !this.nomeVazio && !this.usernameVazio && !this.emailVazio && !this.senhaVazia && !this.senhaInvalida;
  }

}
