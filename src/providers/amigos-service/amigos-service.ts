import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthProvider } from '../auth/auth';
import { Usuario } from '../../models/usuario';
import { NotificationProvider } from '../notification/notification';
import { Verificacao } from '../../models/VerificacaoEnum';
import { Amizade } from '../../models/amizade';

/*
  Generated class for the MetaServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AmigosServiceProvider {

  private amigos: Amizade[] = [];
  public amizade = {} as Amizade;

  constructor(public db: AngularFireDatabase,
    public auth: AuthProvider,
    public notificacao: NotificationProvider) {
  }

  public adicionaAmigoFB(usuario: Usuario) {
    return new Promise((resolve) => {
      this.associaAmigoFB(usuario).then(username => {
        this.auth.getUsername().then(thisUsername => {
          var amizade = this.amizadeAux(username, thisUsername);
          this.getAmigoListRef().push(amizade)
            .then(resp => {
              const novaAmizade = {
                ...amizade,
                key: resp.key//não faz nada
              };
              resolve(novaAmizade);
          });
        });
      });
    });
  }

  associaAmigoFB(usuario: Usuario) {
    return new Promise((resolve) => {
      var amigo = usuario as Usuario;
      if (Object.keys(amigo).length > 0) {
        this.auth.getUsername().then(thisUsername => {
          this.getAmigoListRefParam(amigo).then(resp => {
            var amigoList = resp as string;
            this.db.list(amigoList).push(this.amizadeAux(thisUsername, thisUsername))
            .then(resp => {
              if (amigo.userId != null) {
                this.enviarNotificacao(amigo.userId, thisUsername);
              }
              resolve(usuario.username);
            });
          });
        });
      }
    });
  }  

  public confirmaAmizadeFB(amizade: Amizade, verificacao: Verificacao) {
    return new Promise((resolve) => {
      this.auth.getUsuarioRef(amizade.amigo).then(amigo => {
        this.getAmigoListRefParam(amigo as Usuario).then(resp => {
          var amigoList = resp as string;
          this.auth.getUsername().then(thisUsername => {
            this.auth.getUsuarioKey(amizade.amigo).then(amigoKey => {
              this.getAmizadeKey(thisUsername, amigoKey as string).then(key => {
                var amizadeKey = key as string;
                this.db.list(amigoList).update(amizadeKey, {verificacao: verificacao}).then(result => {
                  this.getAmizadeKey(amizade.amigo, this.auth.getUID()).then(key2 => {
                    var thisAmizadeKey = key2 as string;
                    this.getAmigoListRef().update(thisAmizadeKey, {verificacao: verificacao}).then(result2 => {
                      resolve(amizade);
                    });
                  })
                });
              });
            });
          });
        });
      });
    });
  }

  private getAmizadeKey(usernameAmigo: string, usuarioKey: String) {
    return new Promise((resolve, reject) => {
      var amizadeRef = this.db.database.ref("/amigo-list/" + usuarioKey);
      amizadeRef.once("value", function(allAmizades) {
        allAmizades.forEach(function(amizade) {
          // Will be called with a user for each child under the /user-list/ node
          var key = amizade.key;
          if (amizade.child("amigo").val() === usernameAmigo) {
            resolve(key);
          }
        });
      });
    });
  }

  public removeAmizadeFB(usuario: Usuario) {
    return this.getAmigoListRef().remove(usuario.username);
  }

  public recebeAmizadesFB() {
    return new Promise((resolve) => {
      this.getAmigoObjRef()
      .valueChanges()
      .subscribe(amigos => {
        if(amigos) {
          this.amigos = this.mapFinObjectToList(amigos);
        }
        resolve(this.amigos);
      });
    });
  }
  
  enviarNotificacao(usuarioId: string , username) {
    const msg = "Nova solicitação de amizade de " + username + ".";
    this.notificacao.enviarNotificacao(
      usuarioId, msg, ""//colocar uma mensagem
    );
  }

  getAmigoListRef() {
    return this.db.list(this.getAmigoPath());
  }

  getAmigoObjRef() {
    return this.db.object(this.getAmigoPath());
  }

  getAmigoPath() {
    return "amigo-list/" + this.auth.getUID();
  }

  getAmigoListRefParam(usuario: Usuario) {
    return new Promise((resolve, reject) => {
      this.auth.getUsuarioKey(usuario.username).then(key => {
        resolve("amigo-list/" + key);
      });
    });
  }

  mapFinObjectToList(amigoObj:{}) {
    return Object.keys(amigoObj)
      .map(key => {
        let amigo = amigoObj[key];
        return this.setAmigoKey(amigo, key);
      });
  }

  setAmigoKey(amigo: {}, key: string) {
    return {
      ...amigo,
      key: key
    } as Amizade;
  }

  amizadeAux(username, criador) {
    this.amizade.criador = criador;
    this.amizade.amigo = username;
    this.amizade.verificacao = Verificacao.Pendente;
    return this.amizade;
  }

}
