import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { PerfilPage } from '../pages/perfil/perfil';
import { SobrePage } from '../pages/sobre/sobre';
import { AuthProvider } from '../providers/auth/auth';
import { LoginCadastroPage } from '../pages/login-cadastro/login-cadastro';
import { OneSignal } from '@ionic-native/onesignal';
import { NotificationProvider } from '../providers/notification/notification';
import { IntroducaoPage } from '../pages/introducao/introducao';
import { Storage } from '@ionic/storage';
import { FinancasPage } from '../pages/financas/financas';
import { AmigosPage } from '../pages/amigos/amigos';
import { FinancasChartsPage } from '../pages/financas-charts/financas-charts';
import { AtivosFinanceirosPage } from '../pages/ativos-financeiros/ativos-financeiros';
import { PagamentosPage } from '../pages/pagamentos/pagamentos';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public autenticacao: AuthProvider,
    public notification: NotificationProvider,
    public oneSignal: OneSignal,
    private storage: Storage) {

    this.setPages();
    this.setupApp();    
  }

  private setupApp() {
    this.platform.ready().then(() => {
      this.autenticacao.retornaUserObservable().subscribe(
        user => {
          if (user) {
            if(this.platform.is("cordova")) {
              this.notification.iniciarOneSignal().then(result => {
                this.autenticacao.salvarOneSignalInfo(result.userId, result.pushToken);
              });
              this.splashScreen.hide();
              this.statusBar.backgroundColorByHexString("#006400");
            }  
            this.rootPage = FinancasChartsPage;
          } else {
            this.storage.get('introducaoVista').then((introducaoVista) => {
              if (!introducaoVista) {
                this.rootPage = IntroducaoPage;
              }
              else {
                this.rootPage = LoginCadastroPage;
              }
          });
        }
      });
    });
  }

  private setPages() {
    this.pages = [
      { title: 'Estatísticas', component: FinancasChartsPage },
      { title: 'Minhas finanças', component: FinancasPage },
      { title: 'Dívidas e empréstimos', component: HomePage },
      { title: 'Pagamentos', component: PagamentosPage },
      { title: 'Ativos financeiros', component: AtivosFinanceirosPage },
      { title: 'Perfil', component: PerfilPage },
      { title: 'Amigos', component: AmigosPage },
      { title: 'Sobre', component: SobrePage }
    ];
  }

  logout() {
    this.autenticacao.logout();
    this.rootPage = LoginCadastroPage;
  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
