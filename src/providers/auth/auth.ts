import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase/app';
import md5 from 'crypto-md5';

import { Observable } from 'rxjs/Observable';
import { Usuario } from '../../models/usuario'
import { NotificationProvider } from '../notification/notification';
import { Cartao } from '../../models/cartao';
import Utils from '../../Helper/Utils';
//import { Firebase } from 'firebase';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  private firebaseUser: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  private user = {} as Usuario;
  private usuarioLogado: Usuario;

  constructor(private firebaseAuth: AngularFireAuth, 
    public notification: NotificationProvider, 
    public db: AngularFireDatabase) {
    this.firebaseUser = this.firebaseAuth.authState;
    this.firebaseUser.subscribe(
      (firebaseUser) => {
        if (firebaseUser) {
          this.userDetails = firebaseUser;
        }
        else {
          this.userDetails = null;
        }
      }
    );
  }

  carregaUsuario() {
    return new Promise((resolve, reject) => {
      this.getUsuario().subscribe(usuario => {
        this.usuarioLogado = usuario as Usuario;
        resolve();
      });
    });
  }

  getUsuarioLogado() {
    return new Promise(resolve => {
      if(this.usuarioLogado) {
        resolve(this.usuarioLogado);
      } else {
        this.carregaUsuario()
          .then(_ => {
            resolve(this.usuarioLogado);
          });
      }
    })
  }

  getUserRef() {
    return "user-list/" + this.getUID();    
  }

  public getUsuarioObject(username) {
    return this.db.list('/user-list/', ref => ref.orderByChild('username').equalTo(username));
  }

  public getUsuarioRef(username) {
    return new Promise((resolve, reject) => {
      this.db.list("user-list/").valueChanges().subscribe(users => {
        const usuario = Object.keys(users).reduce((acum, key) => {
          const user = users[key] as Usuario;
          if (user.username.toLowerCase() === username.toLowerCase()) {
            return user;
          }
          return acum;
        }, null);
        
        if (usuario != null) {
          resolve(usuario);
        } else {
          reject(null);
        }
      });
    });
  }

  public getUsuarioKey(username) {
    return new Promise((resolve, reject) => {
      var amigosRef = this.db.database.ref("/user-list/");
      amigosRef.once("value", function(allUsers) {
        allUsers.forEach(function(user) {
          // Will be called with a user for each child under the /user-list/ node
          var key = user.key;
          if (user.child("username").val().toLowerCase() === username.toLowerCase()) {
            resolve(key);
          }
        });
      });
    });
  }

  public retornaChaveUsuario(username) {
    var key = "";
    new Promise((resolve, reject) => {
      var amigosRef = this.db.database.ref("/user-list/");
      amigosRef.once("value", function(allUsers) {
        allUsers.forEach(function(user) {
          // Will be called with a user for each child under the /user-list/ node
          key = user.key;
          if (user.child("username").val().toLowerCase() === username.toLowerCase()) {
            resolve(key);
          }
        });
      });
    });
    return key;
  }


  registrar(email: string, senha: string, username: string, nome: string, profissao: string, salario: number) {
    this.user = this.mountUserObject(nome, username, email, profissao, Utils.formataValorFB(salario));
    let promise = new Promise((resolve, reject) => {
      this.firebaseAuth.auth.createUserWithEmailAndPassword(email, senha).then(result => {
        return this.db.object("user-list/" + result.user.uid).set(this.user).then(result => {
          resolve();
        });          
      }).catch(error => {
        reject(this.getErroRegistro(error));
      });
    });
    return promise;
  }

  login (email: string, senha: string) {
  	let promise = new Promise((resolve, reject) => {
      this.firebaseAuth.auth.signInWithEmailAndPassword(email, senha).then(result => {
        this.notification.iniciarOneSignal().then(result => {
          this.salvarOneSignalInfo(result.userId, result.pushToken);
        });
        resolve(result);
      }).catch(error => {
        reject(this.getErroRegistro(error));
      })
    })
    return promise;
  }

  logout () {
    this.salvarOneSignalInfo(null, null);
  	this.firebaseAuth
  	  .auth
  	  .signOut();
  }
  
  public getUID() {
    if(this.userDetails != null) {
      return this.userDetails.uid;
    } else {
      return null;
    }
  }

  public getUsername() {
    return this.carregaUsuario().then(_ => {
      return this.usuarioLogado.username;
    });
  }

  public getUserId() {
    return this.carregaUsuario().then(_ => {
      return this.usuarioLogado.userId;
    });
  }

  public getUsuario() {
    return this.db.object(this.getUserRef()).valueChanges();
  }

  public getUsuarioUser() {
    return this.user;
  }

  salvarNomeUsuario(nome: string) {
    return this.db.object(this.getUserRef()).update({ nome: nome});
  }

  salvarInformacoesUsuario(nome: string, profissao: string, salario: number) {
    return this.db.object(this.getUserRef()).update({ nome: nome, profissao: profissao, salario: Utils.formataValorFB(salario)});
  }

  salvarCarteiraUsuario(dinheiro: number, atual: number) {
    return this.db.object(this.getUserRef()).update({ carteira: atual + dinheiro });
  }

  salvarCartaoUsuario(card: Cartao) {
    return this.db.object(this.getUserRef()).update({ cartao: card });
  }

  incrementarNumPagamentos(atual: number) {
    return this.db.object(this.getUserRef()).update({ numPagamentos: atual + 1});
  }

  decrementaCarteira (atual: number, valor: number) {
    return this.db.object(this.getUserRef()).update({ carteira: atual - valor});
  }

  salvarFoto(url) {
    let promise = new Promise((resolve, reject) => {
      return firebase.storage().ref(url).getDownloadURL()
      .then(result => {
        this.db.object(this.getUserRef()).update({ fotosrc: result}).then(result => {
          resolve();
        }).catch(error => {
          reject(this.getErroRegistro(error));
        });
      });
    });
    return promise;
  }

  retornaLinkFoto() {
    firebase.storage().ref("fotosUsuarios/" + this.getUID() + ".jpg").getDownloadURL();
  }

  public retornaUserObservable() {
    return this.firebaseUser;
  }

  public getGravatarUsuario(email, imagem) {
    return "https://www.gravatar.com/avatar/" + md5(email.toLowerCase(), 'hex') + "?d=" + encodeURI(imagem);
  }

  resetarSenha(email: string) {
    let promise = new Promise((resolve, reject) => {
      this.firebaseAuth.auth.sendPasswordResetEmail(email).then(result => {
        resolve();
      }).catch(error => {
        reject(this.getErroRegistro(error));
      })
    })
    return promise;
  } 

  excluiFoto() {
    return this.db.object(this.getUserRef()).update({ fotosrc: null});
  }

  public salvarOneSignalInfo(oneSignalId: string, deviceId: string) {
    return this.db.object(this.getUserRef()).update({ userId: oneSignalId, deviceId: deviceId});
  }



  mountUserObject (nome: string, username: string, email: string, profissao: string, salario: number) {
    if (profissao == null) profissao = "";
    if (salario == null) salario = 0;
    let userInstance = {} as Usuario;
    let cartao = new Cartao();
    cartao.nomeTitular = "";
    cartao.numeroCartao = null;
    cartao.dataVencimento = null;
    cartao.codigoSeguranca = null;
    userInstance.username = username
    userInstance.email = email
    userInstance.nome = nome
    userInstance.profissao = profissao
    userInstance.salario = salario
    userInstance.numPagamentos = 0
    userInstance.carteira = 0
    userInstance.cartao = cartao
    return userInstance
  }

  private getErroRegistro(error) {
    switch (error.code) {
      case "auth/email-already-in-use": {
        return "E-mail já foi cadastrado.";
      }
      case "auth/invalid-email": {
        return "E-mail inválido.";
      }
      case "auth/wrong-password": {
        return "Senha incorreta.";
      }
      case "auth/user-not-found": {
        return "E-mail não cadastrado.";
      }
      case "auth/invalid-password": {
        return "Senha inválida.";
      }
      case "auth/weak-password": {
        return "A senha deve ter no mínimo 6 caracteres.";
      }
      case "auth/network-request-failed": {
        return "Sem conexão."
      }
      default: {
        return error;
      }
    }
  }

  formataValor(valor: number) {
    return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
  }

}
