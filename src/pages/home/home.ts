import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Divida } from '../../models/divida';
import { DividaServiceProvider } from '../../providers/divida-service/divida-service';
import { AdicionaDividaPage } from '../adiciona-divida/adiciona-divida';
import { AdicionaEmprestimoPage } from '../adiciona-emprestimo/adiciona-emprestimo';
import { MostraDividaPage } from '../mostra-divida/mostra-divida';
import { MostraEmprestimoPage } from '../mostra-emprestimo/mostra-emprestimo';
import { StatusBar } from '@ionic-native/status-bar';
import { AuthProvider } from '../../providers/auth/auth'
import { Verificacao } from '../../models/VerificacaoEnum';
import { map } from 'rxjs/operators';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('fab') fab;

  public dividas: Divida[] = [];
  public dividasPendentes: Divida[] = [];
  public emprestimos: Divida[] = [];
  public emprestimosPendentes: Divida[] = [];

  constructor(public navCtrl: NavController,
    public authProvider: AuthProvider,
    public statusBar: StatusBar,
    public dividaService: DividaServiceProvider) {
    this.carregaDivEmp();
  }

  ionViewWillEnter() {
    this.statusBar.backgroundColorByHexString("#006400");
  }

  carregaDivEmp() {
    this.authProvider.getUsername().then(username => {
      this.carregaDividas(username);
      this.carregaEmprestimos(username);
    });
  }

  carregaDividas(username: string) {
    this.dividaService.recebeDividasFB(username).snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.val();
          return { key: a.key, ...data };
        }))
      ).subscribe(dividas => {
        dividas = dividas as Divida[];
        this.dividas = this.filtraAbertos(dividas);
        this.dividasPendentes = this.filtraDividasPendentes(dividas);
      });
  }

  carregaEmprestimos(username: string) {
    this.dividaService.recebeEmprestimosFB(username).snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.val();
          return { key: a.key, ...data };
        }))
      ).subscribe(emprestimos => {
        emprestimos = emprestimos as Divida[];
        this.emprestimos = this.filtraAbertos(emprestimos);
        this.emprestimosPendentes = this.filtraEmprestimosPendentes(emprestimos);
      });
  }

  retornaFoto(tipo, divida_emprestimo: Divida) {
    if (tipo == "divida") {
      if (divida_emprestimo.emailUsuarioEmprestador == null) {
        return "https://cdn.pbrd.co/images/HwxEQ8k.png";
      }
      return this.authProvider.getGravatarUsuario(divida_emprestimo.emailUsuarioEmprestador, "https://cdn.pbrd.co/images/HwxEQ8k.png");
    } else {
      if (divida_emprestimo.emailUsuarioDevedor == null) {
        return "https://cdn.pbrd.co/images/HwxHdA7.png";
      }
      return this.authProvider.getGravatarUsuario(divida_emprestimo.emailUsuarioDevedor, "https://cdn.pbrd.co/images/HwxHdA7.png");
    }
  }

  public retornaSoma(lista) {
    var soma = 0.0;
    for (var i = 0; i < lista.length; i++) {
      soma += +lista[i].valor;
    }
    return soma;
  }

  filtraAbertos(lista) {
    return lista.filter(x => x.aberta == true && x.verificacao === Verificacao.Confirmado);
  }

  filtraDividasPendentes(lista) {
    return lista.filter(x => x.verificacao === Verificacao.Pendente);
  }

  filtraEmprestimosPendentes(lista) {
    return lista.filter(x => x.verificacao === Verificacao.Pendente);
  }

  formataValor(valor: number) {
    return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
  }


  public podeAnalisarDivida(divida: Divida) {
    return divida.usuarioDevedor != divida.usuarioCriador;
  }

  public podeAnalisarEmprestimo(emprestimo: Divida) {
    return emprestimo.usuarioEmprestador != emprestimo.usuarioCriador;
  }


  //Dividas
  modalAdicionaDivida() {
    this.navCtrl.push(AdicionaDividaPage);
    this.fab.close();
  }

  modalMostraDivida(divida: Divida) {
    this.navCtrl.push(MostraDividaPage, divida);
  }

  existeDivida() {
    return this.dividas.length > 0;
  }

  existeDividasPendentes() {
    return this.dividasPendentes.length > 0;
  }

  aceitaDivEmp(divEmp: Divida) {
    divEmp.verificacao = Verificacao.Confirmado;
    this.dividaService.db.list("divida-list").update(divEmp.key, divEmp);
  }

  rejeitaDivida(divida: Divida) {
    divida.verificacao = Verificacao.Negado;
    this.dividaService.removeDividaFB(divida);
  }

  rejeitaEmprestimo(emprestimo: Divida) {
    emprestimo.verificacao = Verificacao.Negado;
    this.dividaService.removeEmprestimoFB(emprestimo);
  }

  //Empréstimos
  modalAdicionaEmprestimo() {
    this.navCtrl.push(AdicionaEmprestimoPage);
    this.fab.close();
  }

  existeEmprestimo() {
    return this.emprestimos.length > 0;
  }

  modalMostraEmprestimo(emprestimo: Divida) {
    this.navCtrl.push(MostraEmprestimoPage, emprestimo);
  }

  existeEmprestimosPendentes() {
    return this.emprestimosPendentes.length > 0;
  }

}
