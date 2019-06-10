import { MyApp } from './app.component';

import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, AlertController, IonicPageModule } from 'ionic-angular';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

import { FIREBASE_CONFIG } from './firebase.credentials';

import { ImageViewerController } from 'ionic-img-viewer';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { OneSignal } from '@ionic-native/onesignal';
import { IonicStorageModule } from '@ionic/storage';
import { ImagePicker } from '@ionic-native/image-picker';

import { ChartsModule } from 'ng2-charts';
import { BrMaskerModule } from 'brmasker-ionic-3';

import { AuthProvider } from '../providers/auth/auth';
import { ChatService } from '../providers/chat-service/chat-service';
import { MetaServiceProvider } from '../providers/meta-service/meta-service';
import { NotificationProvider } from '../providers/notification/notification';
import { AmigosServiceProvider } from '../providers/amigos-service/amigos-service';
import { DividaServiceProvider } from '../providers/divida-service/divida-service';
import { AcordoServiceProvider } from '../providers/acordo-service/acordo-service';
import { FinancaServiceProvider } from '../providers/financa-service/financa-service';
import { PagamentoServiceProvider } from '../providers/pagamento-service/pagamento-service';

import { MostraDividaPageModule } from '../pages/mostra-divida/mostra-divida.module';
import { MostraEmprestimoPageModule } from '../pages/mostra-emprestimo/mostra-emprestimo.module';
import { AdicionaAcordoPageModule } from '../pages/adiciona-acordo/adiciona-acordo.module';
import { EditaAcordoPageModule } from '../pages/edita-acordo/edita-acordo.module';
import { AdicionaAmigoPageModule } from '../pages/adiciona-amigo/adiciona-amigo.module';
import { AtivosFinanceirosPageModule } from '../pages/ativos-financeiros/ativos-financeiros.module';
import { IntroducaoPageModule } from '../pages/introducao/introducao.module';

import { HomePage } from '../pages/home/home';
import { PerfilPage } from '../pages/perfil/perfil';
import { SobrePage } from '../pages/sobre/sobre';
import { FinancasPage } from '../pages/financas/financas';
import { AmigosPage } from '../pages/amigos/amigos';
import { ChatRoomPage } from '../pages/chat-room/chat-room';
import { FinancasChartsPage } from '../pages/financas-charts/financas-charts';
import { LoginCadastroPage } from '../pages/login-cadastro/login-cadastro';
import { AtivosFinanceirosPage } from '../pages/ativos-financeiros/ativos-financeiros';
import { PagamentosPage } from '../pages/pagamentos/pagamentos';
import { DetalhesAmigosPage } from '../pages/detalhes-amigos/detalhes-amigos';

import { AdicionaDividaPage } from '../pages/adiciona-divida/adiciona-divida';
import { AdicionaEmprestimoPage } from '../pages/adiciona-emprestimo/adiciona-emprestimo';
import { AdicionaFinancaPage } from '../pages/adiciona-financa/adiciona-financa';
import { AdicionaMetaPage } from '../pages/adiciona-meta/adiciona-meta';
import { AdicionaPagamentoPage } from '../pages/adiciona-pagamento/adiciona-pagamento';

import { EditaDividaPage } from '../pages/edita-divida/edita-divida';
import { EditaEmprestimoPage } from '../pages/edita-emprestimo/edita-emprestimo';
import { EditaFinancaPage } from '../pages/edita-financa/edita-financa';
import { EditaMetaPage } from '../pages/edita-meta/edita-meta';
import { EditaPagamentoPage } from '../pages/edita-pagamento/edita-pagamento';
import { EditaPerfilPage } from '../pages/edita-perfil/edita-perfil';
import { AdicionaDinheiroPageModule } from '../pages/adiciona-dinheiro/adiciona-dinheiro.module';
import { RealizaPagamentoPageModule } from '../pages/realiza-pagamento/realiza-pagamento.module';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FinancasPage,
    PerfilPage,
    AmigosPage,
    PagamentosPage,
    SobrePage,
    AdicionaEmprestimoPage,
    AdicionaDividaPage,
    EditaDividaPage,
    EditaEmprestimoPage,
    AdicionaFinancaPage,
    EditaFinancaPage,
    FinancasChartsPage,
    AdicionaMetaPage,
    EditaMetaPage,
    AdicionaPagamentoPage,
    EditaPagamentoPage,
    LoginCadastroPage,
    EditaPerfilPage,
    DetalhesAmigosPage,
    ChatRoomPage
    ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    IonicStorageModule.forRoot(),
    AngularFireDatabaseModule,
    MostraDividaPageModule,
    MostraEmprestimoPageModule,
    AngularFireAuthModule,
    AdicionaAcordoPageModule,
    EditaAcordoPageModule,
    IntroducaoPageModule,
    BrMaskerModule,
    ChartsModule,
    AtivosFinanceirosPageModule,
    AdicionaAmigoPageModule,
    IonicPageModule.forChild(LoginCadastroPage),
    IonicPageModule.forChild(EditaPerfilPage),
    IonicPageModule.forChild(AdicionaEmprestimoPage),
    IonicPageModule.forChild(AdicionaDividaPage),
    IonicPageModule.forChild(EditaEmprestimoPage),
    IonicPageModule.forChild(EditaDividaPage),
    IonicPageModule.forChild(AdicionaFinancaPage),
    IonicPageModule.forChild(EditaFinancaPage),
    IonicPageModule.forChild(AdicionaMetaPage),
    IonicPageModule.forChild(EditaMetaPage),
    IonicPageModule.forChild(AdicionaPagamentoPage),
    IonicPageModule.forChild(EditaPagamentoPage),
    IonicPageModule.forChild(DetalhesAmigosPage),
    IonicPageModule.forChild(ChatRoomPage),
    AdicionaDinheiroPageModule,
    RealizaPagamentoPageModule,
    ComponentsModule
    ],
  exports: [
    AdicionaEmprestimoPage,
    AdicionaDividaPage,
    AdicionaFinancaPage,
    EditaDividaPage,
    EditaEmprestimoPage,
    EditaFinancaPage,
    AdicionaMetaPage,
    EditaMetaPage,
    AdicionaPagamentoPage,
    EditaPagamentoPage,
    LoginCadastroPage,
    EditaPerfilPage,
    DetalhesAmigosPage,
    BrMaskerModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FinancasPage,
    PerfilPage,
    AmigosPage,
    PagamentosPage,
    SobrePage,
    FinancasChartsPage,
    AtivosFinanceirosPage,
    SobrePage
    ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    File, 
    HttpClient,
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DividaServiceProvider,
    AuthProvider,
    OneSignal,
    AlertController,
    AcordoServiceProvider,
    NotificationProvider,
    FinancaServiceProvider,
    MetaServiceProvider,
    AmigosServiceProvider,
    PagamentoServiceProvider,
    ImageViewerController,
    ImagePicker,
    ChatService,
    AngularFirestore
  ]
})
export class AppModule {}