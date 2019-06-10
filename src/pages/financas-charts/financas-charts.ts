import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FinancaServiceProvider } from '../../providers/financa-service/financa-service';
import { Financa } from '../../models/financa';
import { Verificacao } from '../../models/VerificacaoEnum';
import { AuthProvider } from '../../providers/auth/auth';
import { Usuario } from '../../models/usuario';


@IonicPage()
@Component({
  selector: 'page-financas-charts',
  templateUrl: 'financas-charts.html',
})
export class FinancasChartsPage {

  usuario = {} as Usuario;
  financas: Financa[] = [];
  mostrarGrafico = false;

  doughnutData:number[] = [];
  doughnutOptions:any = { 
    legend: {
      display: false
    },
    title: {
      display: true,
      text: 'Gastos por Categoria (R$)'
    }
  };

  barChartData: any[] = [];
  barChartLabels:string[] = [
    'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 
    'jul', 'ago', 'set', 'out', 'nov', 'dez'
  ];
  barOptions:any = {
    legend: {
      display: true
    },
    title: {
      display: true,
      text: 'Resumo Mensal (R$)'
    }
  };

  doughnutCategorias = [];
  categoriasMap = {
    "alimentacao": "Alimentação",
    "vestuario":"Vestuário",
    "entretenimento": "Entretenimento",
    "bebida": "Bebida",
    "supermercado": "Supermercado",
    "transporte": "Transporte",
    "eletronicos": "Eletrônicos",
    "outros": "Outros"
  }

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public FinancaService: FinancaServiceProvider,
    public authService: AuthProvider) {
      authService.getUsuario().subscribe(res =>{
        this.usuario = res as Usuario;
      });
      
  }
    
  ionViewDidLoad() { 
    this.carregaFinancas();
  }

  private carregaFinancas() {
      this.FinancaService.getFinancaListRef().valueChanges().subscribe(financas => {
        this.financas = this.filtraFinancasConfirmadas(financas as Financa[]);
        this.gerarDadosDoughnut();
        this.gerarDadosBar();
        this.mostrarGrafico = true;
      });
  }

  filtraFinancasConfirmadas(lista) {
    return lista.filter(x => x.verificacao === Verificacao.Confirmado);
  }

  private gerarDadosDoughnut() {
    const gastosCategoria = this.valoresPorCategoria();    
    const keysCategorias = Object.keys(this.categoriasMap);
    this.doughnutData = keysCategorias.map(cat => gastosCategoria[cat] || 0.0);
    this.doughnutCategorias = keysCategorias.map(key => this.categoriasMap[key]);
  }

  private valoresPorCategoria() {
    const valorCategoria = {};
    this.financas
      .filter(f => f.ehDebito)
      .map(f => {
        if(valorCategoria[f.categoria]) {
          valorCategoria[f.categoria] += f.valor; 
        } else {
          valorCategoria[f.categoria] = f.valor;
        }
    });
    return valorCategoria;
  } 

  gerarDadosBar() {
    const debPorMes = (new Array(12)).fill(0);
    const credPorMes = (new Array(12)).fill(0);

    this.financas.map(f => {
      const finDate = new Date(f.data);
      const mes = finDate.getMonth();
      if (f.ehDebito) {
        debPorMes[mes] += f.valor;
      } else {
        credPorMes[mes] += f.valor;
      }
    });

    this.barChartData = [
      {data: debPorMes, label: 'Débito'},
      {data: credPorMes, label: 'Crédito'}
    ];
  }
}
