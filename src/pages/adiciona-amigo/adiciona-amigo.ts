import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AmigosServiceProvider } from '../../providers/amigos-service/amigos-service';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the AdicionaAmigoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adiciona-amigo',
  templateUrl: 'adiciona-amigo.html',
})
export class AdicionaAmigoPage {

  public nomeUsuario: string = "";

  //booleans de verificação
  nomeVazio = false;
  usuarioNaoEncontrado: boolean = false;
  usuarioUsaAplicativo: String;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, public authService: AuthProvider,
    public amigoService: AmigosServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdicionaAmigoPage');
  }

  private abrirToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  public adicionaAmigo() {
    if (!this.confirmaDados()) {
      this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
    }
    else {
      this.authService.getUsuarioRef(this.nomeUsuario).then(result => {
        this.adicionaAmigoAux(result);
      }).catch(error => {
        console.log("entrei");
        this.abrirToast("Ops! Parece que o usuário que você está procurando não existe.");
      })
    }
  }

  public adicionaAmigoAux(usuario: any) {
    this.amigoService.adicionaAmigoFB(usuario);
    this.navCtrl.pop();
    this.abrirToast("Solicitação enviada.");
  }

  private confirmaDados() {
    this.nomeVazio = this.nomeUsuario == null;
    return !this.nomeVazio;
  }

}
