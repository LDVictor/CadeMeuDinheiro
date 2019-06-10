import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Financa } from '../../models/financa';
import { FinancaServiceProvider } from '../../providers/financa-service/financa-service';
import { Usuario } from '../../models/usuario';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the DetalhesAmigosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalhes-amigos',
  templateUrl: 'detalhes-amigos.html',
})
export class DetalhesAmigosPage {

  amigo: Usuario;
  financas: Financa[] = [];
  financasDoAmigo: Financa[] = [];

  public hoje = new Date();
  public mesAtual = this.hoje.getMonth() + 1;

  categoriaUsuario: string;
  categoriaAmigo: string;
  gastouMais: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public financaService: FinancaServiceProvider,
    public authProvider: AuthProvider) {
    this.amigo = this.navParams.data;
  }

  ionViewDidLoad() { 
    this.carregaFinancasFB();
    this.carregaFinancasDoAmigoFB();
  }

  carregaFinancasFB() {
    this.financaService.recebeFinancasFB()
      .then(financas => {
        this.financas = this.ordenaFinancas(this.filtraFinancas((financas as Financa[])));
      });
  }

  carregaFinancasDoAmigoFB() {
    this.financaService.recebeFinancasDeUsuarioFB(this.amigo.username)
      .then(financas => {
        this.financasDoAmigo = this.ordenaFinancas(this.filtraFinancas((financas as Financa[])));
      });
  }

  filtraFinancas(financas: Financa[]) {
      var financasFiltradas: Financa[] = [];

      for (var i = 0; i < financas.length; i++) {
        var dataFinancaAtual = new Date(financas[i].data);
        if (dataFinancaAtual.getMonth() == this.mesAtual - 1) {
          financasFiltradas.push(financas[i]);
        }
      }
      return financasFiltradas;
    }

    private ordenaFinancas(financas: Financa[]): Financa[] {
      return financas.sort(this.compareFinancas);
    }
  
    private compareFinancas(a: Financa, b: Financa) {
      var dataA = new Date(a.data);
      var dataB = new Date(b.data);
      if (dataA.getTime() > dataB.getTime()) {
        return -1;
      }
      if (dataA.getTime() < dataB.getTime()) {
        return 1;
      }
      return 0;
    }
  

  public retornaSomaDebito(lista) {
    var soma = 0.0;
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].ehDebito == true) {
        soma += lista[i].valor;
      }
    }
    console.log(soma);
    return soma;
  }

  diferencaGasto() {
    var gastosDoUsuario = this.retornaSomaDebito(this.financas);
    var gastosDoAmigo = this.retornaSomaDebito(this.financasDoAmigo);
    if (gastosDoUsuario >= gastosDoAmigo) {
      this.gastouMais = true;
      return gastosDoUsuario - gastosDoAmigo;
    }
    else {
      this.gastouMais = false;
      return gastosDoAmigo - gastosDoUsuario;
    }
  }

  categoriaComMaisGastos(financas) {
    var somaAlimentacao = 0.0;
    var somaVestuario = 0.0;
    var somaEntretenimento = 0.0;
    var somaBebida = 0.0;
    var somaSupermercado = 0.0;
    var somaTransporte = 0.0;
    var somaEletronicos = 0.0;
    var somaOutros = 0.0;
    for (var i = 0; i < financas.length; i++) {
      if (financas[i].ehDebito == true) {
        if (financas[i].categoria === "alimentacao") {
          somaAlimentacao += +financas[i].valor;
        }
        else if (financas[i].categoria === "vestuario") {
          somaVestuario += +financas[i].valor;
        }
        else if (financas[i].categoria === "entretenimento") {
          somaEntretenimento += +financas[i].valor;
        }
        else if (financas[i].categoria === "bebida") {
          somaBebida += +financas[i].valor;
        }
        else if (financas[i].categoria === "supermercado") {
          somaSupermercado += +financas[i].valor;
        }
        else if (financas[i].categoria === "transporte") {
          somaTransporte += +financas[i].valor;
        }
        else if (financas[i].categoria === "eletronicos") {
          somaEletronicos += +financas[i].valor;
        }
        else {
          somaOutros += +financas[i].valor;
        }
      }
    }
    if (somaAlimentacao >= somaVestuario && somaAlimentacao >= somaEntretenimento && somaAlimentacao >= somaBebida && somaAlimentacao >= somaSupermercado
      && somaAlimentacao >= somaTransporte && somaAlimentacao >= somaEletronicos && somaAlimentacao >= somaOutros) {
      return "Alimentação";
    }
    else if (somaVestuario >= somaAlimentacao && somaVestuario >= somaEntretenimento && somaVestuario >= somaBebida && somaVestuario >= somaSupermercado
      && somaVestuario >= somaTransporte && somaVestuario >= somaEletronicos && somaVestuario >= somaOutros) {
      return "Vestuário";
    }
    else if (somaEntretenimento >= somaAlimentacao && somaEntretenimento >= somaVestuario && somaEntretenimento >= somaBebida && somaEntretenimento >= somaSupermercado
      && somaEntretenimento >= somaTransporte && somaEntretenimento >= somaEletronicos && somaEntretenimento >= somaOutros) {
      return "Entretenimento";
    }
    else if (somaBebida >= somaAlimentacao && somaBebida >= somaVestuario && somaBebida >= somaEntretenimento && somaBebida >= somaSupermercado
      && somaBebida >= somaTransporte && somaBebida >= somaEletronicos && somaBebida >= somaOutros) {
      return "Bebida";
    }
    else if (somaSupermercado >= somaAlimentacao && somaSupermercado >= somaVestuario && somaSupermercado >= somaEntretenimento && somaSupermercado >= somaBebida
      && somaSupermercado >= somaTransporte && somaSupermercado >= somaEletronicos && somaSupermercado >= somaOutros) {
      return "Supermercado";
    }
    else if (somaTransporte >= somaAlimentacao && somaTransporte >= somaVestuario && somaTransporte >= somaEntretenimento && somaTransporte >= somaBebida
      && somaTransporte >= somaSupermercado && somaTransporte >= somaEletronicos && somaTransporte >= somaOutros) {
      return "Transporte";
    }
    else if (somaEletronicos >= somaAlimentacao && somaEletronicos >= somaVestuario && somaEletronicos >= somaEntretenimento && somaEletronicos >= somaBebida
      && somaEletronicos >= somaSupermercado && somaEletronicos >= somaTransporte && somaEletronicos >= somaOutros) {
      return "Eletrônicos";
    }
    else {
      return "Outros";
    }
  }

  formataValor(valor: number) {
    return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
  }

  retornaFoto(usuario: Usuario) {
    return this.authProvider.getGravatarUsuario(usuario.email, "https://cdn.pbrd.co/images/HwxHoFO.png");
  }

}