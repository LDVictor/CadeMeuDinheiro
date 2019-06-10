import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the AtivosFinanceirosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ativos-financeiros',
  templateUrl: 'ativos-financeiros.html',
})
export class AtivosFinanceirosPage {

  public dolar: number;
  public dolarTurismo: number;
  public dolarCanadense: number;
  public euro: number;
  public libraEsterlina: number;
  public pesoArgentino: number;
  public bitcoin: number;
  public escolha = "dolar";

  public apiDolar = "http://economia.awesomeapi.com.br/USD-BRL/1";
  public apiDolarTurismo = "http://economia.awesomeapi.com.br/USD-BRLT/1";
  public apiDolarCanadense = "http://economia.awesomeapi.com.br/CAD-BRL/1";
  public apiEuro = "http://economia.awesomeapi.com.br/EUR-BRL/1";
  public apiLibraEsterlina = "http://economia.awesomeapi.com.br/GBP-BRL/1";
  public apiPesoArgentino = "http://economia.awesomeapi.com.br/ARS-BRL/1";
  public apiBitcoin = "http://economia.awesomeapi.com.br/BTC-BRL/1";

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AtivosFinanceirosPage');
    this.carregaDadosFinanceiros();
  }

  carregaDadosFinanceiros() {
    this.http.get(this.apiDolar).toPromise().then(resDolar => {
      this.dolar = resDolar[0].high;
      console.log(resDolar);
    });
    this.http.get(this.apiEuro).toPromise().then(resEuro => {
      this.euro = resEuro[0].high;
      console.log(resEuro);
    });
    this.http.get(this.apiLibraEsterlina).toPromise().then(resLibra => {
      this.libraEsterlina = resLibra[0].high;
      console.log(resLibra);
    });
    this.http.get(this.apiPesoArgentino).toPromise().then(resPeso => {
      this.pesoArgentino = resPeso[0].high;
      console.log(resPeso);
    });
    this.http.get(this.apiBitcoin).toPromise().then(resBitcoin => {
      this.bitcoin = resBitcoin[0].high;
      console.log(resBitcoin);
    });
    this.http.get(this.apiDolarTurismo).toPromise().then(resDolarTurismo => {
      this.dolarTurismo = resDolarTurismo[0].high;
      console.log(resDolarTurismo);
    });
    this.http.get(this.apiDolarCanadense).toPromise().then(resDolarCanadense => {
      this.dolarCanadense = resDolarCanadense[0].high;
      console.log(resDolarCanadense);
    });
  }

  formataValor(valor: number) {
    return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
  }

}
