import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Pagamento } from '../../models/pagamento';
import { StatusBar } from '@ionic-native/status-bar';
import { AuthProvider } from '../../providers/auth/auth';
import { ImagePickerOptions, ImagePicker } from '@ionic-native/image-picker';
import { PagamentoServiceProvider } from '../../providers/pagamento-service/pagamento-service';

/**
 * Generated class for the AdicionaPagamentoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adiciona-pagamento',
  templateUrl: 'adiciona-pagamento.html',
})
export class AdicionaPagamentoPage {

  public pagamento = {} as Pagamento;
  public imagem: string = "nnn";

  valorInvalido = false;
  valorVazio = false;
  descricaoVazia = false;
  nomeVazio = false;
  dataVazia = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController, 
    public statusBar: StatusBar,
    public authService: AuthProvider,
    public alertCtrl: AlertController,
    public imagePicker: ImagePicker,
    public pagamentoService: PagamentoServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdicionaPagamentoPage');
  }

  private abrirToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }


  public adicionaPagamento() {
      if (!this.confirmaDados()) {
        this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
      }
      else {
        this.pagamento = {
          ... this.pagamento,
          imagem: this.imagem
        };
        this.pagamentoService.adicionaPagamentoFB(this.pagamento)
      .then(_ => {
        this.navCtrl.pop();
        this.abrirToast("Pagamento registrado.");
      });
    }
  }

  selecionaImagem() {
    const options: ImagePickerOptions = {
      maximumImagesCount: 1
    };
  
    this.imagePicker.getPictures(options).then((results) => {
      this.imagem = results[0];
    }, (err) => { });
  
    this.imagem = "nnn";
  }
  

  private confirmaDados() {
    this.valorInvalido = this.pagamento.valor <= 0;
    this.valorVazio = this.pagamento.valor == null;
    this.dataVazia = this.pagamento.data == null;
    this.descricaoVazia = this.pagamento.descricao == "" || this.pagamento.descricao == null;
    this.nomeVazio = this.pagamento.nomeDoFiador == "" || this.pagamento.nomeDoFiador == null;
    return !this.valorInvalido && !this.valorVazio && !this.dataVazia && !this.descricaoVazia && !this.nomeVazio;
  }

}
