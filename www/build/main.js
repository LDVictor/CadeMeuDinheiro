webpackJsonp([18],{

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_auth__ = __webpack_require__(318);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_database__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase_app__ = __webpack_require__(314);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_firebase_app__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_crypto_md5__ = __webpack_require__(717);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_crypto_md5___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_crypto_md5__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__notification_notification__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_cartao__ = __webpack_require__(809);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Helper_Utils__ = __webpack_require__(66);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








//import { Firebase } from 'firebase';
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var AuthProvider = /** @class */ (function () {
    function AuthProvider(firebaseAuth, notification, db) {
        var _this = this;
        this.firebaseAuth = firebaseAuth;
        this.notification = notification;
        this.db = db;
        this.userDetails = null;
        this.user = {};
        this.firebaseUser = this.firebaseAuth.authState;
        this.firebaseUser.subscribe(function (firebaseUser) {
            if (firebaseUser) {
                _this.userDetails = firebaseUser;
            }
            else {
                _this.userDetails = null;
            }
        });
    }
    AuthProvider.prototype.carregaUsuario = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getUsuario().subscribe(function (usuario) {
                _this.usuarioLogado = usuario;
                resolve();
            });
        });
    };
    AuthProvider.prototype.getUsuarioLogado = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.usuarioLogado) {
                resolve(_this.usuarioLogado);
            }
            else {
                _this.carregaUsuario()
                    .then(function (_) {
                    resolve(_this.usuarioLogado);
                });
            }
        });
    };
    AuthProvider.prototype.getUserRef = function () {
        return "user-list/" + this.getUID();
    };
    AuthProvider.prototype.getUsuarioObject = function (username) {
        return this.db.list('/user-list/', function (ref) { return ref.orderByChild('username').equalTo(username); });
    };
    AuthProvider.prototype.getUsuarioRef = function (username) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.list("user-list/").valueChanges().subscribe(function (users) {
                var usuario = Object.keys(users).reduce(function (acum, key) {
                    var user = users[key];
                    if (user.username.toLowerCase() === username.toLowerCase()) {
                        return user;
                    }
                    return acum;
                }, null);
                if (usuario != null) {
                    resolve(usuario);
                }
                else {
                    reject(null);
                }
            });
        });
    };
    AuthProvider.prototype.getUsuarioKey = function (username) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var amigosRef = _this.db.database.ref("/user-list/");
            amigosRef.once("value", function (allUsers) {
                allUsers.forEach(function (user) {
                    // Will be called with a user for each child under the /user-list/ node
                    var key = user.key;
                    if (user.child("username").val().toLowerCase() === username.toLowerCase()) {
                        resolve(key);
                    }
                });
            });
        });
    };
    AuthProvider.prototype.retornaChaveUsuario = function (username) {
        var _this = this;
        var key = "";
        new Promise(function (resolve, reject) {
            var amigosRef = _this.db.database.ref("/user-list/");
            amigosRef.once("value", function (allUsers) {
                allUsers.forEach(function (user) {
                    // Will be called with a user for each child under the /user-list/ node
                    key = user.key;
                    if (user.child("username").val().toLowerCase() === username.toLowerCase()) {
                        resolve(key);
                    }
                });
            });
        });
        return key;
    };
    AuthProvider.prototype.registrar = function (email, senha, username, nome, profissao, salario) {
        var _this = this;
        this.user = this.mountUserObject(nome, username, email, profissao, __WEBPACK_IMPORTED_MODULE_7__Helper_Utils__["a" /* default */].formataValorFB(salario));
        var promise = new Promise(function (resolve, reject) {
            _this.firebaseAuth.auth.createUserWithEmailAndPassword(email, senha).then(function (result) {
                return _this.db.object("user-list/" + result.user.uid).set(_this.user).then(function (result) {
                    resolve();
                });
            }).catch(function (error) {
                reject(_this.getErroRegistro(error));
            });
        });
        return promise;
    };
    AuthProvider.prototype.login = function (email, senha) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.firebaseAuth.auth.signInWithEmailAndPassword(email, senha).then(function (result) {
                _this.notification.iniciarOneSignal().then(function (result) {
                    _this.salvarOneSignalInfo(result.userId, result.pushToken);
                });
                resolve(result);
            }).catch(function (error) {
                reject(_this.getErroRegistro(error));
            });
        });
        return promise;
    };
    AuthProvider.prototype.logout = function () {
        this.salvarOneSignalInfo(null, null);
        this.firebaseAuth
            .auth
            .signOut();
    };
    AuthProvider.prototype.getUID = function () {
        if (this.userDetails != null) {
            return this.userDetails.uid;
        }
        else {
            return null;
        }
    };
    AuthProvider.prototype.getUsername = function () {
        var _this = this;
        return this.carregaUsuario().then(function (_) {
            return _this.usuarioLogado.username;
        });
    };
    AuthProvider.prototype.getUserId = function () {
        var _this = this;
        return this.carregaUsuario().then(function (_) {
            return _this.usuarioLogado.userId;
        });
    };
    AuthProvider.prototype.getUsuario = function () {
        return this.db.object(this.getUserRef()).valueChanges();
    };
    AuthProvider.prototype.getUsuarioUser = function () {
        return this.user;
    };
    AuthProvider.prototype.salvarNomeUsuario = function (nome) {
        return this.db.object(this.getUserRef()).update({ nome: nome });
    };
    AuthProvider.prototype.salvarInformacoesUsuario = function (nome, profissao, salario) {
        return this.db.object(this.getUserRef()).update({ nome: nome, profissao: profissao, salario: __WEBPACK_IMPORTED_MODULE_7__Helper_Utils__["a" /* default */].formataValorFB(salario) });
    };
    AuthProvider.prototype.salvarCarteiraUsuario = function (dinheiro, atual) {
        return this.db.object(this.getUserRef()).update({ carteira: atual + dinheiro });
    };
    AuthProvider.prototype.salvarCartaoUsuario = function (card) {
        return this.db.object(this.getUserRef()).update({ cartao: card });
    };
    AuthProvider.prototype.incrementarNumPagamentos = function (atual) {
        return this.db.object(this.getUserRef()).update({ numPagamentos: atual + 1 });
    };
    AuthProvider.prototype.decrementaCarteira = function (atual, valor) {
        return this.db.object(this.getUserRef()).update({ carteira: atual - valor });
    };
    AuthProvider.prototype.salvarFoto = function (url) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            return __WEBPACK_IMPORTED_MODULE_3_firebase_app___default.a.storage().ref(url).getDownloadURL()
                .then(function (result) {
                _this.db.object(_this.getUserRef()).update({ fotosrc: result }).then(function (result) {
                    resolve();
                }).catch(function (error) {
                    reject(_this.getErroRegistro(error));
                });
            });
        });
        return promise;
    };
    AuthProvider.prototype.retornaLinkFoto = function () {
        __WEBPACK_IMPORTED_MODULE_3_firebase_app___default.a.storage().ref("fotosUsuarios/" + this.getUID() + ".jpg").getDownloadURL();
    };
    AuthProvider.prototype.retornaUserObservable = function () {
        return this.firebaseUser;
    };
    AuthProvider.prototype.getGravatarUsuario = function (email, imagem) {
        return "https://www.gravatar.com/avatar/" + __WEBPACK_IMPORTED_MODULE_4_crypto_md5___default()(email.toLowerCase(), 'hex') + "?d=" + encodeURI(imagem);
    };
    AuthProvider.prototype.resetarSenha = function (email) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.firebaseAuth.auth.sendPasswordResetEmail(email).then(function (result) {
                resolve();
            }).catch(function (error) {
                reject(_this.getErroRegistro(error));
            });
        });
        return promise;
    };
    AuthProvider.prototype.excluiFoto = function () {
        return this.db.object(this.getUserRef()).update({ fotosrc: null });
    };
    AuthProvider.prototype.salvarOneSignalInfo = function (oneSignalId, deviceId) {
        return this.db.object(this.getUserRef()).update({ userId: oneSignalId, deviceId: deviceId });
    };
    AuthProvider.prototype.mountUserObject = function (nome, username, email, profissao, salario) {
        if (profissao == null)
            profissao = "";
        if (salario == null)
            salario = 0;
        var userInstance = {};
        var cartao = new __WEBPACK_IMPORTED_MODULE_6__models_cartao__["a" /* Cartao */]();
        cartao.nomeTitular = "";
        cartao.numeroCartao = null;
        cartao.dataVencimento = null;
        cartao.codigoSeguranca = null;
        userInstance.username = username;
        userInstance.email = email;
        userInstance.nome = nome;
        userInstance.profissao = profissao;
        userInstance.salario = salario;
        userInstance.numPagamentos = 0;
        userInstance.carteira = 0;
        userInstance.cartao = cartao;
        return userInstance;
    };
    AuthProvider.prototype.getErroRegistro = function (error) {
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
                return "Sem conexão.";
            }
            default: {
                return error;
            }
        }
    };
    AuthProvider.prototype.formataValor = function (valor) {
        return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
    };
    AuthProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_angularfire2_auth__["a" /* AngularFireAuth */],
            __WEBPACK_IMPORTED_MODULE_5__notification_notification__["a" /* NotificationProvider */],
            __WEBPACK_IMPORTED_MODULE_2_angularfire2_database__["a" /* AngularFireDatabase */]])
    ], AuthProvider);
    return AuthProvider;
}());

//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 120:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AmigosServiceProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__notification_notification__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_VerificacaoEnum__ = __webpack_require__(42);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/*
  Generated class for the MetaServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var AmigosServiceProvider = /** @class */ (function () {
    function AmigosServiceProvider(db, auth, notificacao) {
        this.db = db;
        this.auth = auth;
        this.notificacao = notificacao;
        this.amigos = [];
        this.amizade = {};
    }
    AmigosServiceProvider.prototype.adicionaAmigoFB = function (usuario) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.associaAmigoFB(usuario).then(function (username) {
                _this.auth.getUsername().then(function (thisUsername) {
                    var amizade = _this.amizadeAux(username, thisUsername);
                    _this.getAmigoListRef().push(amizade)
                        .then(function (resp) {
                        var novaAmizade = __assign({}, amizade, { key: resp.key //não faz nada
                         });
                        resolve(novaAmizade);
                    });
                });
            });
        });
    };
    AmigosServiceProvider.prototype.associaAmigoFB = function (usuario) {
        var _this = this;
        return new Promise(function (resolve) {
            var amigo = usuario;
            if (Object.keys(amigo).length > 0) {
                _this.auth.getUsername().then(function (thisUsername) {
                    _this.getAmigoListRefParam(amigo).then(function (resp) {
                        var amigoList = resp;
                        _this.db.list(amigoList).push(_this.amizadeAux(thisUsername, thisUsername))
                            .then(function (resp) {
                            if (amigo.userId != null) {
                                _this.enviarNotificacao(amigo.userId, thisUsername);
                            }
                            resolve(usuario.username);
                        });
                    });
                });
            }
        });
    };
    AmigosServiceProvider.prototype.confirmaAmizadeFB = function (amizade, verificacao) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.auth.getUsuarioRef(amizade.amigo).then(function (amigo) {
                _this.getAmigoListRefParam(amigo).then(function (resp) {
                    var amigoList = resp;
                    _this.auth.getUsername().then(function (thisUsername) {
                        _this.auth.getUsuarioKey(amizade.amigo).then(function (amigoKey) {
                            _this.getAmizadeKey(thisUsername, amigoKey).then(function (key) {
                                var amizadeKey = key;
                                _this.db.list(amigoList).update(amizadeKey, { verificacao: verificacao }).then(function (result) {
                                    _this.getAmizadeKey(amizade.amigo, _this.auth.getUID()).then(function (key2) {
                                        var thisAmizadeKey = key2;
                                        _this.getAmigoListRef().update(thisAmizadeKey, { verificacao: verificacao }).then(function (result2) {
                                            resolve(amizade);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    };
    AmigosServiceProvider.prototype.getAmizadeKey = function (usernameAmigo, usuarioKey) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var amizadeRef = _this.db.database.ref("/amigo-list/" + usuarioKey);
            amizadeRef.once("value", function (allAmizades) {
                allAmizades.forEach(function (amizade) {
                    // Will be called with a user for each child under the /user-list/ node
                    var key = amizade.key;
                    if (amizade.child("amigo").val() === usernameAmigo) {
                        resolve(key);
                    }
                });
            });
        });
    };
    AmigosServiceProvider.prototype.removeAmizadeFB = function (usuario) {
        return this.getAmigoListRef().remove(usuario.username);
    };
    AmigosServiceProvider.prototype.recebeAmizadesFB = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.getAmigoObjRef()
                .valueChanges()
                .subscribe(function (amigos) {
                if (amigos) {
                    _this.amigos = _this.mapFinObjectToList(amigos);
                }
                resolve(_this.amigos);
            });
        });
    };
    AmigosServiceProvider.prototype.enviarNotificacao = function (usuarioId, username) {
        var msg = "Nova solicitação de amizade de " + username + ".";
        this.notificacao.enviarNotificacao(usuarioId, msg, "" //colocar uma mensagem
        );
    };
    AmigosServiceProvider.prototype.getAmigoListRef = function () {
        return this.db.list(this.getAmigoPath());
    };
    AmigosServiceProvider.prototype.getAmigoObjRef = function () {
        return this.db.object(this.getAmigoPath());
    };
    AmigosServiceProvider.prototype.getAmigoPath = function () {
        return "amigo-list/" + this.auth.getUID();
    };
    AmigosServiceProvider.prototype.getAmigoListRefParam = function (usuario) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.auth.getUsuarioKey(usuario.username).then(function (key) {
                resolve("amigo-list/" + key);
            });
        });
    };
    AmigosServiceProvider.prototype.mapFinObjectToList = function (amigoObj) {
        var _this = this;
        return Object.keys(amigoObj)
            .map(function (key) {
            var amigo = amigoObj[key];
            return _this.setAmigoKey(amigo, key);
        });
    };
    AmigosServiceProvider.prototype.setAmigoKey = function (amigo, key) {
        return __assign({}, amigo, { key: key });
    };
    AmigosServiceProvider.prototype.amizadeAux = function (username, criador) {
        this.amizade.criador = criador;
        this.amizade.amigo = username;
        this.amizade.verificacao = __WEBPACK_IMPORTED_MODULE_4__models_VerificacaoEnum__["a" /* Verificacao */].Pendente;
        return this.amizade;
    };
    AmigosServiceProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_angularfire2_database__["a" /* AngularFireDatabase */],
            __WEBPACK_IMPORTED_MODULE_2__auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_3__notification_notification__["a" /* NotificationProvider */]])
    ], AmigosServiceProvider);
    return AmigosServiceProvider;
}());

//# sourceMappingURL=amigos-service.js.map

/***/ }),

/***/ 121:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PagamentoServiceProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Helper_Utils__ = __webpack_require__(66);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PagamentoServiceProvider = /** @class */ (function () {
    function PagamentoServiceProvider(db, auth) {
        this.db = db;
        this.auth = auth;
        this.pagamentos = [];
    }
    PagamentoServiceProvider.prototype.adicionaPagamentoFB = function (pagamento) {
        var _this = this;
        pagamento.valor = __WEBPACK_IMPORTED_MODULE_3__Helper_Utils__["a" /* default */].formataValorFB(pagamento.valor);
        return new Promise(function (resolve) {
            _this.getPagamentoListRef().push(pagamento)
                .then(function (resp) {
                var novoPagamento = _this.setPagamentoKey(pagamento, resp.key);
                resolve(novoPagamento);
            });
        });
    };
    PagamentoServiceProvider.prototype.editaPagamentoFB = function (pagamento) {
        pagamento.valor = __WEBPACK_IMPORTED_MODULE_3__Helper_Utils__["a" /* default */].formataValorFB(pagamento.valor);
        return this.getPagamentoListRef().update(pagamento.key, pagamento);
    };
    PagamentoServiceProvider.prototype.removePagamentoFB = function (pagamento) {
        return this.getPagamentoListRef().remove(pagamento.key);
    };
    PagamentoServiceProvider.prototype.recebePagamentosFB = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.getPagamentoObjRef()
                .valueChanges()
                .subscribe(function (pagamentos) {
                if (pagamentos) {
                    _this.pagamentos = _this.mapFinObjectToList(pagamentos);
                }
                resolve(_this.pagamentos);
            });
        });
    };
    PagamentoServiceProvider.prototype.getPagamentoListRef = function () {
        return this.db.list(this.getPagamentoPath());
    };
    PagamentoServiceProvider.prototype.getPagamentoObjRef = function () {
        return this.db.object(this.getPagamentoPath());
    };
    PagamentoServiceProvider.prototype.getPagamentoPath = function () {
        return "Pagamento-list/" + this.auth.getUID();
    };
    PagamentoServiceProvider.prototype.getPagamentoListRefParam = function (username) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.auth.getUsuarioKey(username).then(function (key) {
                resolve("Pagamento-list/" + key);
            });
        });
    };
    PagamentoServiceProvider.prototype.mapFinObjectToList = function (PagamentoObj) {
        var _this = this;
        return Object.keys(PagamentoObj)
            .map(function (key) {
            var Pagamento = PagamentoObj[key];
            return _this.setPagamentoKey(Pagamento, key);
        });
    };
    PagamentoServiceProvider.prototype.setPagamentoKey = function (Pagamento, key) {
        return __assign({}, Pagamento, { key: key });
    };
    PagamentoServiceProvider.prototype.formataValor = function (valor) {
        return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
    };
    PagamentoServiceProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_angularfire2_database__["a" /* AngularFireDatabase */],
            __WEBPACK_IMPORTED_MODULE_2__auth_auth__["a" /* AuthProvider */]])
    ], PagamentoServiceProvider);
    return PagamentoServiceProvider;
}());

//# sourceMappingURL=pagamento-service.js.map

/***/ }),

/***/ 127:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginCadastroPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(188);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the LoginCadastroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var LoginCadastroPage = /** @class */ (function () {
    function LoginCadastroPage(navCtrl, navParams, toastCtrl, autenticacao, menuController) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.autenticacao = autenticacao;
        this.menuController = menuController;
        this.usuario = {};
        this.isCadastro = 0; // 0 = login, 1 = cadastro, 2 = esqueci minha senha
        this.nomeVazio = false;
        this.usernameVazio = false;
        this.emailVazio = false;
        this.senhaVazia = false;
        this.senhaInvalida = false;
    }
    LoginCadastroPage.prototype.ionViewWillEnter = function () {
        this.menuController.enable(false);
    };
    LoginCadastroPage.prototype.ionViewWillLeave = function () {
        this.menuController.enable(true);
    };
    LoginCadastroPage.prototype.ionViewDidLoad = function () { };
    LoginCadastroPage.prototype.loginOuCadastro = function (resposta) {
        if (resposta === "login") {
            this.isCadastro = 0;
        }
        else if (resposta === "cadastro") {
            this.isCadastro = 1;
        }
        else {
            this.isCadastro = 2;
        }
    };
    LoginCadastroPage.prototype.abrirToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    };
    LoginCadastroPage.prototype.esqueciSenhaTemp = function () {
        this.abrirToast("Essa função será implementada em breve!");
    };
    LoginCadastroPage.prototype.realizaLogin = function () {
        var _this = this;
        if (!this.confirmaDadosLogin()) {
            this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
        }
        else {
            this.autenticacao.login(this.email, this.senha).then(function (result) {
                _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */]);
                _this.abrirToast("Bem-vindo(a) de volta!");
            }, function (error) {
                _this.abrirToast(error);
            });
        }
    };
    LoginCadastroPage.prototype.realizaCadastro = function () {
        var _this = this;
        if (!this.confirmaDadosCadastro()) {
            this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
        }
        else {
            this.autenticacao.registrar(this.email, this.senha, this.username, this.nome, this.profissao, this.salario).then(function (result) {
                _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */]);
                _this.abrirToast("Olá, " + _this.nome + "!");
            }, function (error) {
                _this.abrirToast(error);
            });
        }
    };
    LoginCadastroPage.prototype.alterarSenha = function (email) {
        var _this = this;
        this.autenticacao.resetarSenha(email).then(function (result) {
            _this.abrirToast("E-mail para recuperação de senha enviado.");
            _this.isCadastro = 0;
        }, function (error) {
            _this.abrirToast(error);
        });
    };
    LoginCadastroPage.prototype.confirmaDadosLogin = function () {
        this.emailVazio = this.email == "" || this.email == null;
        this.senhaVazia = this.senha == "" || this.senha == null;
        return !this.emailVazio && !this.senhaVazia;
    };
    LoginCadastroPage.prototype.confirmaDadosCadastro = function () {
        this.nomeVazio = this.nome == "" || this.nome == null;
        this.usernameVazio = this.username == "" || this.username == null;
        this.emailVazio = this.email == "" || this.email == null;
        this.senhaVazia = this.senha == "" || this.senha == null;
        this.senhaInvalida = this.senha != "" && this.senha.length < 6;
        return !this.nomeVazio && !this.usernameVazio && !this.emailVazio && !this.senhaVazia && !this.senhaInvalida;
    };
    LoginCadastroPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-login-cadastro',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/login-cadastro/login-cadastro.html"*/'<ion-header>\n  <ion-navbar color="corPrimaria">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Cadê Meu Dinheiro</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content class="cor-background">\n\n  <img padding src="assets/imgs/cmd.png">\n\n<div *ngIf="isCadastro == 0">\n  <ion-card>\n    <ion-card-header color="corPrimaria">\n      Login\n    </ion-card-header>\n\n    <ion-item>\n      <ion-icon name=\'mail\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" placeholder="E-mail" [(ngModel)]="email"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="emailVazio">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite seu endereço de e-mail.</p>\n    </ion-item>\n\n    <ion-item>\n      <ion-icon name=\'key\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="password" [(ngModel)]="senha" placeholder="Senha"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="senhaVazia">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite sua senha.</p>\n    </ion-item>\n\n  </ion-card>\n</div>\n\n<div *ngIf="isCadastro == 1">\n  <ion-card>\n    <ion-card-header color="corEmprestimo">\n      Cadastrar\n    </ion-card-header>\n\n    <ion-item>\n      <ion-icon name=\'person\' item-start color="corEmprestimo"></ion-icon>\n      <ion-input type="text" placeholder="Nome" [(ngModel)]="nome"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="nomeVazio">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite seu nome.</p>\n    </ion-item>\n\n    <ion-item>\n      <ion-icon name=\'contact\' item-start color="corEmprestimo"></ion-icon>\n      <ion-input type="text" placeholder="Usuário" [(ngModel)]="username"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="usernameVazio">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite seu nome de usuário.</p>\n    </ion-item>\n\n    <ion-item>\n      <ion-icon name=\'mail\' item-start color="corEmprestimo"></ion-icon>\n      <ion-input type="text" placeholder="Email" [(ngModel)]="email"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="emailVazio">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite seu endereço de e-mail.</p>\n    </ion-item>\n\n    <ion-item>\n      <ion-icon name=\'key\' item-start color="corEmprestimo"></ion-icon>\n      <ion-input type="password" [(ngModel)]="senha" placeholder="Senha"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="senhaVazia">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite sua senha.</p>\n    </ion-item>\n    <ion-item *ngIf="senhaInvalida">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">A senha deve conter no mínimo 6 caracteres.</p>\n    </ion-item>\n\n  </ion-card>\n  <ion-card>\n    <ion-card-header color="corEmprestimo">\n      Informações adicionais\n    </ion-card-header>\n\n    <ion-item>\n      <ion-icon name=\'briefcase\' item-start color="corEmprestimo"></ion-icon>\n      <ion-input type="text" placeholder="Profissão" [(ngModel)]="profissao"></ion-input>\n    </ion-item>\n\n    <ion-item>\n      <ion-icon name=\'logo-usd\' item-start color="corEmprestimo"></ion-icon>\n      <ion-input type="text" name="money" placeholder="Salário" [brmasker]="{money: true, thousand: \'.\',  decimalCaracter: \',\', len: 11}" [(ngModel)]="salario"></ion-input>\n    </ion-item>\n\n  </ion-card>\n\n</div>\n\n<div *ngIf="isCadastro == 2">\n  <ion-card>\n    <ion-card-header color="corDivida">\n      Esqueci minha senha\n    </ion-card-header>\n\n    <ion-item>\n      <ion-icon name=\'mail\' item-start color="corDivida"></ion-icon>\n      <ion-input type="text" placeholder="E-mail" [(ngModel)]="email"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="emailVazio">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite seu endereço de e-mail.</p>\n    </ion-item>\n  </ion-card>\n\n</div>\n\n<ion-row>\n  <ion-col width-50 style="text-align: center">\n    <button padding ion-button clear icon-start color="corEmprestimo" *ngIf="isCadastro == 0" (click)="loginOuCadastro(\'cadastro\')">\n        <ion-icon color="corEmprestimo" name="send"></ion-icon>\n      Primeira vez no app? Registre-se!\n    </button>\n    <button padding ion-button clear icon-start color="corPrimaria" *ngIf="isCadastro == 1 || isCadastro == 2" (click)="loginOuCadastro(\'login\')">\n      <ion-icon color="corPrimaria" name="arrow-dropleft"></ion-icon>\n      Voltar para login\n    </button>\n    <button padding ion-button clear icon-start color="corDivida" *ngIf="isCadastro == 0" (click)="loginOuCadastro(\'senha\')">\n        <ion-icon color="corDivida" name="lock"></ion-icon>\n      Esqueci minha senha\n    </button>\n    </ion-col>\n</ion-row>\n\n\n<ion-fab *ngIf="isCadastro == 0" bottom right>\n  <button ion-fab (click)="realizaLogin()" color="corPrimaria">\n    <ion-icon name="log-in"></ion-icon>\n  </button>\n</ion-fab>\n\n\n<ion-fab *ngIf="isCadastro == 1" bottom right>\n  <button ion-fab (click)="realizaCadastro()" color="corEmprestimo">\n    <ion-icon name="arrow-dropright-circle"></ion-icon>\n  </button>\n</ion-fab>\n\n<ion-fab *ngIf="isCadastro == 2" bottom right>\n  <button ion-fab (click)="alterarSenha(email)" color="corDivida">\n    <ion-icon name="send"></ion-icon>\n  </button>\n</ion-fab>\n\n</ion-content>\n'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/login-cadastro/login-cadastro.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* MenuController */]])
    ], LoginCadastroPage);
    return LoginCadastroPage;
}());

//# sourceMappingURL=login-cadastro.js.map

/***/ }),

/***/ 168:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdicionaAcordoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_acordo_service_acordo_service__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__ = __webpack_require__(32);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the AdicionaAcordoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var AdicionaAcordoPage = /** @class */ (function () {
    function AdicionaAcordoPage(navCtrl, navParams, toastCtrl, acordoService, statusBar) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.acordoService = acordoService;
        this.statusBar = statusBar;
        this.acordo = {};
        this.divida = {};
        this.dataVazia = false;
        this.horaVazia = false;
        this.localVazio = false;
        this.descricaoVazia = false;
    }
    AdicionaAcordoPage.prototype.ionViewDidLoad = function () { };
    AdicionaAcordoPage.prototype.ionViewWillEnter = function () {
        this.divida = this.navParams.data[0];
        this.tipo = this.navParams.data[1];
        this.statusBar.backgroundColorByHexString("#006400");
    };
    AdicionaAcordoPage.prototype.adicionaAcordo = function () {
        var _this = this;
        if (!this.confirmaDados()) {
            this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
        }
        else {
            this.acordoService.adicionaAcordo(this.divida, this.acordo, this.tipo).then(function (_) {
                _this.navCtrl.pop();
                _this.abrirToast("O acordo adicionado.");
            }).catch(function (err) {
                _this.abrirToast("Ocorreu um erro ao tentar adicionar o acordo! :(");
            });
        }
    };
    AdicionaAcordoPage.prototype.abrirToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    };
    AdicionaAcordoPage.prototype.confirmaDados = function () {
        this.dataVazia = this.acordo.data == null;
        this.horaVazia = this.acordo.hora == null;
        this.descricaoVazia = this.acordo.descricao == "" || this.acordo.descricao == null;
        this.localVazio = this.acordo.local == "" || this.acordo.local == null;
        return !this.dataVazia && !this.horaVazia && !this.descricaoVazia &&
            !this.localVazio;
    };
    AdicionaAcordoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-adiciona-acordo',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/adiciona-acordo/adiciona-acordo.html"*/'<ion-header>\n  <ion-navbar color="corPrimaria">\n    <ion-title>Novo acordo</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content class="cor-background">\n  <ion-card>\n    <ion-card-header color="corPrimaria">\n      Informações\n    </ion-card-header>\n\n    <ion-item>\n      <ion-icon name=\'calendar\' item-start color="corPrimaria"></ion-icon>\n      <ion-datetime placeholder="Data" cancelText="Cancelar" doneText="Ok" min="2017" max="2020" displayFormat="DD/MM/YYYY" [(ngModel)]="acordo.data"></ion-datetime>\n    </ion-item>\n    <ion-item *ngIf="dataVazia">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Selecione a data.</p>\n    </ion-item>\n\n    <ion-item>\n      <ion-icon name=\'time\' item-start color="corPrimaria"></ion-icon>\n      <ion-datetime placeholder="Hora" cancelText="Cancelar" doneText="Ok" displayFormat="HH:mm" [(ngModel)]="acordo.hora"></ion-datetime>\n    </ion-item>\n    <ion-item *ngIf="horaVazia">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Selecione a hora.</p>\n    </ion-item>\n\n\n    <ion-item>\n      <ion-icon name=\'compass\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" [(ngModel)]="acordo.local" placeholder="Local"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="localVazio">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite o local.</p>\n    </ion-item>\n\n    <ion-item>\n      <ion-icon name=\'clipboard\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" [(ngModel)]="acordo.descricao" placeholder="Descrição"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="descricaoVazia">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite a descrição.</p>\n    </ion-item>\n\n   \n  </ion-card>\n\n  <ion-fab bottom right>\n    <button ion-fab (click)="adicionaAcordo()" color="corPrimaria">\n      <ion-icon name="checkmark"></ion-icon>\n    </button>\n  </ion-fab>\n\n</ion-content>\n'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/adiciona-acordo/adiciona-acordo.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_acordo_service_acordo_service__["a" /* AcordoServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__["a" /* StatusBar */]])
    ], AdicionaAcordoPage);
    return AdicionaAcordoPage;
}());

//# sourceMappingURL=adiciona-acordo.js.map

/***/ }),

/***/ 185:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__notification_notification__ = __webpack_require__(53);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ChatService = /** @class */ (function () {
    function ChatService(db, auth, notification) {
        this.db = db;
        this.auth = auth;
        this.notification = notification;
        this.chats = [];
    }
    ChatService.prototype.adicionaChat = function (chat) {
        var _this = this;
        var MAX_MSG_LENGTH = 40;
        var titulo = "Nova mensagem de " + this.currentChatPartner.nome;
        var mensagem = chat.message.slice(0, MAX_MSG_LENGTH);
        return new Promise(function (resolve) {
            _this.db.list('chats/' + _this.currentChatPairId).push(chat).then(function (_) {
                _this.notification.enviarNotificacao(_this.currentChatPartner.userId, titulo, mensagem);
                resolve();
            });
        });
    };
    ChatService.prototype.carregarChats = function () {
        return this.db.list('chats/' + this.currentChatPairId);
    };
    ChatService.prototype.setupChat = function (user, other) {
        this.setPartner(other);
        return this.criarPairId(user, other);
    };
    ChatService.prototype.criarPairId = function (user, other) {
        var _this = this;
        var userKeyPromise = this.auth.getUsuarioKey(user.username);
        var otherKeyPromise = this.auth.getUsuarioKey(other.username);
        return new Promise(function (resolve) {
            Promise.all([userKeyPromise, otherKeyPromise])
                .then(function (keys) {
                var userKey = keys[0];
                var otherKey = keys[1];
                if (userKey < otherKey) {
                    _this.currentChatPairId = userKey + "|" + otherKey;
                }
                else {
                    _this.currentChatPairId = otherKey + "|" + userKey;
                }
                resolve();
            });
        });
    };
    ChatService.prototype.setPartner = function (partner) {
        this.currentChatPartner = partner;
    };
    ChatService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_angularfire2_database__["a" /* AngularFireDatabase */],
            __WEBPACK_IMPORTED_MODULE_2__auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_3__notification_notification__["a" /* NotificationProvider */]])
    ], ChatService);
    return ChatService;
}());

//# sourceMappingURL=chat-service.js.map

/***/ }),

/***/ 186:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AtivosFinanceirosPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(365);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * Generated class for the AtivosFinanceirosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var AtivosFinanceirosPage = /** @class */ (function () {
    function AtivosFinanceirosPage(navCtrl, navParams, http) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.escolha = "dolar";
        this.apiDolar = "http://economia.awesomeapi.com.br/USD-BRL/1";
        this.apiDolarTurismo = "http://economia.awesomeapi.com.br/USD-BRLT/1";
        this.apiDolarCanadense = "http://economia.awesomeapi.com.br/CAD-BRL/1";
        this.apiEuro = "http://economia.awesomeapi.com.br/EUR-BRL/1";
        this.apiLibraEsterlina = "http://economia.awesomeapi.com.br/GBP-BRL/1";
        this.apiPesoArgentino = "http://economia.awesomeapi.com.br/ARS-BRL/1";
        this.apiBitcoin = "http://economia.awesomeapi.com.br/BTC-BRL/1";
    }
    AtivosFinanceirosPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad AtivosFinanceirosPage');
        this.carregaDadosFinanceiros();
    };
    AtivosFinanceirosPage.prototype.carregaDadosFinanceiros = function () {
        var _this = this;
        this.http.get(this.apiDolar).toPromise().then(function (resDolar) {
            _this.dolar = resDolar[0].high;
            console.log(resDolar);
        });
        this.http.get(this.apiEuro).toPromise().then(function (resEuro) {
            _this.euro = resEuro[0].high;
            console.log(resEuro);
        });
        this.http.get(this.apiLibraEsterlina).toPromise().then(function (resLibra) {
            _this.libraEsterlina = resLibra[0].high;
            console.log(resLibra);
        });
        this.http.get(this.apiPesoArgentino).toPromise().then(function (resPeso) {
            _this.pesoArgentino = resPeso[0].high;
            console.log(resPeso);
        });
        this.http.get(this.apiBitcoin).toPromise().then(function (resBitcoin) {
            _this.bitcoin = resBitcoin[0].high;
            console.log(resBitcoin);
        });
        this.http.get(this.apiDolarTurismo).toPromise().then(function (resDolarTurismo) {
            _this.dolarTurismo = resDolarTurismo[0].high;
            console.log(resDolarTurismo);
        });
        this.http.get(this.apiDolarCanadense).toPromise().then(function (resDolarCanadense) {
            _this.dolarCanadense = resDolarCanadense[0].high;
            console.log(resDolarCanadense);
        });
    };
    AtivosFinanceirosPage.prototype.formataValor = function (valor) {
        return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
    };
    AtivosFinanceirosPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-ativos-financeiros',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/ativos-financeiros/ativos-financeiros.html"*/'<ion-header>\n  <ion-navbar color="corPrimaria">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Ativos Financeiros</ion-title>\n  </ion-navbar>\n</ion-header>\n\n  <ion-content>\n    <div padding>\n      <ion-segment color="corPrimaria" [(ngModel)]="escolha">\n        <ion-segment-button color="corPrimaria" value="dolar">\n          Dólar\n        </ion-segment-button>\n        <ion-segment-button color="corPrimaria" value="outras_moedas">\n          Outras moedas\n        </ion-segment-button>\n        <ion-segment-button color="corPrimaria" value="cotacoes">\n          Cotação\n        </ion-segment-button>\n      </ion-segment>\n    </div>\n  \n    <div [ngSwitch]="escolha">\n      <ion-list *ngSwitchCase="\'dolar\'">\n        <ion-item>\n          <ion-card>\n            <ion-card-header color="corPrimaria">\n              Dólar comercial <ion-icon name="cash"></ion-icon>\n            </ion-card-header>\n            <ion-card-content style="padding:0%;">\n              <ion-item>\n                <h2>R$ {{formataValor(dolar)}}</h2>\n              </ion-item>\n            </ion-card-content>\n          </ion-card>\n        </ion-item>\n        <ion-item>\n          <ion-card>\n            <ion-card-header color="corPrimaria">\n              Dólar turismo <ion-icon name="train"></ion-icon>\n            </ion-card-header>\n            <ion-card-content style="padding:0%;">\n              <ion-item>\n                <h2>R$ {{formataValor(dolarTurismo)}}</h2>\n              </ion-item>\n            </ion-card-content>\n          </ion-card>\n        </ion-item>\n        <ion-item>\n          <ion-card>\n            <ion-card-header color="corPrimaria">\n              Dólar canadense <ion-icon name="cash"></ion-icon>\n            </ion-card-header>\n            <ion-card-content style="padding:0%;">\n              <ion-item>\n                <h2>R$ {{formataValor(dolarCanadense)}}</h2>\n              </ion-item>\n            </ion-card-content>\n          </ion-card>\n        </ion-item>\n      </ion-list>\n  \n      <ion-list *ngSwitchCase="\'outras_moedas\'">\n        <ion-item>\n          <ion-card>\n            <ion-card-header color="corPrimaria">\n              Euro comercial <ion-icon name="cash"></ion-icon>\n            </ion-card-header>\n            <ion-card-content style="padding:0%;">\n              <ion-item>\n                <h2>R$ {{formataValor(euro)}}</h2>\n              </ion-item>\n            </ion-card-content>\n          </ion-card>\n        </ion-item>\n        <ion-item>\n          <ion-card>\n            <ion-card-header color="corPrimaria">\n              Libra esterlina <ion-icon name="cash"></ion-icon>\n            </ion-card-header>\n            <ion-card-content style="padding:0%;">\n              <ion-item>\n                <h2>R$ {{formataValor(libraEsterlina)}}</h2>\n              </ion-item>\n            </ion-card-content>\n          </ion-card>\n        </ion-item>\n        <ion-item>\n          <ion-card>\n            <ion-card-header color="corPrimaria">\n              Peso argentino <ion-icon name="cash"></ion-icon>\n            </ion-card-header>\n            <ion-card-content style="padding:0%;">\n              <ion-item>\n                <h2>R$ {{formataValor(pesoArgentino)}}</h2>\n              </ion-item>\n            </ion-card-content>\n          </ion-card>\n        </ion-item>\n        <ion-item>\n          <ion-card>\n            <ion-card-header color="corPrimaria">\n              Bitcoin <ion-icon name="logo-bitcoin"></ion-icon>\n            </ion-card-header>\n            <ion-card-content style="padding:0%;">\n              <ion-item>\n                <h2>R$ {{formataValor(bitcoin)}}</h2>\n              </ion-item>\n            </ion-card-content>\n          </ion-card>\n        </ion-item>\n      </ion-list>\n  \n      <ion-list *ngSwitchCase="\'cotacoes\'">\n        <ion-item>\n          \n            <iframe frameborder="0" scrolling="no" height="350" width="300" allowtransparency="true" marginwidth="0" marginheight="0" src="https://ssltools.forexprostools.com/market_quotes.php?force_lang=12&tabs=1,2,3,5&tab_1=1,3,1617,2103,2111&tab_2=27,166,170,172,959206&tab_3=348,474,985687,32500,43433&tab_4=8830,8833,8862,8914,8916&tab_5=8907,8906,8905,8880,8895&select_color=000000&default_color=3bb000"></iframe><br /><div style="width:300"><span style="font-size: 11px;color: #333333;text-decoration: none;">Cotações fornecidas por <a href="https://br.investing.com/" rel="nofollow" target="_blank" style="font-size: 11px;color: #06529D; font-weight: bold;" class="underline_link">Investing.com Brasil</a>.</span></div>\n            \n        </ion-item>\n\n      </ion-list>\n    \n</div>\n  \n</ion-content>\n\n'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/ativos-financeiros/ativos-financeiros.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */]])
    ], AtivosFinanceirosPage);
    return AtivosFinanceirosPage;
}());

//# sourceMappingURL=ativos-financeiros.js.map

/***/ }),

/***/ 187:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditaAcordoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_acordo_service_acordo_service__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__ = __webpack_require__(32);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the EditaAcordoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var EditaAcordoPage = /** @class */ (function () {
    function EditaAcordoPage(navCtrl, navParams, toastCtrl, acordoService, statusBar) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.acordoService = acordoService;
        this.statusBar = statusBar;
        this.acordo = {};
        this.divida = {};
        this.dataVazia = false;
        this.horaVazia = false;
        this.localVazio = false;
        this.descricaoVazia = false;
        this.divida = this.navParams.data[0];
        this.acordo = this.navParams.data[1];
        this.tipo = this.navParams.data[2];
    }
    EditaAcordoPage.prototype.ionViewDidLoad = function () { };
    EditaAcordoPage.prototype.ionViewWillEnter = function () {
        this.statusBar.backgroundColorByHexString("#006400");
    };
    EditaAcordoPage.prototype.editaAcordo = function () {
        var _this = this;
        if (!this.confirmaDados()) {
            this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
        }
        else {
            this.acordoService.editaAcordo(this.divida, this.acordo, this.tipo).then(function (_) {
                _this.navCtrl.pop();
                _this.abrirToast("O acordo foi editado.");
            }).catch(function (err) {
                _this.abrirToast("Ocorreu um erro ao tentar editar o acordo! :(");
            });
        }
    };
    EditaAcordoPage.prototype.abrirToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    };
    EditaAcordoPage.prototype.confirmaDados = function () {
        this.dataVazia = this.acordo.data == null;
        this.horaVazia = this.acordo.hora == null;
        this.descricaoVazia = this.acordo.descricao == "" || this.acordo.descricao == null;
        this.localVazio = this.acordo.local == "" || this.acordo.local == null;
        return !this.dataVazia && !this.horaVazia && !this.descricaoVazia &&
            !this.localVazio;
    };
    EditaAcordoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-edita-acordo',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/edita-acordo/edita-acordo.html"*/'<ion-header>\n  <ion-navbar color="corPrimaria">\n    <ion-title>Editar acordo</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content class="cor-background">\n  <ion-card>\n    <ion-card-header color="corPrimaria">\n      Informações\n    </ion-card-header>\n\n    <ion-item>\n      <ion-icon name=\'calendar\' item-start color="corPrimaria"></ion-icon>\n      <ion-datetime placeholder="Data" cancelText="Cancelar" doneText="Ok" min="2017" max="2020" displayFormat="DD/MM/YYYY" [(ngModel)]="acordo.data"></ion-datetime>\n    </ion-item>\n    <ion-item *ngIf="dataVazia">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Selecione a data.</p>\n    </ion-item>\n\n    <ion-item>\n      <ion-icon name=\'time\' item-start color="corPrimaria"></ion-icon>\n      <ion-datetime placeholder="Hora" cancelText="Cancelar" doneText="Ok" displayFormat="HH:mm" [(ngModel)]="acordo.hora"></ion-datetime>\n    </ion-item>\n    <ion-item *ngIf="horaVazia">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Selecione a hora.</p>\n    </ion-item>\n\n\n    <ion-item>\n      <ion-icon name=\'compass\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" [(ngModel)]="acordo.local" placeholder="Local"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="localVazio">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite o local.</p>\n    </ion-item>\n\n    <ion-item>\n      <ion-icon name=\'clipboard\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" [(ngModel)]="acordo.descricao" placeholder="Descrição"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="descricaoVazia">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite a descrição.</p>\n    </ion-item>\n\n   \n  </ion-card>\n\n  <ion-fab bottom right>\n    <button ion-fab (click)="editaAcordo()" color="corPrimaria">\n      <ion-icon name="checkmark"></ion-icon>\n    </button>\n  </ion-fab>\n\n</ion-content>\n'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/edita-acordo/edita-acordo.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_acordo_service_acordo_service__["a" /* AcordoServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__["a" /* StatusBar */]])
    ], EditaAcordoPage);
    return EditaAcordoPage;
}());

//# sourceMappingURL=edita-acordo.js.map

/***/ }),

/***/ 188:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_divida_service_divida_service__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__adiciona_divida_adiciona_divida__ = __webpack_require__(216);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__adiciona_emprestimo_adiciona_emprestimo__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__mostra_divida_mostra_divida__ = __webpack_require__(369);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__mostra_emprestimo_mostra_emprestimo__ = __webpack_require__(370);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_status_bar__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__models_VerificacaoEnum__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_operators__ = __webpack_require__(17);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, authProvider, statusBar, dividaService) {
        this.navCtrl = navCtrl;
        this.authProvider = authProvider;
        this.statusBar = statusBar;
        this.dividaService = dividaService;
        this.dividas = [];
        this.dividasPendentes = [];
        this.emprestimos = [];
        this.emprestimosPendentes = [];
        this.carregaDivEmp();
    }
    HomePage.prototype.ionViewWillEnter = function () {
        this.statusBar.backgroundColorByHexString("#006400");
    };
    HomePage.prototype.carregaDivEmp = function () {
        var _this = this;
        this.authProvider.getUsername().then(function (username) {
            _this.carregaDividas(username);
            _this.carregaEmprestimos(username);
        });
    };
    HomePage.prototype.carregaDividas = function (username) {
        var _this = this;
        this.dividaService.recebeDividasFB(username).snapshotChanges()
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_10_rxjs_operators__["map"])(function (actions) { return actions.map(function (a) {
            var data = a.payload.val();
            return __assign({ key: a.key }, data);
        }); })).subscribe(function (dividas) {
            dividas = dividas;
            _this.dividas = _this.filtraAbertos(dividas);
            _this.dividasPendentes = _this.filtraDividasPendentes(dividas);
        });
    };
    HomePage.prototype.carregaEmprestimos = function (username) {
        var _this = this;
        this.dividaService.recebeEmprestimosFB(username).snapshotChanges()
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_10_rxjs_operators__["map"])(function (actions) { return actions.map(function (a) {
            var data = a.payload.val();
            return __assign({ key: a.key }, data);
        }); })).subscribe(function (emprestimos) {
            emprestimos = emprestimos;
            _this.emprestimos = _this.filtraAbertos(emprestimos);
            _this.emprestimosPendentes = _this.filtraEmprestimosPendentes(emprestimos);
        });
    };
    HomePage.prototype.retornaFoto = function (tipo, divida_emprestimo) {
        if (tipo == "divida") {
            if (divida_emprestimo.emailUsuarioEmprestador == null) {
                return "https://cdn.pbrd.co/images/HwxEQ8k.png";
            }
            return this.authProvider.getGravatarUsuario(divida_emprestimo.emailUsuarioEmprestador, "https://cdn.pbrd.co/images/HwxEQ8k.png");
        }
        else {
            if (divida_emprestimo.emailUsuarioDevedor == null) {
                return "https://cdn.pbrd.co/images/HwxHdA7.png";
            }
            return this.authProvider.getGravatarUsuario(divida_emprestimo.emailUsuarioDevedor, "https://cdn.pbrd.co/images/HwxHdA7.png");
        }
    };
    HomePage.prototype.retornaSoma = function (lista) {
        var soma = 0.0;
        for (var i = 0; i < lista.length; i++) {
            soma += +lista[i].valor;
        }
        return soma;
    };
    HomePage.prototype.filtraAbertos = function (lista) {
        return lista.filter(function (x) { return x.aberta == true && x.verificacao === __WEBPACK_IMPORTED_MODULE_9__models_VerificacaoEnum__["a" /* Verificacao */].Confirmado; });
    };
    HomePage.prototype.filtraDividasPendentes = function (lista) {
        return lista.filter(function (x) { return x.verificacao === __WEBPACK_IMPORTED_MODULE_9__models_VerificacaoEnum__["a" /* Verificacao */].Pendente; });
    };
    HomePage.prototype.filtraEmprestimosPendentes = function (lista) {
        return lista.filter(function (x) { return x.verificacao === __WEBPACK_IMPORTED_MODULE_9__models_VerificacaoEnum__["a" /* Verificacao */].Pendente; });
    };
    HomePage.prototype.formataValor = function (valor) {
        return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
    };
    HomePage.prototype.podeAnalisarDivida = function (divida) {
        return divida.usuarioDevedor != divida.usuarioCriador;
    };
    HomePage.prototype.podeAnalisarEmprestimo = function (emprestimo) {
        return emprestimo.usuarioEmprestador != emprestimo.usuarioCriador;
    };
    //Dividas
    HomePage.prototype.modalAdicionaDivida = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__adiciona_divida_adiciona_divida__["a" /* AdicionaDividaPage */]);
        this.fab.close();
    };
    HomePage.prototype.modalMostraDivida = function (divida) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__mostra_divida_mostra_divida__["a" /* MostraDividaPage */], divida);
    };
    HomePage.prototype.existeDivida = function () {
        return this.dividas.length > 0;
    };
    HomePage.prototype.existeDividasPendentes = function () {
        return this.dividasPendentes.length > 0;
    };
    HomePage.prototype.aceitaDivEmp = function (divEmp) {
        divEmp.verificacao = __WEBPACK_IMPORTED_MODULE_9__models_VerificacaoEnum__["a" /* Verificacao */].Confirmado;
        this.dividaService.db.list("divida-list").update(divEmp.key, divEmp);
    };
    HomePage.prototype.rejeitaDivida = function (divida) {
        divida.verificacao = __WEBPACK_IMPORTED_MODULE_9__models_VerificacaoEnum__["a" /* Verificacao */].Negado;
        this.dividaService.removeDividaFB(divida);
    };
    HomePage.prototype.rejeitaEmprestimo = function (emprestimo) {
        emprestimo.verificacao = __WEBPACK_IMPORTED_MODULE_9__models_VerificacaoEnum__["a" /* Verificacao */].Negado;
        this.dividaService.removeEmprestimoFB(emprestimo);
    };
    //Empréstimos
    HomePage.prototype.modalAdicionaEmprestimo = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__adiciona_emprestimo_adiciona_emprestimo__["a" /* AdicionaEmprestimoPage */]);
        this.fab.close();
    };
    HomePage.prototype.existeEmprestimo = function () {
        return this.emprestimos.length > 0;
    };
    HomePage.prototype.modalMostraEmprestimo = function (emprestimo) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__mostra_emprestimo_mostra_emprestimo__["a" /* MostraEmprestimoPage */], emprestimo);
    };
    HomePage.prototype.existeEmprestimosPendentes = function () {
        return this.emprestimosPendentes.length > 0;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('fab'),
        __metadata("design:type", Object)
    ], HomePage.prototype, "fab", void 0);
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-home',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/home/home.html"*/'<ion-header>\n\n  <ion-navbar color="corPrimaria">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Dívidas e empréstimos</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="cor-background">\n\n\n\n  <ion-card *ngIf="existeEmprestimosPendentes()">\n\n    <ion-card-header color="corEmprestimoPendente">\n\n      Empréstimos Pendentes\n\n    </ion-card-header>\n\n    <ion-list *ngFor="let emprestimo of emprestimosPendentes">\n\n      <hr>\n\n      <ion-item>\n\n        <ion-avatar item-start>\n\n          <img [src]="retornaFoto(\'emprestimo\', emprestimo)">\n\n        </ion-avatar>\n\n        <h2>{{emprestimo.nomeUsuarioDevedor}}</h2>\n\n        <p class="precoEmprestimo">R$ {{formataValor(emprestimo.valor)}}</p>\n\n        <button *ngIf="podeAnalisarEmprestimo(emprestimo)" ion-button large item-end clear color="corEmprestimo"\n\n          (click)="aceitaDivEmp(emprestimo)">\n\n          <ion-icon name="checkmark" color="corPrimaria"></ion-icon>\n\n        </button>\n\n        <button *ngIf="podeAnalisarEmprestimo(emprestimo)" ion-button large item-end clear color="corEmprestimo"\n\n          (click)="rejeitaEmprestimo(emprestimo)">\n\n          <ion-icon name="close" color="corDivida"></ion-icon>\n\n        </button>\n\n        <button *ngIf="!podeAnalisarEmprestimo(emprestimo)" ion-button large item-end clear color="corEmprestimo"\n\n          (click)="modalMostraEmprestimo(emprestimo)">\n\n          <ion-icon name="list"></ion-icon>\n\n        </button>\n\n      </ion-item>\n\n    </ion-list>\n\n  </ion-card>\n\n\n\n\n\n  <ion-card *ngIf="existeDividasPendentes()">\n\n    <ion-card-header color="corDividaPendente">\n\n      Dívidas Pendentes\n\n    </ion-card-header>\n\n    <ion-list *ngFor="let divida of dividasPendentes">\n\n      <hr>\n\n      <ion-item>\n\n        <ion-avatar item-start>\n\n          <img [src]="retornaFoto(\'divida\', divida)">\n\n        </ion-avatar>\n\n        <h2>{{divida.nomeUsuarioEmprestador}}</h2>\n\n        <p class="precoDivida">R$ {{formataValor(divida.valor)}}</p>\n\n        <button *ngIf="podeAnalisarDivida(divida)" ion-button large item-end clear color="corDivida" (click)="aceitaDivEmp(divida)">\n\n          <ion-icon name="checkmark" color="corPrimaria"></ion-icon>\n\n        </button>\n\n        <button *ngIf="podeAnalisarDivida(divida)" ion-button large item-end clear color="corDivida" (click)="rejeitaDivida(divida)">\n\n          <ion-icon name="close" color="corDivida"></ion-icon>\n\n        </button>\n\n        <button *ngIf="!podeAnalisarDivida(divida)" ion-button large item-end clear color="corDivida" (click)="modalMostraDivida(divida)">\n\n          <ion-icon name="list"></ion-icon>\n\n        </button>\n\n      </ion-item>\n\n    </ion-list>\n\n  </ion-card>\n\n\n\n  <ion-list>\n\n    <ion-card>\n\n      <ion-card-header color="corEmprestimo">\n\n        Empréstimos\n\n        <p *ngIf="existeEmprestimo()" class="totalEmprestimo">Total: R$ {{formataValor(retornaSoma(emprestimos))}}</p>\n\n      </ion-card-header>\n\n\n\n      <ion-item *ngIf="!existeEmprestimo()">\n\n        <p style="white-space: normal;" text-center>Não há nenhum empréstimo aberto.</p>\n\n      </ion-item>\n\n\n\n      <ion-list *ngFor="let emprestimo of emprestimos">\n\n        <hr>\n\n        <ion-item>\n\n          <div id="nome" item-start></div>\n\n          <ion-avatar item-start>\n\n            <img [src]="retornaFoto(\'emprestimo\', emprestimo)">\n\n          </ion-avatar>\n\n          <h2>{{emprestimo.nomeUsuarioDevedor}}</h2>\n\n          <p class="precoEmprestimo">R$ {{formataValor(emprestimo.valor)}}</p>\n\n          <button ion-button color="corEmprestimo" clear item-end (click)="modalMostraEmprestimo(emprestimo)">Detalhes</button>\n\n        </ion-item>\n\n      </ion-list>\n\n\n\n    </ion-card>\n\n  </ion-list>\n\n\n\n  <ion-list>\n\n    <ion-card>\n\n      <ion-card-header color="corDivida">\n\n        Dívidas\n\n        <p *ngIf="existeDivida()" class="totalDivida">Total: R$ {{formataValor(retornaSoma(dividas))}}</p>\n\n      </ion-card-header>\n\n\n\n      <ion-item *ngIf="!existeDivida()">\n\n        <p style="white-space: normal;" text-center>Não há nenhuma dívida aberta.</p>\n\n      </ion-item>\n\n\n\n      <ion-list *ngFor="let divida of dividas">\n\n        <hr>\n\n        <ion-item>\n\n          <div id="nome" item-start></div>\n\n          <ion-avatar item-start>\n\n            <img [src]="retornaFoto(\'divida\', divida)">\n\n          </ion-avatar>\n\n          <h2>{{divida.nomeUsuarioEmprestador}}</h2>\n\n          <p class="precoDivida">R$ {{formataValor(divida.valor)}}</p>\n\n          <button ion-button color="corDivida" clear item-end (click)="modalMostraDivida(divida)">Detalhes</button>\n\n        </ion-item>\n\n      </ion-list>\n\n\n\n    </ion-card>\n\n  </ion-list>\n\n\n\n  <br>\n\n  <br>\n\n  <br>\n\n  <br>\n\n\n\n  <ion-fab bottom right #fab>\n\n    <button ion-fab color="corPrimaria">\n\n      <ion-icon name="add"></ion-icon>\n\n    </button>\n\n    <ion-fab-list side="top">\n\n      <button ion-fab (click)="modalAdicionaDivida()" color="corDivida">\n\n        <ion-icon name="cash" color="light"></ion-icon>\n\n        <ion-label>Dívida</ion-label>\n\n      </button>\n\n      <button ion-fab (click)="modalAdicionaEmprestimo()" color="corEmprestimo">\n\n        <ion-icon name="cash" color="light"></ion-icon>\n\n        <ion-label>Empréstimo</ion-label>\n\n      </button>\n\n    </ion-fab-list>\n\n\n\n  </ion-fab>\n\n\n\n</ion-content>'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/home/home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_8__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_7__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_2__providers_divida_service_divida_service__["a" /* DividaServiceProvider */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 216:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdicionaDividaPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_divida_service_divida_service__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_auth_auth__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AdicionaDividaPage = /** @class */ (function () {
    function AdicionaDividaPage(navCtrl, navParams, dividaService, toastCtrl, statusBar, authService, alertCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.dividaService = dividaService;
        this.toastCtrl = toastCtrl;
        this.statusBar = statusBar;
        this.authService = authService;
        this.alertCtrl = alertCtrl;
        this.usuario = {};
        this.divida = {};
        this.usuarioNaoEncontrado = false;
        this.nomeVazio = false;
        this.valorInvalido = false;
        this.valorVazio = false;
        this.dataVazia = false;
        this.descricaoVazia = false;
        this.usuarioInvalido = false;
        this.usuarioRepetido = false;
        this.usuarioNaoMarcouOpcao = false;
        authService.getUsuario().subscribe(function (res) {
            _this.usuario = res;
            _this.usuarioUsaAplicativo = "possui";
        });
    }
    AdicionaDividaPage.prototype.ionViewWillEnter = function () {
        this.statusBar.backgroundColorByHexString("#d30000");
    };
    AdicionaDividaPage.prototype.abrirToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    };
    AdicionaDividaPage.prototype.adicionaDivida = function () {
        var _this = this;
        if (!this.confirmaDados()) {
            this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
        }
        else {
            if (!this.usuarioNaoEncontrado && this.usuarioPossuiConta()) {
                this.authService.getUsuarioRef(this.divida.usuarioEmprestador).then(function (result) {
                    _this.adicionaDividaAux();
                }).catch(function (error) {
                    console.log("entrei");
                    _this.abrirToast("Ops! Parece que o usuário que você está procurando não existe.");
                });
            }
            else {
                this.adicionaDividaAux();
            }
        }
    };
    AdicionaDividaPage.prototype.adicionaDividaAux = function () {
        this.divida.aberta = true;
        this.divida.data = this.data;
        this.divida.usuarioDevedor = this.usuario.username;
        this.divida.nomeUsuarioDevedor = this.usuario.nome;
        this.divida.emailUsuarioDevedor = this.usuario.email;
        this.divida.usuarioCriador = this.usuario.username;
        this.dividaService.adicionaDividaFB(this.divida);
        this.navCtrl.pop();
        this.divida.usuarioEmprestador == null ? this.abrirToast("Dívida adicionada.") : this.abrirToast("Dívida pendente enviada para usuário.");
    };
    AdicionaDividaPage.prototype.usuarioPossuiConta = function () {
        return this.usuarioUsaAplicativo == "possui";
    };
    AdicionaDividaPage.prototype.confirmaDados = function () {
        if (this.usuarioNaoEncontrado) {
            this.nomeVazio = this.divida.nomeUsuarioEmprestador == "" || this.divida.nomeUsuarioEmprestador == null;
        }
        else {
            this.usuarioInvalido = this.divida.usuarioEmprestador == "" || this.divida.usuarioEmprestador == null;
        }
        this.valorInvalido = this.divida.valor <= 0;
        this.valorVazio = this.divida.valor == null;
        this.dataVazia = this.data == null;
        this.descricaoVazia = this.divida.descricao == "" || this.divida.descricao == null;
        this.usuarioNaoMarcouOpcao = (this.usuarioUsaAplicativo == null);
        return !this.valorInvalido && !this.nomeVazio && !this.valorVazio &&
            !this.dataVazia && !this.descricaoVazia && !this.usuarioNaoMarcouOpcao;
    };
    AdicionaDividaPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-adiciona-divida',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/adiciona-divida/adiciona-divida.html"*/'<ion-header>\n\n  <ion-navbar color="corDivida">\n\n    <ion-title>Nova dívida</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content class="cor-background">\n\n  <ion-card>\n\n      <ion-card-header color="corDivida">\n\n          Seu emprestador\n\n        </ion-card-header>\n\n    \n\n    <ion-list radio-group [(ngModel)]="usuarioUsaAplicativo">\n\n      <ion-item>\n\n        <ion-icon name=\'contact\' item-start color="corDivida"></ion-icon>\n\n        <ion-label>Meu emprestador possui conta</ion-label>\n\n        <ion-radio value="possui"></ion-radio>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-icon name=\'contacts\' item-start color="corDivida"></ion-icon>\n\n        <ion-label>Meu emprestador não possui conta</ion-label>\n\n        <ion-radio value="nao_possui"></ion-radio>\n\n      </ion-item>\n\n    </ion-list>\n\n    <ion-item *ngIf="usuarioNaoMarcouOpcao">\n\n        <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n        <p class="erro">Selecione uma das opções acima.</p>\n\n      </ion-item>\n\n\n\n      <ion-item *ngIf="!usuarioPossuiConta()">\n\n          <ion-icon name=\'person\' item-start color="corDivida"></ion-icon>\n\n          <ion-input type="text" placeholder="Nome" [(ngModel)]="divida.nomeUsuarioEmprestador"></ion-input>\n\n        </ion-item>\n\n        <ion-item *ngIf="!usuarioPossuiConta() && nomeVazio && usuarioNaoEncontrado">\n\n          <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n          <p class="erro">Digite o nome do emprestador.</p>\n\n        </ion-item>\n\n    \n\n        <ion-item *ngIf="usuarioPossuiConta()">\n\n          <ion-icon name=\'contact\' item-start color="corDivida"></ion-icon>\n\n          <ion-input type="text" placeholder="Usuário" [(ngModel)]="divida.usuarioEmprestador"></ion-input>\n\n        </ion-item>\n\n        <ion-item *ngIf="usuarioPossuiConta() && usuarioInvalido">\n\n          <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n          <p class="erro">Digite o nome do usuário.</p>\n\n        </ion-item>\n\n    \n\n  </ion-card>\n\n\n\n  <ion-card>\n\n    <ion-card-header color="corDivida">\n\n      Informações da dívida\n\n    </ion-card-header>\n\n\n\n    <ion-item>\n\n      <ion-icon name=\'clipboard\' item-start color="corDivida"></ion-icon>\n\n      <ion-input type="text" [(ngModel)]="divida.descricao" placeholder="Descrição"></ion-input>\n\n    </ion-item>\n\n    <ion-item *ngIf="descricaoVazia">\n\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n      <p class="erro">Digite a descrição.</p>\n\n    </ion-item>\n\n\n\n    <ion-item>\n\n      <ion-icon name=\'cash\' item-start color="corDivida"></ion-icon>\n\n      <ion-input type="text" name="money" placeholder="Valor" [brmasker]="{money: true, thousand: \'.\',  decimalCaracter: \',\', len: 11}" [(ngModel)]="divida.valor"></ion-input>\n\n    </ion-item>\n\n    <ion-item *ngIf="valorInvalido">\n\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n      <p class="erro">O valor deverá ser maior que zero.</p>\n\n    </ion-item>\n\n    <ion-item *ngIf="valorVazio">\n\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n      <p class="erro">Digite o valor.</p>\n\n    </ion-item>\n\n\n\n    <ion-item>\n\n      <ion-icon name=\'calendar\' item-start color="corDivida"></ion-icon>\n\n      <ion-datetime cancelText="Cancelar" doneText="Ok" min="2017" max="2020" displayFormat="DD/MM/YYYY" [(ngModel)]="data" placeholder="Data"></ion-datetime>\n\n    </ion-item>\n\n    <ion-item *ngIf="dataVazia">\n\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n      <p class="erro">Selecione a data.</p>\n\n    </ion-item>\n\n\n\n   \n\n  </ion-card>\n\n\n\n  <ion-fab bottom right>\n\n    <button ion-fab (click)="adicionaDivida()" color="corDivida">\n\n      <ion-icon name="checkmark"></ion-icon>\n\n    </button>\n\n  </ion-fab>\n\n\n\n</ion-content>\n\n'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/adiciona-divida/adiciona-divida.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__providers_divida_service_divida_service__["a" /* DividaServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_4__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */]])
    ], AdicionaDividaPage);
    return AdicionaDividaPage;
}());

//# sourceMappingURL=adiciona-divida.js.map

/***/ }),

/***/ 217:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdicionaEmprestimoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_divida_service_divida_service__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_auth_auth__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AdicionaEmprestimoPage = /** @class */ (function () {
    function AdicionaEmprestimoPage(navCtrl, navParams, toastCtrl, emprestimoService, statusBar, authService, alertCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.emprestimoService = emprestimoService;
        this.statusBar = statusBar;
        this.authService = authService;
        this.alertCtrl = alertCtrl;
        this.usuario = {};
        this.emprestimo = {};
        this.nomeVazio = false;
        this.valorInvalido = false;
        this.valorVazio = false;
        this.dataVazia = false;
        this.descricaoVazia = false;
        this.usuarioNaoEncontrado = false;
        this.usuarioInvalido = false;
        this.usuarioRepetido = false;
        this.usuarioNaoMarcouOpcao = false;
        authService.getUsuario().subscribe(function (res) {
            _this.usuario = res;
            _this.usuarioUsaAplicativo = "possui";
        });
    }
    AdicionaEmprestimoPage.prototype.ionViewWillEnter = function () {
        this.statusBar.backgroundColorByHexString("#00006b");
    };
    AdicionaEmprestimoPage.prototype.abrirToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    };
    AdicionaEmprestimoPage.prototype.adicionaEmprestimo = function () {
        var _this = this;
        if (!this.confirmaDados()) {
            this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
        }
        else {
            if (!this.usuarioNaoEncontrado && this.usuarioPossuiConta()) {
                this.authService.getUsuarioRef(this.emprestimo.usuarioDevedor).then(function (result) {
                    _this.adicionaEmprestimoAux();
                }).catch(function (error) {
                    console.log("entrei");
                    _this.abrirToast("Ops! Parece que o usuário que você está procurando não existe.");
                });
            }
            else {
                this.adicionaEmprestimoAux();
            }
        }
    };
    AdicionaEmprestimoPage.prototype.adicionaEmprestimoAux = function () {
        console.log(this.emprestimo.data);
        this.emprestimo.aberta = true;
        this.emprestimo.usuarioEmprestador = this.usuario.username;
        this.emprestimo.nomeUsuarioEmprestador = this.usuario.nome;
        this.emprestimo.emailUsuarioEmprestador = this.usuario.email;
        this.emprestimo.data = this.data;
        this.emprestimo.usuarioCriador = this.usuario.username;
        this.emprestimoService.adicionaEmprestimoFB(this.emprestimo);
        this.navCtrl.pop();
        this.emprestimo.usuarioEmprestador == null ? this.abrirToast("Empréstimo adicionado.") : this.abrirToast("Empréstimo pendente enviado para usuário.");
    };
    AdicionaEmprestimoPage.prototype.usuarioPossuiConta = function () {
        return this.usuarioUsaAplicativo == "possui";
    };
    AdicionaEmprestimoPage.prototype.confirmaDados = function () {
        if (this.usuarioNaoEncontrado) {
            this.nomeVazio = this.emprestimo.nomeUsuarioDevedor == "" || this.emprestimo.nomeUsuarioDevedor == null;
        }
        else {
            this.usuarioInvalido = this.emprestimo.usuarioDevedor == "" || this.emprestimo.usuarioDevedor == null;
        }
        this.valorInvalido = this.emprestimo.valor <= 0;
        this.valorVazio = this.emprestimo.valor == null;
        this.dataVazia = this.data == null;
        this.descricaoVazia = this.emprestimo.descricao == "" || this.emprestimo.descricao == null;
        this.usuarioNaoMarcouOpcao = (this.usuarioUsaAplicativo == null);
        return !this.valorInvalido && !this.nomeVazio && !this.valorVazio &&
            !this.dataVazia && !this.descricaoVazia && !this.usuarioNaoMarcouOpcao;
    };
    AdicionaEmprestimoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-adiciona-emprestimo',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/adiciona-emprestimo/adiciona-emprestimo.html"*/'<ion-header>\n\n  <ion-navbar color="corEmprestimo">\n\n    <ion-title>Novo empréstimo</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content class="cor-background">\n\n  <ion-card>\n\n    <ion-card-header color="corEmprestimo">\n\n      Seu devedor\n\n    </ion-card-header>\n\n\n\n    <ion-list radio-group [(ngModel)]="usuarioUsaAplicativo">\n\n      <ion-item>\n\n        <ion-icon name=\'contact\' item-start color="corEmprestimo"></ion-icon>\n\n        <ion-label>Meu devedor possui conta</ion-label>\n\n        <ion-radio value="possui"></ion-radio>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-icon name=\'contacts\' item-start color="corEmprestimo"></ion-icon>\n\n        <ion-label>Meu devedor não possui conta</ion-label>\n\n        <ion-radio value="nao_possui"></ion-radio>\n\n      </ion-item>\n\n    </ion-list>\n\n    <ion-item *ngIf="usuarioNaoMarcouOpcao">\n\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n      <p class="erro">Selecione uma das opções acima.</p>\n\n    </ion-item>\n\n\n\n    <ion-item *ngIf="!usuarioPossuiConta()">\n\n      <ion-icon name=\'person\' item-start color="corEmprestimo"></ion-icon>\n\n      <ion-input type="text" placeholder="Nome" [(ngModel)]="emprestimo.nomeUsuarioDevedor"></ion-input>\n\n    </ion-item>\n\n    <ion-item *ngIf="!usuarioPossuiConta() && nomeVazio && usuarioNaoEncontrado">\n\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n      <p class="erro">Digite o nome do devedor.</p>\n\n    </ion-item>\n\n\n\n    <ion-item *ngIf="usuarioPossuiConta()">\n\n      <ion-icon name=\'contact\' item-start color="corEmprestimo"></ion-icon>\n\n      <ion-input type="text" [(ngModel)]="emprestimo.usuarioDevedor" placeholder="Usuário"></ion-input>\n\n    </ion-item>\n\n    <ion-item *ngIf="usuarioPossuiConta() && usuarioInvalido">\n\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n      <p class="erro">Digite o usuário devedor.</p>\n\n    </ion-item>\n\n\n\n  </ion-card>\n\n\n\n  <ion-card>\n\n    <ion-card-header color="corEmprestimo">\n\n      Informações do empréstimo\n\n    </ion-card-header>\n\n\n\n    <ion-item>\n\n      <ion-icon name=\'clipboard\' item-start color="corEmprestimo"></ion-icon>\n\n      <ion-input type="text" [(ngModel)]="emprestimo.descricao" placeholder="Descrição"></ion-input>\n\n    </ion-item>\n\n    <ion-item *ngIf="descricaoVazia">\n\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n      <p class="erro">Digite a descrição.</p>\n\n    </ion-item>\n\n\n\n    <ion-item>\n\n      <ion-icon name=\'cash\' item-start color="corEmprestimo"></ion-icon>\n\n      <ion-input type="text" name="money" placeholder="Valor" [brmasker]="{money: true, thousand: \'.\',  decimalCaracter: \',\', len:11}"\n\n        [(ngModel)]="emprestimo.valor"></ion-input>\n\n    </ion-item>\n\n    <ion-item *ngIf="valorInvalido">\n\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n      <p class="erro">O valor deverá ser maior que zero.</p>\n\n    </ion-item>\n\n    <ion-item *ngIf="valorVazio">\n\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n      <p class="erro">Digite o valor.</p>\n\n    </ion-item>\n\n\n\n    <ion-item>\n\n      <ion-icon name=\'calendar\' item-start color="corEmprestimo"></ion-icon>\n\n      <ion-datetime cancelText="Cancelar" doneText="Ok" min="2017" max="2020" displayFormat="DD/MM/YYYY" [(ngModel)]="data"\n\n        placeholder="Data"></ion-datetime>\n\n    </ion-item>\n\n    <ion-item *ngIf="dataVazia">\n\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n      <p class="erro">Selecione a data.</p>\n\n    </ion-item>\n\n\n\n  </ion-card>\n\n\n\n  <ion-fab bottom right>\n\n    <button ion-fab (click)="adicionaEmprestimo()" color="corEmprestimo">\n\n      <ion-icon name="checkmark"></ion-icon>\n\n    </button>\n\n  </ion-fab>\n\n\n\n</ion-content>'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/adiciona-emprestimo/adiciona-emprestimo.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_divida_service_divida_service__["a" /* DividaServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_4__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */]])
    ], AdicionaEmprestimoPage);
    return AdicionaEmprestimoPage;
}());

//# sourceMappingURL=adiciona-emprestimo.js.map

/***/ }),

/***/ 218:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdicionaFinancaPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_financa_service_financa_service__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_meta_service_meta_service__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_amigos_service_amigos_service__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_VerificacaoEnum__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Helper_Utils__ = __webpack_require__(66);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var AdicionaFinancaPage = /** @class */ (function () {
    function AdicionaFinancaPage(navCtrl, navParams, toastCtrl, statusBar, authService, alertCtrl, financaService, metaService, amigosService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.statusBar = statusBar;
        this.authService = authService;
        this.alertCtrl = alertCtrl;
        this.financaService = financaService;
        this.metaService = metaService;
        this.amigosService = amigosService;
        this.financa = {};
        this.tipoFinanca = "";
        this.financaCompartilhada = false;
        this.usuarioCompartilhado = "";
        this.usuarioCompartilhado2 = "";
        this.usuarioCompartilhado3 = "";
        this.usuarioCompartilhado4 = "";
        this.usuarioCompartilhado5 = "";
        this.usuarioCompartilhado6 = "";
        this.usuarioCompartilhado7 = "";
        this.usuarioCompartilhado8 = "";
        this.usuarioCompartilhado9 = "";
        this.liberaUsuario2 = false;
        this.liberaUsuario3 = false;
        this.liberaUsuario4 = false;
        this.liberaUsuario5 = false;
        this.liberaUsuario6 = false;
        this.liberaUsuario7 = false;
        this.liberaUsuario8 = false;
        this.liberaUsuario9 = false;
        this.numeroUsuariosCompartilhados = 0;
        this.listaDeAmigos = [];
        this.listaCompartilhada = [];
        //booleans de verificação
        this.valorInvalido = false;
        this.valorVazio = false;
        this.descricaoVazia = false;
        this.dataVazia = false;
        this.categoriaVazia = false;
        this.tipoVazio = false;
        this.usuarioCompartilhadoVazio = false;
        this.usuarioCompartilhadoVazio2 = false;
        this.usuarioCompartilhadoVazio3 = false;
        this.usuarioCompartilhadoVazio4 = false;
        this.usuarioCompartilhadoVazio5 = false;
        this.usuarioCompartilhadoVazio6 = false;
        this.usuarioCompartilhadoVazio7 = false;
        this.usuarioCompartilhadoVazio8 = false;
        this.usuarioCompartilhadoVazio9 = false;
    }
    AdicionaFinancaPage.prototype.abrirToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    };
    AdicionaFinancaPage.prototype.adicionaFinanca = function () {
        var _this = this;
        // TODO: remover depois de adicionar os campos
        // categoria e ehDebito ao form de criação de financas
        if (!this.financaCompartilhada) {
            this.adicionaFinancaAux();
        }
        else {
            if (!this.confirmaDados()) {
                this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
            }
            else {
                if (this.tipoFinanca === "debito") {
                    this.financa = __assign({}, this.financa, { ehDebito: true, valor: this.valorFinanca, verificacao: __WEBPACK_IMPORTED_MODULE_7__models_VerificacaoEnum__["a" /* Verificacao */].Pendente, ehCompartilhada: true });
                }
                else {
                    this.financa = __assign({}, this.financa, { ehDebito: false, valor: this.valorFinanca, verificacao: __WEBPACK_IMPORTED_MODULE_7__models_VerificacaoEnum__["a" /* Verificacao */].Pendente, ehCompartilhada: true });
                }
                // No caso, precisa criar um adicionaFinancaEmUsuarioFB para adicionar o objeto financa novo (com valor dividido por usuários) em cada usuário da finança
                this.authService.getUsername().then(function (username) {
                    _this.financa.usuarioCriador = username;
                    _this.valorCompartilhado = _this.retornaValorPorUsuario();
                    var financa = __assign({}, _this.financa, { valor: _this.valorCompartilhado, verificacao: __WEBPACK_IMPORTED_MODULE_7__models_VerificacaoEnum__["a" /* Verificacao */].Confirmado });
                    _this.financaService.adicionaFinancaEmUsuarioFB(username, financa);
                });
                this.carregaAmigos().then(function (listaDeAmigos) {
                    _this.listaCompartilhada.forEach(function (username) {
                        _this.financaService.adicionaFinancaEmUsuarioFB(username, __assign({}, _this.financa, { valor: _this.valorCompartilhado }));
                    });
                }).then(function (_) {
                    _this.navCtrl.pop();
                }).catch(function (_) {
                    _this.abrirToast("Ops! Parece que um ou mais usuários que você registrou na finança não está na sua lista de amizades.");
                });
            }
        }
    };
    AdicionaFinancaPage.prototype.adicionaFinancaAux = function () {
        var _this = this;
        if (!this.confirmaDados()) {
            this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
        }
        else {
            if (this.tipoFinanca === "debito") {
                this.financa = __assign({}, this.financa, { ehDebito: true, valor: this.valorFinanca, verificacao: __WEBPACK_IMPORTED_MODULE_7__models_VerificacaoEnum__["a" /* Verificacao */].Confirmado, ehCompartilhada: false });
            }
            else {
                this.financa = __assign({}, this.financa, { ehDebito: false, valor: this.valorFinanca, verificacao: __WEBPACK_IMPORTED_MODULE_7__models_VerificacaoEnum__["a" /* Verificacao */].Confirmado, ehCompartilhada: false });
            }
            this.authService.getUsername().then(function (username) {
                _this.financa.usuarioCriador = username;
                _this.financaService.adicionaFinancaEmUsuarioFB(username, _this.financa)
                    .then(function (_) {
                    _this.metaService.verificaMetas(_this.financa.categoria);
                    _this.navCtrl.pop();
                });
            });
        }
    };
    AdicionaFinancaPage.prototype.updateFinancaCompartilhada = function () {
        if (!this.financaCompartilhada) {
            this.financaCompartilhada = true;
        }
        else {
            this.financaCompartilhada = false;
        }
    };
    AdicionaFinancaPage.prototype.retornaValorPorUsuario = function () {
        var valor = 0.0;
        this.numeroUsuariosCompartilhados = this.getNumeroUsuariosCompartilhados();
        valor = __WEBPACK_IMPORTED_MODULE_8__Helper_Utils__["a" /* default */].formataValorFB(this.valorFinanca) / this.numeroUsuariosCompartilhados;
        return this.formataValor(valor);
    };
    AdicionaFinancaPage.prototype.formataValor = function (valor) {
        return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
    };
    AdicionaFinancaPage.prototype.getNumeroUsuariosCompartilhados = function () {
        if (this.liberaUsuario9) {
            return 10;
        }
        else if (this.liberaUsuario8) {
            return 9;
        }
        else if (this.liberaUsuario7) {
            return 8;
        }
        else if (this.liberaUsuario6) {
            return 7;
        }
        else if (this.liberaUsuario5) {
            return 6;
        }
        else if (this.liberaUsuario4) {
            return 5;
        }
        else if (this.liberaUsuario3) {
            return 4;
        }
        else if (this.liberaUsuario2) {
            return 3;
        }
        else {
            return 2;
        }
    };
    AdicionaFinancaPage.prototype.usuarioEstaNaListaDeAmigos = function (usuario) {
        if (this.financaCompartilhada) {
            this.carregaAmigos();
            for (var i = 0; i < this.listaDeAmigos.length; i + 1) {
                if (usuario === this.listaDeAmigos[i].amigo) {
                    return true;
                }
            }
            return false;
        }
    };
    AdicionaFinancaPage.prototype.adicionaOutroUsuario = function () {
        if (this.liberaUsuario9) {
            this.abrirToast("Ops! Você não pode adicionar finança com mais de 10 usuários.");
        }
        else if (this.liberaUsuario8) {
            this.liberaUsuario9 = true;
        }
        else if (this.liberaUsuario7) {
            this.liberaUsuario8 = true;
        }
        else if (this.liberaUsuario6) {
            this.liberaUsuario7 = true;
        }
        else if (this.liberaUsuario5) {
            this.liberaUsuario6 = true;
        }
        else if (this.liberaUsuario4) {
            this.liberaUsuario5 = true;
        }
        else if (this.liberaUsuario3) {
            this.liberaUsuario4 = true;
        }
        else if (this.liberaUsuario2) {
            this.liberaUsuario3 = true;
        }
        else {
            this.liberaUsuario2 = true;
        }
    };
    AdicionaFinancaPage.prototype.removeOutroUsuario = function () {
        if (!this.liberaUsuario2) {
            this.abrirToast("Ops! Você não pode adicionar finança com menos de 1 usuário.");
        }
        else if (!this.liberaUsuario3) {
            this.liberaUsuario2 = false;
        }
        else if (!this.liberaUsuario4) {
            this.liberaUsuario3 = false;
        }
        else if (!this.liberaUsuario5) {
            this.liberaUsuario4 = false;
        }
        else if (!this.liberaUsuario6) {
            this.liberaUsuario5 = false;
        }
        else if (!this.liberaUsuario7) {
            this.liberaUsuario6 = false;
        }
        else if (!this.liberaUsuario8) {
            this.liberaUsuario7 = false;
        }
        else if (!this.liberaUsuario9) {
            this.liberaUsuario8 = false;
        }
        else {
            this.liberaUsuario9 = false;
        }
    };
    AdicionaFinancaPage.prototype.confirmaDados = function () {
        this.valorInvalido = this.financa.valor <= 0;
        this.valorVazio = this.valorFinanca == null;
        this.dataVazia = this.financa.data == null;
        this.categoriaVazia = this.financa.categoria == null;
        this.descricaoVazia = this.financa.descricao == "" || this.financa.descricao == null;
        this.tipoVazio = this.tipoFinanca == "";
        this.usuarioCompartilhadoVazio = this.usuarioCompartilhado == "";
        this.usuarioCompartilhadoVazio2 = this.usuarioCompartilhado2 == "" && this.liberaUsuario2;
        this.usuarioCompartilhadoVazio3 = this.usuarioCompartilhado3 == "" && this.liberaUsuario3;
        this.usuarioCompartilhadoVazio4 = this.usuarioCompartilhado4 == "" && this.liberaUsuario4;
        this.usuarioCompartilhadoVazio5 = this.usuarioCompartilhado5 == "" && this.liberaUsuario5;
        this.usuarioCompartilhadoVazio6 = this.usuarioCompartilhado6 == "" && this.liberaUsuario6;
        this.usuarioCompartilhadoVazio7 = this.usuarioCompartilhado7 == "" && this.liberaUsuario7;
        this.usuarioCompartilhadoVazio8 = this.usuarioCompartilhado8 == "" && this.liberaUsuario8;
        this.usuarioCompartilhadoVazio9 = this.usuarioCompartilhado9 == "" && this.liberaUsuario9;
        if (this.financaCompartilhada) {
            if (this.liberaUsuario9) {
                return !this.valorInvalido && !this.valorVazio &&
                    !this.dataVazia && !this.descricaoVazia &&
                    !this.categoriaVazia && !this.tipoVazio && !this.usuarioCompartilhadoVazio
                    && !this.usuarioCompartilhadoVazio2 && !this.usuarioCompartilhadoVazio3 && !this.usuarioCompartilhadoVazio4
                    && !this.usuarioCompartilhadoVazio5 && !this.usuarioCompartilhadoVazio6 && !this.usuarioCompartilhadoVazio7
                    && !this.usuarioCompartilhadoVazio8 && !this.usuarioCompartilhadoVazio9;
            }
            else if (this.liberaUsuario8) {
                return !this.valorInvalido && !this.valorVazio &&
                    !this.dataVazia && !this.descricaoVazia &&
                    !this.categoriaVazia && !this.tipoVazio && !this.usuarioCompartilhadoVazio
                    && !this.usuarioCompartilhadoVazio2 && !this.usuarioCompartilhadoVazio3 && !this.usuarioCompartilhadoVazio4
                    && !this.usuarioCompartilhadoVazio5 && !this.usuarioCompartilhadoVazio6 && !this.usuarioCompartilhadoVazio7
                    && !this.usuarioCompartilhadoVazio8;
            }
            else if (this.liberaUsuario7) {
                return !this.valorInvalido && !this.valorVazio &&
                    !this.dataVazia && !this.descricaoVazia &&
                    !this.categoriaVazia && !this.tipoVazio && !this.usuarioCompartilhadoVazio
                    && !this.usuarioCompartilhadoVazio2 && !this.usuarioCompartilhadoVazio3 && !this.usuarioCompartilhadoVazio4
                    && !this.usuarioCompartilhadoVazio5 && !this.usuarioCompartilhadoVazio6 && !this.usuarioCompartilhadoVazio7;
            }
            else if (this.liberaUsuario6) {
                return !this.valorInvalido && !this.valorVazio &&
                    !this.dataVazia && !this.descricaoVazia &&
                    !this.categoriaVazia && !this.tipoVazio && !this.usuarioCompartilhadoVazio
                    && !this.usuarioCompartilhadoVazio2 && !this.usuarioCompartilhadoVazio3 && !this.usuarioCompartilhadoVazio4
                    && !this.usuarioCompartilhadoVazio5 && !this.usuarioCompartilhadoVazio6;
            }
            else if (this.liberaUsuario5) {
                return !this.valorInvalido && !this.valorVazio &&
                    !this.dataVazia && !this.descricaoVazia &&
                    !this.categoriaVazia && !this.tipoVazio && !this.usuarioCompartilhadoVazio
                    && !this.usuarioCompartilhadoVazio2 && !this.usuarioCompartilhadoVazio3 && !this.usuarioCompartilhadoVazio4
                    && !this.usuarioCompartilhadoVazio5;
            }
            else if (this.liberaUsuario4) {
                return !this.valorInvalido && !this.valorVazio &&
                    !this.dataVazia && !this.descricaoVazia &&
                    !this.categoriaVazia && !this.tipoVazio && !this.usuarioCompartilhadoVazio
                    && !this.usuarioCompartilhadoVazio2 && !this.usuarioCompartilhadoVazio3 && !this.usuarioCompartilhadoVazio4;
            }
            else if (this.liberaUsuario3) {
                return !this.valorInvalido && !this.valorVazio &&
                    !this.dataVazia && !this.descricaoVazia &&
                    !this.categoriaVazia && !this.tipoVazio && !this.usuarioCompartilhadoVazio
                    && !this.usuarioCompartilhadoVazio2 && !this.usuarioCompartilhadoVazio3;
            }
            else if (this.liberaUsuario2) {
                return !this.valorInvalido && !this.valorVazio &&
                    !this.dataVazia && !this.descricaoVazia &&
                    !this.categoriaVazia && !this.tipoVazio && !this.usuarioCompartilhadoVazio
                    && !this.usuarioCompartilhadoVazio2;
            }
            else {
                return !this.valorInvalido && !this.valorVazio &&
                    !this.dataVazia && !this.descricaoVazia &&
                    !this.categoriaVazia && !this.tipoVazio && !this.usuarioCompartilhadoVazio;
            }
        }
        else {
            return !this.valorInvalido && !this.valorVazio &&
                !this.dataVazia && !this.descricaoVazia &&
                !this.categoriaVazia && !this.tipoVazio;
        }
    };
    AdicionaFinancaPage.prototype.carregaAmigos = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.amigosService.recebeAmizadesFB()
                .then(function (amizades) {
                _this.listaCompartilhada = [];
                var allAmizades = amizades;
                allAmizades.forEach(function (amizade) {
                    if (amizade.verificacao == __WEBPACK_IMPORTED_MODULE_7__models_VerificacaoEnum__["a" /* Verificacao */].Confirmado) {
                        _this.listaDeAmigos.push(amizade);
                        if (_this.carregaAmigosAux(amizade.amigo)) {
                            _this.listaCompartilhada.push(amizade.amigo);
                        }
                    }
                });
            }).then(function (_) {
                if ((_this.getNumeroUsuariosCompartilhados() - 1) != _this.listaCompartilhada.length) {
                    reject();
                }
                else {
                    resolve(_this.listaDeAmigos);
                }
            });
        });
    };
    AdicionaFinancaPage.prototype.carregaAmigosAux = function (username) {
        return username.toLowerCase() === this.usuarioCompartilhado.toLowerCase()
            || username.toLowerCase() === this.usuarioCompartilhado2.toLowerCase()
            || username.toLowerCase() === this.usuarioCompartilhado3.toLowerCase()
            || username.toLowerCase() === this.usuarioCompartilhado4.toLowerCase()
            || username.toLowerCase() === this.usuarioCompartilhado5.toLowerCase()
            || username.toLowerCase() === this.usuarioCompartilhado6.toLowerCase()
            || username.toLowerCase() === this.usuarioCompartilhado7.toLowerCase()
            || username.toLowerCase() === this.usuarioCompartilhado8.toLowerCase()
            || username.toLowerCase() === this.usuarioCompartilhado9.toLowerCase();
    };
    AdicionaFinancaPage.prototype.amigoDeTodosUsuarios = function () {
        if (this.liberaUsuario9) {
            return (this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado2)
                && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado3) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado4)
                && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado5) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado6)
                && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado7) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado8)
                && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado9));
        }
        else if (this.liberaUsuario8) {
            return (this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado2)
                && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado3) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado4)
                && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado5) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado6)
                && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado7) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado8));
        }
        else if (this.liberaUsuario7) {
            return (this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado2)
                && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado3) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado4)
                && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado5) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado6)
                && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado7));
        }
        else if (this.liberaUsuario6) {
            return (this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado2)
                && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado3) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado4)
                && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado5) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado6));
        }
        else if (this.liberaUsuario5) {
            return (this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado2)
                && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado3) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado4)
                && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado5));
        }
        else if (this.liberaUsuario4) {
            return (this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado2)
                && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado3) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado4));
        }
        else if (this.liberaUsuario3) {
            return (this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado2)
                && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado3));
        }
        else if (this.liberaUsuario2) {
            return (this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado) && this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado2));
        }
        else {
            return (this.usuarioEstaNaListaDeAmigos(this.usuarioCompartilhado));
        }
    };
    AdicionaFinancaPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-adiciona-financa',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/adiciona-financa/adiciona-financa.html"*/'<ion-header>\n  <ion-navbar color="corPrimaria">\n    <ion-title>Nova finança</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content class="cor-background">\n  <ion-card>\n    <ion-card-header color="corPrimaria">\n      Tipo da finança\n    </ion-card-header>\n    <ion-list radio-group [(ngModel)]="tipoFinanca">\n      <ion-item>\n        <ion-icon name=\'pricetags\' item-start color="corPrimaria"></ion-icon>\n        <ion-label>Débito</ion-label>\n        <ion-radio value="debito"></ion-radio>\n      </ion-item>\n      <ion-item>\n        <ion-icon name=\'cash\' item-start color="corPrimaria"></ion-icon>\n        <ion-label>Crédito</ion-label>\n        <ion-radio value="credito"></ion-radio>\n      </ion-item>\n    </ion-list>\n  </ion-card>\n\n  <ion-card>\n    <ion-card-header color="corPrimaria">\n      Informações\n    </ion-card-header>\n    <ion-item>\n      <ion-icon name=\'clipboard\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" [(ngModel)]="financa.descricao" placeholder="Descrição"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="descricaoVazia">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite a descrição.</p>\n    </ion-item>\n\n    <ion-item>\n      <ion-icon name=\'cash\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" name="money" placeholder="Valor" [brmasker]="{money: true, thousand: \'.\',  decimalCaracter: \',\', len: 11}"\n        [(ngModel)]="valorFinanca"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="valorInvalido">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">O valor deverá ser maior que zero.</p>\n    </ion-item>\n    <ion-item *ngIf="valorVazio">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite o valor.</p>\n    </ion-item>\n\n    <ion-item>\n      <ion-icon name=\'calendar\' item-start color="corPrimaria"></ion-icon>\n      <ion-datetime placeholder="Data" cancelText="Cancelar" doneText="Ok" min="2017" max="2020" displayFormat="DD/MM/YYYY" [(ngModel)]="financa.data">\n      </ion-datetime>\n    </ion-item>\n    <ion-item *ngIf="dataVazia">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Selecione a data.</p>\n    </ion-item>\n\n    <ion-list>\n      <ion-item>\n        <ion-icon name="list-box" color="corPrimaria" item-start></ion-icon>\n        <ion-select interface="popover" placeholder="Categoria" [(ngModel)]="financa.categoria">\n          <ion-option value="alimentacao">Alimentação</ion-option>\n          <ion-option value="vestuario">Vestuário</ion-option>\n          <ion-option value="entretenimento">Entretenimento</ion-option>\n          <ion-option value="bebida">Bebida</ion-option>\n          <ion-option value="supermercado">Supermercado</ion-option>\n          <ion-option value="transporte">Transporte</ion-option>\n          <ion-option value="eletronicos">Eletrônicos</ion-option>\n          <ion-option value="outros">Outros</ion-option>\n        </ion-select>\n      </ion-item>\n    </ion-list>\n\n    <ion-item>\n      <ion-label>Compartilhar finança</ion-label>\n      <ion-checkbox color="corPrimaria" (ionChange)="updateFinancaCompartilhada()"></ion-checkbox>\n    </ion-item>\n\n  </ion-card>\n\n  <ion-card *ngIf="financaCompartilhada">\n    <ion-card-header color="corPrimaria">\n      Finança compartilhada\n    </ion-card-header>\n    <ion-item>\n      <ion-icon name=\'contact\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" [(ngModel)]="usuarioCompartilhado" placeholder="Usuário"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="usuarioCompartilhadoVazio">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite o nome do usuário ou desmarque a opção "Compartilhar finança".</p>\n    </ion-item>\n\n    <ion-item *ngIf="liberaUsuario2">\n      <ion-icon name=\'contact\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" [(ngModel)]="usuarioCompartilhado2" placeholder="Usuário"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="usuarioCompartilhadoVazio2">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite o nome do usuário ou desmarque a opção "Compartilhar finança".</p>\n    </ion-item>\n\n    <ion-item *ngIf="liberaUsuario3">\n      <ion-icon name=\'contact\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" [(ngModel)]="usuarioCompartilhado3" placeholder="Usuário"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="usuarioCompartilhadoVazio3">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite o nome do usuário ou desmarque a opção "Compartilhar finança".</p>\n    </ion-item>\n\n    <ion-item *ngIf="liberaUsuario4">\n      <ion-icon name=\'contact\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" [(ngModel)]="usuarioCompartilhado4" placeholder="Usuário"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="usuarioCompartilhadoVazio4">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite o nome do usuário ou desmarque a opção "Compartilhar finança".</p>\n    </ion-item>\n\n    <ion-item *ngIf="liberaUsuario5">\n      <ion-icon name=\'contact\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" [(ngModel)]="usuarioCompartilhado5" placeholder="Usuário"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="usuarioCompartilhadoVazio5">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite o nome do usuário ou desmarque a opção "Compartilhar finança".</p>\n    </ion-item>\n\n    <ion-item *ngIf="liberaUsuario6">\n      <ion-icon name=\'contact\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" [(ngModel)]="usuarioCompartilhado6" placeholder="Usuário"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="usuarioCompartilhadoVazio6">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite o nome do usuário ou desmarque a opção "Compartilhar finança".</p>\n    </ion-item>\n\n    <ion-item *ngIf="liberaUsuario7">\n      <ion-icon name=\'contact\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" [(ngModel)]="usuarioCompartilhado7" placeholder="Usuário"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="usuarioCompartilhadoVazio7">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite o nome do usuário ou desmarque a opção "Compartilhar finança".</p>\n    </ion-item>\n\n    <ion-item *ngIf="liberaUsuario8">\n      <ion-icon name=\'contact\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" [(ngModel)]="usuarioCompartilhado8" placeholder="Usuário"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="usuarioCompartilhadoVazio8">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite o nome do usuário ou desmarque a opção "Compartilhar finança".</p>\n    </ion-item>\n\n    <ion-item *ngIf="liberaUsuario9">\n      <ion-icon name=\'contact\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" [(ngModel)]="usuarioCompartilhado9" placeholder="Usuário"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="usuarioCompartilhadoVazio9">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite o nome do usuário ou desmarque a opção "Compartilhar finança".</p>\n    </ion-item>\n\n    <ion-row>\n      <ion-col width-50 style="text-align: center">\n        <button padding icon-start ion-button round color="corPrimaria" (click)="adicionaOutroUsuario()">\n          <ion-icon name="add"></ion-icon>\n          Adicionar outro usuário\n        </button>\n        <button padding icon-start ion-button round color="corDivida" (click)="removeOutroUsuario()">\n          <ion-icon name="trash"></ion-icon>\n          Remover outro usuário\n        </button>\n      </ion-col>\n    </ion-row>\n  </ion-card>\n\n  <ion-fab bottom right>\n    <button ion-fab (click)="adicionaFinanca()" color="corPrimaria">\n      <ion-icon name="checkmark"></ion-icon>\n    </button>\n  </ion-fab>\n\n</ion-content>'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/adiciona-financa/adiciona-financa.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_financa_service_financa_service__["a" /* FinancaServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_5__providers_meta_service_meta_service__["a" /* MetaServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_6__providers_amigos_service_amigos_service__["a" /* AmigosServiceProvider */]])
    ], AdicionaFinancaPage);
    return AdicionaFinancaPage;
}());

//# sourceMappingURL=adiciona-financa.js.map

/***/ }),

/***/ 219:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdicionaMetaPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_meta_service_meta_service__ = __webpack_require__(98);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the AdicionaMetaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var AdicionaMetaPage = /** @class */ (function () {
    function AdicionaMetaPage(navCtrl, navParams, toastCtrl, authService, metaService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.authService = authService;
        this.metaService = metaService;
        this.meta = {};
        //booleans de verificação
        this.limiteInvalido = false;
        this.limiteVazio = false;
        this.categoriaVazia = false;
    }
    AdicionaMetaPage.prototype.ionViewDidLoad = function () {
    };
    AdicionaMetaPage.prototype.abrirToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    };
    AdicionaMetaPage.prototype.adicionaMeta = function () {
        var _this = this;
        // TODO: remover depois de adicionar os campos
        // categoria e ehDebito ao form de criação de financas
        if (!this.confirmaDados()) {
            this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
        }
        else {
            this.metaService.adicionaMetaFB(this.meta)
                .then(function (_) {
                _this.navCtrl.pop();
            });
        }
    };
    AdicionaMetaPage.prototype.confirmaDados = function () {
        this.limiteInvalido = this.meta.limite <= 0;
        this.limiteVazio = this.meta.limite == null;
        this.categoriaVazia = this.meta.categoria == null;
        return !this.limiteInvalido && !this.limiteVazio &&
            !this.categoriaVazia;
    };
    AdicionaMetaPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-adiciona-meta',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/adiciona-meta/adiciona-meta.html"*/'<ion-header>\n  <ion-navbar color="corMeta">\n    <ion-title>Nova meta</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content class="cor-background">\n  <ion-card>  \n    <ion-list>\n        <ion-list-header color="corMeta">\n            Informações\n        </ion-list-header>\n      <ion-item>\n        <ion-label>Categorias</ion-label>\n        <ion-icon name="list-box" color="corMeta" item-start></ion-icon>\n        <ion-select placeholder="Categoria" [(ngModel)]="meta.categoria">\n          <ion-option value="alimentacao">Alimentação</ion-option>\n          <ion-option value="vestuario">Vestuário</ion-option>\n          <ion-option value="entretenimento">Entretenimento</ion-option>\n          <ion-option value="bebida">Bebida</ion-option>\n          <ion-option value="supermercado">Supermercado</ion-option>\n          <ion-option value="transporte">Transporte</ion-option>\n          <ion-option value="eletronicos">Eletrônicos</ion-option>\n          <ion-option value="outros">Outros</ion-option>\n        </ion-select>\n      </ion-item>\n    </ion-list>\n\n    <ion-item>\n      <ion-icon name=\'cash\' item-start color="corMeta"></ion-icon>\n      <ion-input type="text" name="money" placeholder="Limite de gasto" \n      [brmasker]="{money: true, thousand: \'.\',  decimalCaracter: \',\', len: 11}" \n      [(ngModel)]="meta.limite"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="limiteInvalido">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">O limite deverá ser maior que zero.</p>\n    </ion-item>\n    <ion-item *ngIf="limiteVazio">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite o limite.</p>\n    </ion-item>\n\n  </ion-card>\n\n  <ion-fab bottom right>\n    <button ion-fab (click)="adicionaMeta()" color="corMeta">\n      <ion-icon name="checkmark"></ion-icon>\n    </button>\n  </ion-fab>\n\n</ion-content>'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/adiciona-meta/adiciona-meta.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_3__providers_meta_service_meta_service__["a" /* MetaServiceProvider */]])
    ], AdicionaMetaPage);
    return AdicionaMetaPage;
}());

//# sourceMappingURL=adiciona-meta.js.map

/***/ }),

/***/ 220:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdicionaPagamentoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_image_picker__ = __webpack_require__(362);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_pagamento_service_pagamento_service__ = __webpack_require__(121);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Generated class for the AdicionaPagamentoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var AdicionaPagamentoPage = /** @class */ (function () {
    function AdicionaPagamentoPage(navCtrl, navParams, toastCtrl, statusBar, authService, alertCtrl, imagePicker, pagamentoService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.statusBar = statusBar;
        this.authService = authService;
        this.alertCtrl = alertCtrl;
        this.imagePicker = imagePicker;
        this.pagamentoService = pagamentoService;
        this.pagamento = {};
        this.imagem = "nnn";
        this.valorInvalido = false;
        this.valorVazio = false;
        this.descricaoVazia = false;
        this.nomeVazio = false;
        this.dataVazia = false;
    }
    AdicionaPagamentoPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad AdicionaPagamentoPage');
    };
    AdicionaPagamentoPage.prototype.abrirToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    };
    AdicionaPagamentoPage.prototype.adicionaPagamento = function () {
        var _this = this;
        if (!this.confirmaDados()) {
            this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
        }
        else {
            this.pagamento = __assign({}, this.pagamento, { imagem: this.imagem });
            this.pagamentoService.adicionaPagamentoFB(this.pagamento)
                .then(function (_) {
                _this.navCtrl.pop();
                _this.abrirToast("Pagamento registrado.");
            });
        }
    };
    AdicionaPagamentoPage.prototype.selecionaImagem = function () {
        var _this = this;
        var options = {
            maximumImagesCount: 1
        };
        this.imagePicker.getPictures(options).then(function (results) {
            _this.imagem = results[0];
        }, function (err) { });
        this.imagem = "nnn";
    };
    AdicionaPagamentoPage.prototype.confirmaDados = function () {
        this.valorInvalido = this.pagamento.valor <= 0;
        this.valorVazio = this.pagamento.valor == null;
        this.dataVazia = this.pagamento.data == null;
        this.descricaoVazia = this.pagamento.descricao == "" || this.pagamento.descricao == null;
        this.nomeVazio = this.pagamento.nomeDoFiador == "" || this.pagamento.nomeDoFiador == null;
        return !this.valorInvalido && !this.valorVazio && !this.dataVazia && !this.descricaoVazia && !this.nomeVazio;
    };
    AdicionaPagamentoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-adiciona-pagamento',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/adiciona-pagamento/adiciona-pagamento.html"*/'<ion-header>\n    <ion-navbar color="corPrimaria">\n      <ion-title>Novo lembrete de pagamento</ion-title>\n    </ion-navbar>\n  </ion-header>\n  \n  \n  <ion-content class="cor-background">      \n    <ion-card>\n      <ion-card-header color="corPrimaria">\n        Informações\n      </ion-card-header>\n\n      <ion-item>\n          <ion-icon name=\'person\' item-start color="corPrimaria"></ion-icon>\n          <ion-input type="text" [(ngModel)]="pagamento.nomeDoFiador" placeholder="Nome do fiador"></ion-input>\n        </ion-item>\n        <ion-item *ngIf="nomeVazio">\n          <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n          <p class="erro">Digite o nome do fiador.</p>\n        </ion-item>\n\n      <ion-item>\n        <ion-icon name=\'clipboard\' item-start color="corPrimaria"></ion-icon>\n        <ion-input type="text" [(ngModel)]="pagamento.descricao" placeholder="Descrição"></ion-input>\n      </ion-item>\n      <ion-item *ngIf="descricaoVazia">\n        <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n        <p class="erro">Digite a descrição.</p>\n      </ion-item>\n  \n      <ion-item>\n        <ion-icon name=\'cash\' item-start color="corPrimaria"></ion-icon>\n        <ion-input type="text" name="money" placeholder="Valor" \n          [brmasker]="{money: true, thousand: \'.\',  decimalCaracter: \',\', len: 11}" \n          [(ngModel)]="pagamento.valor"></ion-input>\n      </ion-item>\n      <ion-item *ngIf="valorInvalido">\n        <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n        <p class="erro">O valor deverá ser maior que zero.</p>\n      </ion-item>\n      <ion-item *ngIf="valorVazio">\n        <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n        <p class="erro">Digite o valor.</p>\n      </ion-item>\n  \n      <ion-item>\n        <ion-icon name=\'calendar\' item-start color="corPrimaria"></ion-icon>\n        <ion-datetime placeholder="Data" cancelText="Cancelar" doneText="Ok"\n          min="2017" max="2020" displayFormat="DD/MM/YYYY" [(ngModel)]="pagamento.data">\n        </ion-datetime>\n      </ion-item>\n      <ion-item *ngIf="dataVazia">\n        <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n        <p class="erro">Selecione a data.</p>\n      </ion-item>\n\n      <ion-card *ngIf="imagem != null && imagem != \'nnn\'">\n        <ion-card-header color="corPrimaria">\n          Imagem\n        </ion-card-header>\n        <ion-item>        \n          <img [src]="imagem">\n        </ion-item>\n      </ion-card>\n\n      <ion-row>\n        <ion-col width-50 style="text-align: center">\n          <button padding icon-start ion-button round color="corPrimaria" (click)="selecionaImagem()">\n              <ion-icon name="camera"></ion-icon>\n            Adicionar imagem\n          </button>\n        </ion-col>\n      </ion-row>\n    </ion-card>\n\n    <ion-fab bottom right>\n      <button ion-fab (click)="adicionaPagamento()" color="corPrimaria">\n        <ion-icon name="checkmark"></ion-icon>\n      </button>\n    </ion-fab>\n  \n  </ion-content>'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/adiciona-pagamento/adiciona-pagamento.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_3__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_image_picker__["a" /* ImagePicker */],
            __WEBPACK_IMPORTED_MODULE_5__providers_pagamento_service_pagamento_service__["a" /* PagamentoServiceProvider */]])
    ], AdicionaPagamentoPage);
    return AdicionaPagamentoPage;
}());

//# sourceMappingURL=adiciona-pagamento.js.map

/***/ }),

/***/ 221:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AmigosPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_amigos_service_amigos_service__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__adiciona_amigo_adiciona_amigo__ = __webpack_require__(363);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_VerificacaoEnum__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__chat_room_chat_room__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_chat_service_chat_service__ = __webpack_require__(185);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__detalhes_amigos_detalhes_amigos__ = __webpack_require__(223);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










/**
 * Generated class for the AmigosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var AmigosPage = /** @class */ (function () {
    function AmigosPage(navCtrl, navParams, authProvider, statusBar, amigosService, alertCtrl, chatService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.authProvider = authProvider;
        this.statusBar = statusBar;
        this.amigosService = amigosService;
        this.alertCtrl = alertCtrl;
        this.chatService = chatService;
        this.amigos = [];
        this.amigosPendentes = [];
        this.amigosSolicitantes = [];
        this.amizades = [];
        this.solicitacoes = [];
        this.carregaAmigos();
    }
    AmigosPage.prototype.ionViewDidLoad = function () { };
    AmigosPage.prototype.carregaAmigos = function () {
        var _this = this;
        this.amigos = [];
        this.amigosPendentes = [];
        this.amizades = [];
        this.solicitacoes = [];
        this.amigosService.recebeAmizadesFB()
            .then(function (amizades) {
            var allAmizades = amizades;
            allAmizades.forEach(function (amizade) {
                if (amizade.verificacao == __WEBPACK_IMPORTED_MODULE_6__models_VerificacaoEnum__["a" /* Verificacao */].Confirmado) {
                    _this.amizades.push(amizade);
                }
                else if (amizade.verificacao == __WEBPACK_IMPORTED_MODULE_6__models_VerificacaoEnum__["a" /* Verificacao */].Pendente) {
                    _this.solicitacoes.push(amizade);
                }
                _this.authProvider.getUsuarioRef(amizade.amigo).then(function (amigo) {
                    if (amizade.verificacao == __WEBPACK_IMPORTED_MODULE_6__models_VerificacaoEnum__["a" /* Verificacao */].Confirmado) {
                        _this.amigos.push(amigo);
                    }
                    else if (amizade.verificacao == __WEBPACK_IMPORTED_MODULE_6__models_VerificacaoEnum__["a" /* Verificacao */].Pendente) {
                        _this.amigosPendentes.push(amigo);
                        if (amizade.criador == amizade.amigo) {
                            _this.amigosSolicitantes.push(amigo);
                        }
                    }
                });
            });
        });
    };
    AmigosPage.prototype.modalAdicionaAmigo = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__adiciona_amigo_adiciona_amigo__["a" /* AdicionaAmigoPage */]);
    };
    AmigosPage.prototype.removeAmigo = function (usuario) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: "Excluir amigo",
            message: "Você tem certeza que deseja excluir este amigo?"
                + "\n\n" + "Todas as informações serão deletadas.",
            buttons: [{
                    text: 'Cancelar',
                    handler: function () { }
                },
                {
                    text: 'Excluir',
                    handler: function () {
                        _this.amigosService.removeAmizadeFB(usuario)
                            .then(function (_) {
                            _this.amigos = _this.amigos
                                .filter(function (amg) { return amg.username !== usuario.username; });
                        });
                    }
                }
            ]
        });
        alert.present();
    };
    AmigosPage.prototype.existeAmigos = function () {
        return this.amizades.length > 0;
    };
    AmigosPage.prototype.existeSolicitacoesPendentes = function () {
        return this.solicitacoes.length > 0;
    };
    AmigosPage.prototype.podeAceitarSolicitacao = function (usuario) {
        return this.amigosSolicitantes.indexOf(usuario) > -1;
    };
    AmigosPage.prototype.aceitaSolicitacao = function (usuario) {
        var _this = this;
        this.solicitacoes.forEach(function (amizade) {
            if (usuario.username == amizade.amigo) {
                _this.amigosService.confirmaAmizadeFB(amizade, __WEBPACK_IMPORTED_MODULE_6__models_VerificacaoEnum__["a" /* Verificacao */].Confirmado)
                    .then(function (_) {
                    _this.carregaAmigos();
                });
            }
        });
    };
    AmigosPage.prototype.rejeitaSolicitacao = function (usuario) {
        var _this = this;
        this.solicitacoes.forEach(function (amizade) {
            if (usuario.username == amizade.amigo) {
                _this.amigosService.confirmaAmizadeFB(amizade, __WEBPACK_IMPORTED_MODULE_6__models_VerificacaoEnum__["a" /* Verificacao */].Negado)
                    .then(function (_) {
                    _this.carregaAmigos();
                });
            }
        });
    };
    AmigosPage.prototype.retornaFoto = function (usuario) {
        return this.authProvider.getGravatarUsuario(usuario.email, "https://cdn.pbrd.co/images/HwxHoFO.png");
    };
    AmigosPage.prototype.conversar = function (amigo) {
        var _this = this;
        this.authProvider.getUsuarioLogado()
            .then(function (user) {
            var usuarioLogado = user;
            _this.chatService.setupChat(usuarioLogado, amigo)
                .then(function (_) {
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__chat_room_chat_room__["a" /* ChatRoomPage */]);
            });
        });
    };
    AmigosPage.prototype.modalEstatisticasAmigo = function (usuario) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__detalhes_amigos_detalhes_amigos__["a" /* DetalhesAmigosPage */], usuario);
    };
    AmigosPage.prototype.modalMostraDetalhes = function (amizade) {
    };
    AmigosPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-amigos',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/amigos/amigos.html"*/'<ion-header>\n    <ion-navbar color="corPrimaria">\n      <button ion-button menuToggle>\n        <ion-icon name="menu"></ion-icon>\n      </button>\n      <ion-title>Amigos</ion-title>\n    </ion-navbar>\n  </ion-header>\n\n\n<ion-content class="cor-background">\n\n  <ion-list *ngIf="existeSolicitacoesPendentes()">\n    <ion-card>\n      <ion-card-header color="corSolicitacaoPendente">\n        Soliticações de amizade pendentes\n      </ion-card-header>\n      <ion-card-content style="padding:0%;">\n        <ion-card *ngFor="let usuario of amigosPendentes">\n          <ion-card-content style="padding:0%;">\n            <ion-item>\n              <ion-avatar item-start>\n                <img [src]="retornaFoto(usuario)">\n              </ion-avatar>\n              <h2>{{usuario.username}}</h2>\n            </ion-item>\n            <ion-row>\n              <ion-col text-center *ngIf="podeAceitarSolicitacao(usuario)">\n                <button ion-button icon-only icon-start clear color="corSolicitacaoPendente" (click)="aceitaSolicitacao(usuario)">\n                  <ion-icon name="checkmark" color="corPrimaria"></ion-icon>\n                  Confirmar\n                </button>\n              </ion-col>\n              <ion-col text-center *ngIf="podeAceitarSolicitacao(usuario)">\n                <button ion-button icon-only icon-start clear color="corSolicitacaoPendente" (click)="rejeitaSolicitacao(usuario)">\n                  <ion-icon name="close" color="corDivida"></ion-icon>\n                  Rejeitar\n                </button>\n              </ion-col>\n            </ion-row>\n          </ion-card-content>\n        </ion-card>\n      </ion-card-content>\n    </ion-card>\n  </ion-list>\n\n  <ion-list>\n    <ion-card>\n      <ion-card-header color="corAmigos">\n        Meus amigos\n        <p *ngIf="existeAmigos()"></p>\n      </ion-card-header>\n\n      <ion-item *ngIf="!existeAmigos()">\n        <p style="white-space: normal;" text-center>Você não possui nenhum amigo adicionado.</p>\n      </ion-item>\n\n      <ion-item *ngFor="let usuario of amigos">\n        <div id="nome" item-start></div>\n        <ion-avatar item-start>\n          <img [src]="retornaFoto(usuario)">\n        </ion-avatar>\n        <h2>{{usuario.nome}}</h2>\n        <p>{{usuario.username}}</p>\n        <button ion-button color="corAmigos" clear item-end (click)="modalEstatisticasAmigo(usuario)">Detalhes</button>\n        <button ion-button color="corAmigos" clear item-end (click)="conversar(usuario)">\n          <ion-icon name="chatboxes" color="corAmigos"></ion-icon>\n        </button>\n      </ion-item>\n    </ion-card>\n  </ion-list>\n\n  <ion-fab bottom right>\n      <button ion-fab (click)="modalAdicionaAmigo()" color="corAmigos">\n        <ion-icon name="add"></ion-icon>\n      </button>\n    </ion-fab>\n\n</ion-content>\n'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/amigos/amigos.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_3__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_4__providers_amigos_service_amigos_service__["a" /* AmigosServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_8__providers_chat_service_chat_service__["a" /* ChatService */]])
    ], AmigosPage);
    return AmigosPage;
}());

//# sourceMappingURL=amigos.js.map

/***/ }),

/***/ 222:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatRoomPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_chat_service_chat_service__ = __webpack_require__(185);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_auth_auth__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ChatRoomPage = /** @class */ (function () {
    function ChatRoomPage(navCtrl, navParams, chatService, auth) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.chatService = chatService;
        this.auth = auth;
        this.chats = [];
        this.loadUsers();
    }
    ChatRoomPage.prototype.ionViewDidEnter = function () {
        this.scrollToBottom();
    };
    ChatRoomPage.prototype.ionViewDidLoad = function () {
        this.loadChats();
    };
    ChatRoomPage.prototype.loadChats = function () {
        var _this = this;
        this.chatService.carregarChats()
            .valueChanges()
            .subscribe(function (chats) {
            _this.chats = chats;
        });
    };
    ChatRoomPage.prototype.addChat = function () {
        var _this = this;
        if (this.message && this.message.trim() !== "") {
            this.chatPayload = {
                message: this.message,
                sender: this.usuarioLogado.email,
                pair: this.chatService.currentChatPairId,
                time: new Date().getTime()
            };
            this.chatService
                .adicionaChat(this.chatPayload)
                .then(function () {
                //Clear message box
                _this.message = "";
                //Scroll to bottom
                _this.scrollToBottom();
            });
        }
    };
    ChatRoomPage.prototype.loadUsers = function () {
        var _this = this;
        this.amigo = this.chatService.currentChatPartner;
        this.auth.getUsuarioLogado()
            .then(function (user) {
            _this.usuarioLogado = user;
        });
    };
    ChatRoomPage.prototype.scrollToBottom = function () {
        this.content.scrollToBottom(300); //300ms 
    };
    ChatRoomPage.prototype.isChatPartner = function (senderEmail) {
        return senderEmail === this.amigo.email;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])("content"),
        __metadata("design:type", Object)
    ], ChatRoomPage.prototype, "content", void 0);
    ChatRoomPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-chat-room',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/chat-room/chat-room.html"*/'<ion-header>\n  <ion-navbar color="corPrimaria">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>{{this.amigo.username}}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content class="cor-background" #content padding id="chatPage">\n\n  <ion-list>\n\n    <ion-item *ngFor="let chat of chats" class="chat" text-wrap \n      [ngClass]="{\'chat-partner\' : isChatPartner(chat.sender)}">\n      {{ chat.message }}\n    </ion-item>\n\n  </ion-list>\n\n</ion-content>\n\n<ion-footer>\n  <ion-toolbar color="corChat">\n		<form (ngSubmit)="addChat()">\n			<ion-row>\n				<ion-col col-9>\n					<ion-input type="text" [(ngModel)]="message" placeholder="Escreva algo..." name="message">\n					</ion-input>\n				</ion-col>\n				<ion-col col-3>\n					<button ion-button outline block color="corChatEnviar" type="submit">Enviar</button>\n				</ion-col>\n			</ion-row>\n		</form>\n  </ion-toolbar>\n</ion-footer>\n'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/chat-room/chat-room.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__providers_chat_service_chat_service__["a" /* ChatService */],
            __WEBPACK_IMPORTED_MODULE_3__providers_auth_auth__["a" /* AuthProvider */]])
    ], ChatRoomPage);
    return ChatRoomPage;
}());

//# sourceMappingURL=chat-room.js.map

/***/ }),

/***/ 223:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DetalhesAmigosPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_financa_service_financa_service__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_auth_auth__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the DetalhesAmigosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var DetalhesAmigosPage = /** @class */ (function () {
    function DetalhesAmigosPage(navCtrl, navParams, financaService, authProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.financaService = financaService;
        this.authProvider = authProvider;
        this.financas = [];
        this.financasDoAmigo = [];
        this.hoje = new Date();
        this.mesAtual = this.hoje.getMonth() + 1;
        this.amigo = this.navParams.data;
    }
    DetalhesAmigosPage.prototype.ionViewDidLoad = function () {
        this.carregaFinancasFB();
        this.carregaFinancasDoAmigoFB();
    };
    DetalhesAmigosPage.prototype.carregaFinancasFB = function () {
        var _this = this;
        this.financaService.recebeFinancasFB()
            .then(function (financas) {
            _this.financas = _this.ordenaFinancas(_this.filtraFinancas(financas));
        });
    };
    DetalhesAmigosPage.prototype.carregaFinancasDoAmigoFB = function () {
        var _this = this;
        this.financaService.recebeFinancasDeUsuarioFB(this.amigo.username)
            .then(function (financas) {
            _this.financasDoAmigo = _this.ordenaFinancas(_this.filtraFinancas(financas));
        });
    };
    DetalhesAmigosPage.prototype.filtraFinancas = function (financas) {
        var financasFiltradas = [];
        for (var i = 0; i < financas.length; i++) {
            var dataFinancaAtual = new Date(financas[i].data);
            if (dataFinancaAtual.getMonth() == this.mesAtual - 1) {
                financasFiltradas.push(financas[i]);
            }
        }
        return financasFiltradas;
    };
    DetalhesAmigosPage.prototype.ordenaFinancas = function (financas) {
        return financas.sort(this.compareFinancas);
    };
    DetalhesAmigosPage.prototype.compareFinancas = function (a, b) {
        var dataA = new Date(a.data);
        var dataB = new Date(b.data);
        if (dataA.getTime() > dataB.getTime()) {
            return -1;
        }
        if (dataA.getTime() < dataB.getTime()) {
            return 1;
        }
        return 0;
    };
    DetalhesAmigosPage.prototype.retornaSomaDebito = function (lista) {
        var soma = 0.0;
        for (var i = 0; i < lista.length; i++) {
            if (lista[i].ehDebito == true) {
                soma += lista[i].valor;
            }
        }
        console.log(soma);
        return soma;
    };
    DetalhesAmigosPage.prototype.diferencaGasto = function () {
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
    };
    DetalhesAmigosPage.prototype.categoriaComMaisGastos = function (financas) {
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
    };
    DetalhesAmigosPage.prototype.formataValor = function (valor) {
        return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
    };
    DetalhesAmigosPage.prototype.retornaFoto = function (usuario) {
        return this.authProvider.getGravatarUsuario(usuario.email, "https://cdn.pbrd.co/images/HwxHoFO.png");
    };
    DetalhesAmigosPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-detalhes-amigos',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/detalhes-amigos/detalhes-amigos.html"*/'<ion-header>\n  <ion-navbar color="corPrimaria">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Detalhes</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content class="cor-background">\n  <ion-grid>\n    <ion-row>\n      <ion-col>\n      </ion-col>\n      <ion-col col-9 text-center>\n        <img class="image_circle" width="150" height="150" [src]="retornaFoto(amigo)">\n      </ion-col>\n      <ion-col>\n      </ion-col>\n    </ion-row>\n  </ion-grid>\n  <ion-item class="cor-background">\n      <p text-center style="font-size:  2rem;font-weight: 500;">{{amigo.nome}}</p>\n    </ion-item>\n\n    <ion-card>\n        <ion-card-header color="corPrimaria">\n          Informações\n        </ion-card-header>\n        <ion-item>\n            <ion-icon name=\'contact\' item-start color="corPrimaria"></ion-icon>\n            <h2>Nome de Usuário</h2>\n            <p>{{amigo.username}}</p>\n        </ion-item>\n        <ion-item>\n            <ion-icon name=\'briefcase\' item-start color="corPrimaria"></ion-icon>\n            <h2>Profissão</h2>\n            <p>{{amigo.profissao}}</p>\n        </ion-item>\n      </ion-card>\n    \n    <ion-card>\n        <ion-card-header color="corPrimaria">\n         Comparativo\n        </ion-card-header>\n          <ion-item *ngIf="!gastouMais">\n              <ion-icon name=\'arrow-up\' item-start color="corEmprestimo"></ion-icon>\n              <p>Você gastou R$ {{formataValor(diferencaGasto())}} a menos</p>\n              <p>que seu amigo no mês atual</p>\n            </ion-item>\n            <ion-item *ngIf="gastouMais">\n              <ion-icon name=\'arrow-down\' item-start color="corDivida"></ion-icon>\n              <p>Você gastou R$ {{formataValor(diferencaGasto())}} a mais</p>\n              <p>que seu amigo no mês atual</p>\n            </ion-item>\n            <ion-item>\n                <ion-icon name=\'logo-usd\' item-start color="corPrimaria"></ion-icon>\n                <p>A categoria que você mais gastou foi</p>\n                <p>{{categoriaComMaisGastos(this.financas)}}</p>\n            </ion-item>\n            <ion-item>\n                <ion-icon name=\'logo-usd\' item-start color="corMeta"></ion-icon>\n                <p>A categoria que seu amigo mais gastou foi</p>\n                <p>{{categoriaComMaisGastos(this.financasDoAmigo)}}</p>\n            </ion-item>\n      </ion-card>\n</ion-content>\n'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/detalhes-amigos/detalhes-amigos.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_financa_service_financa_service__["a" /* FinancaServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_3__providers_auth_auth__["a" /* AuthProvider */]])
    ], DetalhesAmigosPage);
    return DetalhesAmigosPage;
}());

//# sourceMappingURL=detalhes-amigos.js.map

/***/ }),

/***/ 224:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditaDividaPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_divida_service_divida_service__ = __webpack_require__(46);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var EditaDividaPage = /** @class */ (function () {
    function EditaDividaPage(navCtrl, navParams, dividaService, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.dividaService = dividaService;
        this.toastCtrl = toastCtrl;
        this.divida = {};
        this.nomeVazio = false;
        this.valorInvalido = false;
        this.valorVazio = false;
        this.dataVazia = false;
        this.descricaoVazia = false;
        this.divida = this.navParams.data;
    }
    EditaDividaPage.prototype.ionViewDidEnter = function () {
        this.navParams.data.valor = this.dividaService.formataValor(this.divida.valor);
    };
    EditaDividaPage.prototype.abrirToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    };
    EditaDividaPage.prototype.editaDivida = function () {
        if (!this.confirmaDados()) {
            this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
        }
        else {
            this.atualizaDividaFB();
        }
    };
    EditaDividaPage.prototype.atualizaDividaFB = function () {
        var _this = this;
        this.dividaService.editaDividaEmprestimoFB(this.divida).then(function (_) {
            _this.navCtrl.pop();
            _this.abrirToast("Dívida editada.");
        }).catch(function (err) {
            _this.abrirToast("Ops... Ocorreu algum erro!");
        });
    };
    EditaDividaPage.prototype.confirmaDados = function () {
        this.nomeVazio = this.divida.nomeUsuarioDevedor == "" || this.divida.nomeUsuarioDevedor == null;
        this.valorInvalido = this.divida.valor <= 0;
        this.valorVazio = this.divida.valor == null;
        this.dataVazia = this.divida.data == null;
        this.descricaoVazia = this.divida.descricao == "" || this.divida.descricao == null;
        return !this.valorInvalido && !this.nomeVazio && !this.valorVazio &&
            !this.dataVazia && !this.descricaoVazia;
    };
    EditaDividaPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-edita-divida',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/edita-divida/edita-divida.html"*/'<ion-header>\n\n    <ion-navbar color="corDivida">\n\n      <ion-title>Editar dívida de {{divida.nomeUsuarioDevedor}}</ion-title>\n\n    </ion-navbar>\n\n  </ion-header>\n\n  \n\n  \n\n  <ion-content class="cor-background">\n\n    <ion-card>\n\n      <ion-card-header color="corDivida">\n\n        Informações\n\n      </ion-card-header>\n\n      <ion-item>\n\n        <ion-icon name=\'cash\' item-start color="corDivida"></ion-icon>\n\n        <ion-input type="text" name="money" placeholder="Valor" [brmasker]="{money: true, thousand: \'.\',  decimalCaracter: \',\', len:11}" [(ngModel)]="divida.valor"></ion-input>\n\n      </ion-item>\n\n      <ion-item *ngIf="valorInvalido">\n\n        <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n        <p class="erro">O valor deverá ser maior que zero.</p>\n\n      </ion-item>\n\n      <ion-item *ngIf="valorVazio">\n\n        <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n        <p class="erro">Digite o valor.</p>\n\n      </ion-item>\n\n  \n\n      <ion-item>\n\n        <ion-icon name=\'calendar\' item-start color="corDivida"></ion-icon>\n\n        <ion-datetime placeholder="Data" cancelText="Cancelar" doneText="Ok" min="2017" max="2020" displayFormat="DD/MM/YYYY" [(ngModel)]="divida.data"></ion-datetime>\n\n      </ion-item>\n\n      <ion-item *ngIf="dataVazia">\n\n        <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n        <p class="erro">Selecione a data.</p>\n\n      </ion-item>\n\n  \n\n      <ion-item>\n\n        <ion-icon name=\'clipboard\' item-start color="corDivida"></ion-icon>\n\n        <ion-input type="text" [(ngModel)]="divida.descricao" placeholder="Descrição"></ion-input>\n\n      </ion-item>\n\n      <ion-item *ngIf="descricaoVazia">\n\n        <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n        <p class="erro">Digite a descrição.</p>\n\n      </ion-item>\n\n  \n\n  \n\n    </ion-card>\n\n  \n\n    <ion-fab bottom right>\n\n      <button ion-fab (click)="editaDivida(divida)" color="corDivida">\n\n        <ion-icon name="checkmark"></ion-icon>\n\n      </button>\n\n    </ion-fab>\n\n  \n\n  </ion-content>\n\n  '/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/edita-divida/edita-divida.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__providers_divida_service_divida_service__["a" /* DividaServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */]])
    ], EditaDividaPage);
    return EditaDividaPage;
}());

//# sourceMappingURL=edita-divida.js.map

/***/ }),

/***/ 225:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditaEmprestimoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_divida_service_divida_service__ = __webpack_require__(46);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var EditaEmprestimoPage = /** @class */ (function () {
    function EditaEmprestimoPage(navCtrl, navParams, toastController, emprestimoService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastController = toastController;
        this.emprestimoService = emprestimoService;
        this.emprestimo = {};
        this.nomeVazio = false;
        this.valorInvalido = false;
        this.valorVazio = false;
        this.dataVazia = false;
        this.descricaoVazia = false;
        this.emprestimo = this.navParams.data;
    }
    EditaEmprestimoPage.prototype.ionViewDidEnter = function () {
        this.navParams.data.valor = this.emprestimoService.formataValor(this.emprestimo.valor);
    };
    EditaEmprestimoPage.prototype.abrirToast = function (text) {
        var toast = this.toastController.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    };
    EditaEmprestimoPage.prototype.editaEmprestimo = function () {
        if (!this.confirmaDados()) {
            this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
        }
        else {
            this.atualizaEmprestimoFB();
        }
    };
    EditaEmprestimoPage.prototype.atualizaEmprestimoFB = function () {
        var _this = this;
        this.emprestimoService.editaDividaEmprestimoFB(this.emprestimo).then(function (_) {
            _this.navCtrl.pop();
            _this.abrirToast("Empréstimo editado.");
        }).catch(function (err) {
            _this.abrirToast("Ops... Ocorreu algum erro!");
        });
    };
    EditaEmprestimoPage.prototype.confirmaDados = function () {
        this.nomeVazio = this.emprestimo.nomeUsuarioDevedor == "" || this.emprestimo.nomeUsuarioDevedor == null;
        this.valorInvalido = this.emprestimo.valor <= 0;
        this.valorVazio = this.emprestimo.valor == null;
        this.dataVazia = this.emprestimo.data == null;
        this.descricaoVazia = this.emprestimo.descricao == "" || this.emprestimo.descricao == null;
        return !this.valorInvalido && !this.nomeVazio && !this.valorVazio &&
            !this.dataVazia && !this.descricaoVazia;
    };
    EditaEmprestimoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-edita-emprestimo',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/edita-emprestimo/edita-emprestimo.html"*/'<ion-header>\n\n  <ion-navbar color="corEmprestimo">\n\n    <ion-title>Editar empréstimo para {{emprestimo.nomeUsuarioDevedor}}</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content class="cor-background">\n\n  <ion-card>\n\n    <ion-card-header color="corEmprestimo">\n\n      Informações\n\n    </ion-card-header>\n\n    <ion-item>\n\n      <ion-icon name=\'cash\' item-start color="corEmprestimo"></ion-icon>\n\n      <ion-input type="text" name="money" placeholder="Valor" [brmasker]="{money: true, thousand: \'.\',  decimalCaracter: \',\', len:11}" [(ngModel)]="emprestimo.valor"></ion-input>\n\n    </ion-item>\n\n    <ion-item *ngIf="valorInvalido">\n\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n      <p class="erro">O valor deverá ser maior que zero.</p>\n\n    </ion-item>\n\n    <ion-item *ngIf="valorVazio">\n\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n      <p class="erro">Digite o valor.</p>\n\n    </ion-item>\n\n\n\n    <ion-item>\n\n      <ion-icon name=\'calendar\' item-start color="corEmprestimo"></ion-icon>\n\n      <ion-datetime placeholder="Data" cancelText="Cancelar" doneText="Ok" min="2017" max="2020" displayFormat="DD/MM/YYYY" [(ngModel)]="emprestimo.data"></ion-datetime>\n\n    </ion-item>\n\n    <ion-item *ngIf="dataVazia">\n\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n      <p class="erro">Selecione a data.</p>\n\n    </ion-item>\n\n\n\n    <ion-item>\n\n      <ion-icon name=\'clipboard\' item-start color="corEmprestimo"></ion-icon>\n\n      <ion-input type="text" [(ngModel)]="emprestimo.descricao" placeholder="Descrição"></ion-input>\n\n    </ion-item>\n\n    <ion-item *ngIf="descricaoVazia">\n\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n\n      <p class="erro">Digite a descrição.</p>\n\n    </ion-item>\n\n\n\n  </ion-card>\n\n\n\n  <ion-fab bottom right>\n\n    <button ion-fab (click)="editaEmprestimo(emprestimo)" color="corEmprestimo">\n\n      <ion-icon name="checkmark"></ion-icon>\n\n    </button>\n\n  </ion-fab>\n\n\n\n</ion-content>\n\n'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/edita-emprestimo/edita-emprestimo.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_divida_service_divida_service__["a" /* DividaServiceProvider */]])
    ], EditaEmprestimoPage);
    return EditaEmprestimoPage;
}());

//# sourceMappingURL=edita-emprestimo.js.map

/***/ }),

/***/ 226:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditaFinancaPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_financa_service_financa_service__ = __webpack_require__(49);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var EditaFinancaPage = /** @class */ (function () {
    function EditaFinancaPage(navCtrl, navParams, toastCtrl, statusBar, authService, alertCtrl, financaService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.statusBar = statusBar;
        this.authService = authService;
        this.alertCtrl = alertCtrl;
        this.financaService = financaService;
        this.financa = {};
        this.tipoFinanca = "";
        this.valorInvalido = false;
        this.valorVazio = false;
        this.descricaoVazia = false;
        this.dataVazia = false;
        this.categoriaVazia = false;
        this.tipoVazio = false;
        this.financa = this.navParams.data;
        this.tipoFinanca = this.financa.ehDebito == true ? "debito" : "credito";
    }
    EditaFinancaPage.prototype.ionViewDidEnter = function () {
        this.navParams.data.valor = this.financaService.formataValor(this.financa.valor);
    };
    EditaFinancaPage.prototype.abrirToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    };
    EditaFinancaPage.prototype.editaFinanca = function () {
        var _this = this;
        if (!this.confirmaDados()) {
            this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
        }
        else {
            if (this.tipoFinanca === "debito") {
                this.financa = __assign({}, this.financa, { ehDebito: true });
            }
            else {
                this.financa = __assign({}, this.financa, { ehDebito: false });
            }
            this.financaService.editaFinancaFB(this.financa)
                .then(function (_) {
                _this.navCtrl.pop();
            });
        }
    };
    EditaFinancaPage.prototype.confirmaDados = function () {
        this.valorInvalido = this.financa.valor <= 0;
        this.valorVazio = this.financa.valor == null;
        this.dataVazia = this.financa.data == null;
        this.categoriaVazia = this.financa.categoria == null;
        this.descricaoVazia = this.financa.descricao == "" || this.financa.descricao == null;
        this.tipoVazio = this.tipoFinanca == "" || this.tipoFinanca == null;
        return !this.valorInvalido && !this.valorVazio &&
            !this.dataVazia && !this.descricaoVazia &&
            !this.categoriaVazia && !this.tipoVazio;
    };
    EditaFinancaPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-edita-financa',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/edita-financa/edita-financa.html"*/'<ion-header>\n  <ion-navbar color="corPrimaria">\n    <ion-title>Editar finança</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content class="cor-background">\n    <ion-card>\n        <ion-card-header color="corPrimaria">\n          Tipo da finança\n        </ion-card-header>\n        <ion-list radio-group [(ngModel)]="tipoFinanca">\n            <ion-item>\n              <ion-icon name=\'pricetags\' item-start color="corPrimaria"></ion-icon>\n              <ion-label>Débito</ion-label>\n              <ion-radio value="debito"></ion-radio>\n            </ion-item>\n            <ion-item>\n              <ion-icon name=\'cash\' item-start color="corPrimaria"></ion-icon>\n              <ion-label>Crédito</ion-label>\n              <ion-radio value="credito"></ion-radio>\n            </ion-item>\n          </ion-list>\n    </ion-card>\n        \n  <ion-card>\n    <ion-card-header color="corPrimaria">\n      Informações\n    </ion-card-header>\n    <ion-item>\n      <ion-icon name=\'clipboard\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" [(ngModel)]="financa.descricao" placeholder="Descrição"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="descricaoVazia">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite a descrição.</p>\n    </ion-item>\n\n    <ion-item>\n      <ion-icon name=\'cash\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" name="money" placeholder="Valor" \n        [brmasker]="{money: true, thousand: \'.\',  decimalCaracter: \',\', len: 11}" \n        [(ngModel)]="financa.valor"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="valorInvalido">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">O valor deverá ser maior que zero.</p>\n    </ion-item>\n    <ion-item *ngIf="valorVazio">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite o valor.</p>\n    </ion-item>\n\n    <ion-item>\n      <ion-icon name=\'calendar\' item-start color="corPrimaria"></ion-icon>\n      <ion-datetime placeholder="Data" cancelText="Cancelar" doneText="Ok"\n        min="2017" max="2020" displayFormat="DD/MM/YYYY" [(ngModel)]="financa.data">\n      </ion-datetime>\n    </ion-item>\n    <ion-item *ngIf="dataVazia">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Selecione a data.</p>\n    </ion-item>\n\n    <ion-list>\n      <ion-item>\n        <ion-icon name="list-box" color="corPrimaria" item-start></ion-icon>\n        <ion-select interface="popover" placeholder="Categoria" [(ngModel)]="financa.categoria">\n          <ion-option value="alimentacao">Alimentação</ion-option>\n          <ion-option value="vestuario">Vestuário</ion-option>\n          <ion-option value="entretenimento">Entretenimento</ion-option>\n          <ion-option value="bebida">Bebida</ion-option>\n          <ion-option value="supermercado">Supermercado</ion-option>\n          <ion-option value="transporte">Transporte</ion-option>\n          <ion-option value="eletronicos">Eletrônicos</ion-option>\n          <ion-option value="outros">Outros</ion-option>\n        </ion-select>\n      </ion-item>\n    </ion-list>\n  </ion-card>\n\n  <ion-fab bottom right>\n    <button ion-fab (click)="editaFinanca()" color="corPrimaria">\n      <ion-icon name="checkmark"></ion-icon>\n    </button>\n  </ion-fab>\n\n</ion-content>'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/edita-financa/edita-financa.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_3__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_financa_service_financa_service__["a" /* FinancaServiceProvider */]])
    ], EditaFinancaPage);
    return EditaFinancaPage;
}());

//# sourceMappingURL=edita-financa.js.map

/***/ }),

/***/ 227:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditaMetaPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_meta_service_meta_service__ = __webpack_require__(98);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the EditaMetaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var EditaMetaPage = /** @class */ (function () {
    function EditaMetaPage(navCtrl, navParams, toastCtrl, authService, metaService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.authService = authService;
        this.metaService = metaService;
        this.meta = {};
        //booleans de verificação
        this.limiteInvalido = false;
        this.limiteVazio = false;
        this.categoriaVazia = false;
        this.meta = this.navParams.data;
    }
    EditaMetaPage.prototype.ionViewDidLoad = function () {
        this.navParams.data.limite = this.metaService.formataValor(this.meta.limite);
    };
    EditaMetaPage.prototype.abrirToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    };
    EditaMetaPage.prototype.editaMeta = function () {
        var _this = this;
        // TODO: remover depois de adicionar os campos
        // categoria e ehDebito ao form de criação de financas
        if (!this.confirmaDados()) {
            this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
        }
        else {
            this.metaService.editaMetaFB(this.meta)
                .then(function (_) {
                _this.navCtrl.pop();
            });
        }
    };
    EditaMetaPage.prototype.confirmaDados = function () {
        this.limiteInvalido = this.meta.limite <= 0;
        this.limiteVazio = this.meta.limite == null;
        this.categoriaVazia = this.meta.categoria == null;
        return !this.limiteInvalido && !this.limiteVazio &&
            !this.categoriaVazia;
    };
    EditaMetaPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-edita-meta',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/edita-meta/edita-meta.html"*/'<ion-header>\n  <ion-navbar color="corMeta">\n    <ion-title>Editar meta</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content class="cor-background">\n  <ion-card>\n    <ion-card-header color="corMeta">\n      Informações\n    </ion-card-header>\n\n    <ion-list>\n      <ion-item>\n        <ion-icon name="list-box" color="corMeta" item-start></ion-icon>\n        <ion-select placeholder="Categoria" [(ngModel)]="meta.categoria">\n          <ion-option value="alimentacao">Alimentação</ion-option>\n          <ion-option value="vestuario">Vestuário</ion-option>\n          <ion-option value="entretenimento">Entretenimento</ion-option>\n          <ion-option value="bebida">Bebida</ion-option>\n          <ion-option value="supermercado">Supermercado</ion-option>\n          <ion-option value="transporte">Transporte</ion-option>\n          <ion-option value="eletronicos">Eletrônicos</ion-option>\n          <ion-option value="outros">Outros</ion-option>\n        </ion-select>\n      </ion-item>\n    </ion-list>\n\n    <ion-item>\n      <ion-icon name=\'cash\' item-start color="corMeta"></ion-icon>\n      <ion-input type="text" name="money" placeholder="Limite de gasto" \n      [brmasker]="{money: true, thousand: \'.\',  decimalCaracter: \',\', len: 11}" \n      [(ngModel)]="meta.limite"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="limiteInvalido">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">O limite deverá ser maior que zero.</p>\n    </ion-item>\n    <ion-item *ngIf="limiteVazio">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite o limite.</p>\n    </ion-item>\n\n  </ion-card>\n\n  <ion-fab bottom right>\n    <button ion-fab (click)="editaMeta()" color="corMeta">\n      <ion-icon name="checkmark"></ion-icon>\n    </button>\n  </ion-fab>\n\n</ion-content>'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/edita-meta/edita-meta.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_3__providers_meta_service_meta_service__["a" /* MetaServiceProvider */]])
    ], EditaMetaPage);
    return EditaMetaPage;
}());

//# sourceMappingURL=edita-meta.js.map

/***/ }),

/***/ 228:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditaPagamentoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_pagamento_service_pagamento_service__ = __webpack_require__(121);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Generated class for the EditaPagamentoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var EditaPagamentoPage = /** @class */ (function () {
    function EditaPagamentoPage(navCtrl, navParams, toastCtrl, statusBar, authService, alertCtrl, pagamentoService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.statusBar = statusBar;
        this.authService = authService;
        this.alertCtrl = alertCtrl;
        this.pagamentoService = pagamentoService;
        this.pagamento = {};
        this.valorInvalido = false;
        this.valorVazio = false;
        this.descricaoVazia = false;
        this.nomeVazio = false;
        this.dataVazia = false;
        this.pagamento = this.navParams.data;
    }
    EditaPagamentoPage.prototype.ionViewDidLoad = function () {
        this.navParams.data.valor = this.pagamentoService.formataValor(this.pagamento.valor);
    };
    EditaPagamentoPage.prototype.abrirToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    };
    EditaPagamentoPage.prototype.editaPagamento = function () {
        var _this = this;
        if (!this.confirmaDados()) {
            this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
        }
        else {
            this.pagamentoService.editaPagamentoFB(this.pagamento)
                .then(function (_) {
                _this.navCtrl.pop();
                _this.abrirToast("Pagamento editado.");
            });
        }
    };
    EditaPagamentoPage.prototype.confirmaDados = function () {
        this.valorInvalido = this.pagamento.valor <= 0;
        this.valorVazio = this.pagamento.valor == null;
        this.dataVazia = this.pagamento.data == null;
        this.descricaoVazia = this.pagamento.descricao == "" || this.pagamento.descricao == null;
        this.nomeVazio = this.pagamento.nomeDoFiador == "" || this.pagamento.nomeDoFiador == null;
        return !this.valorInvalido && !this.valorVazio && !this.dataVazia && !this.descricaoVazia && !this.nomeVazio;
    };
    EditaPagamentoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-edita-pagamento',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/edita-pagamento/edita-pagamento.html"*/'<ion-header>\n    <ion-navbar color="corPrimaria">\n      <ion-title>Editar Pagamento</ion-title>\n    </ion-navbar>\n  </ion-header>\n  \n  \n  <ion-content class="cor-background">      \n    <ion-card>\n      <ion-card-header color="corPrimaria">\n        Informações\n      </ion-card-header>\n\n      <ion-item>\n          <ion-icon name=\'person\' item-start color="corPrimaria"></ion-icon>\n          <ion-input type="text" [(ngModel)]="pagamento.nomeDoFiador" placeholder="Nome do fiador"></ion-input>\n        </ion-item>\n        <ion-item *ngIf="nomeVazio">\n          <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n          <p class="erro">Digite o nome do fiador.</p>\n        </ion-item>\n\n      <ion-item>\n        <ion-icon name=\'clipboard\' item-start color="corPrimaria"></ion-icon>\n        <ion-input type="text" [(ngModel)]="pagamento.descricao" placeholder="Descrição"></ion-input>\n      </ion-item>\n      <ion-item *ngIf="descricaoVazia">\n        <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n        <p class="erro">Digite a descrição.</p>\n      </ion-item>\n  \n      <ion-item>\n        <ion-icon name=\'cash\' item-start color="corPrimaria"></ion-icon>\n        <ion-input type="text" name="money" placeholder="Valor" \n          [brmasker]="{money: true, thousand: \'.\',  decimalCaracter: \',\', len: 11}" \n          [(ngModel)]="pagamento.valor"></ion-input>\n      </ion-item>\n      <ion-item *ngIf="valorInvalido">\n        <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n        <p class="erro">O valor deverá ser maior que zero.</p>\n      </ion-item>\n      <ion-item *ngIf="valorVazio">\n        <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n        <p class="erro">Digite o valor.</p>\n      </ion-item>\n  \n      <ion-item>\n        <ion-icon name=\'calendar\' item-start color="corPrimaria"></ion-icon>\n        <ion-datetime placeholder="Data" cancelText="Cancelar" doneText="Ok"\n          min="2017" max="2020" displayFormat="DD/MM/YYYY" [(ngModel)]="pagamento.data">\n        </ion-datetime>\n      </ion-item>\n      <ion-item *ngIf="dataVazia">\n        <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n        <p class="erro">Selecione a data.</p>\n      </ion-item>\n      </ion-card>\n  \n    <ion-fab bottom right>\n      <button ion-fab (click)="editaPagamento()" color="corPrimaria">\n        <ion-icon name="checkmark"></ion-icon>\n      </button>\n    </ion-fab>\n  \n  </ion-content>'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/edita-pagamento/edita-pagamento.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_3__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_pagamento_service_pagamento_service__["a" /* PagamentoServiceProvider */]])
    ], EditaPagamentoPage);
    return EditaPagamentoPage;
}());

//# sourceMappingURL=edita-pagamento.js.map

/***/ }),

/***/ 229:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditaPerfilPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * Generated class for the EditaPerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var EditaPerfilPage = /** @class */ (function () {
    function EditaPerfilPage(navCtrl, authProvider, navParams, actionSheetCtrl, toastController) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.authProvider = authProvider;
        this.navParams = navParams;
        this.actionSheetCtrl = actionSheetCtrl;
        this.toastController = toastController;
        this.usuario = {};
        this.nomeVazio = false;
        authProvider.getUsuario().subscribe(function (res) {
            _this.usuario = res;
        });
    }
    EditaPerfilPage.prototype.ionViewDidLoad = function () { };
    EditaPerfilPage.prototype.ionViewWillEnter = function () {
        this.fotosrc = this.navParams.data;
    };
    EditaPerfilPage.prototype.editaUsuario = function (usuario) {
        var _this = this;
        if (!this.confirmaDados()) {
            this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
        }
        else if (this.usuario.salario < 0) {
            this.abrirToast("Ops! O salário não pode ser negativo.");
        }
        else {
            this.abrirToast("Salvando...");
            this.authProvider.salvarInformacoesUsuario(this.usuario.nome, this.usuario.profissao, this.usuario.salario).then(function (result) {
                _this.navCtrl.pop();
                _this.abrirToast("Dados salvos.");
            });
        }
    };
    EditaPerfilPage.prototype.retornaFoto = function () {
        this.authProvider.getGravatarUsuario(this.usuario.email, "https://cdn.pbrd.co/images/HwxHoFO.png");
    };
    EditaPerfilPage.prototype.confirmaDados = function () {
        this.nomeVazio = this.usuario.nome == "" || this.usuario.nome == null;
        return !this.nomeVazio;
    };
    EditaPerfilPage.prototype.abrirToast = function (text) {
        var toast = this.toastController.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    };
    EditaPerfilPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-edita-perfil',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/edita-perfil/edita-perfil.html"*/'<ion-header>\n  <ion-navbar color="corPrimaria">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Editar Perfil</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content class="cor-background">\n  <ion-grid>\n    <ion-row>\n      <ion-col>\n      </ion-col>\n      <ion-col col-9 text-center>\n        <img class="image_circle" [src]="fotosrc">\n    </ion-col>\n      <ion-col>\n      </ion-col>\n    </ion-row>\n  </ion-grid>\n\n    <br>\n    <br>\n  <ion-item>\n    <ion-icon name=\'person\' item-start color="green"></ion-icon>\n    <ion-input type="text" [(ngModel)]="usuario.nome" placeholder="Nome"></ion-input>\n  </ion-item>\n  <ion-item *ngIf="nomeVazio">\n    <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n    <p class="erro">Digite o seu novo nome.</p>\n  </ion-item>\n  <ion-item>\n      <ion-icon name=\'briefcase\' item-start color="green"></ion-icon>\n      <ion-input type="text" [(ngModel)]="usuario.profissao" placeholder="Profissão"></ion-input>\n  </ion-item>\n  <ion-item>\n      <ion-icon name=\'logo-usd\' item-start color="green"></ion-icon>\n      <ion-input type="text" name="money" placeholder="Salário" [brmasker]="{money: true, thousand: \'.\',  decimalCaracter: \',\', len: 11}" [(ngModel)]="usuario.salario"></ion-input>\n  </ion-item>\n\n\n  <ion-fab bottom right>\n    <button ion-fab (click)="editaUsuario(usuario)" color="corPrimaria">\n      <ion-icon name="checkmark"></ion-icon>\n    </button>\n  </ion-fab>\n\n</ion-content>'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/edita-perfil/edita-perfil.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */]])
    ], EditaPerfilPage);
    return EditaPerfilPage;
}());

//# sourceMappingURL=edita-perfil.js.map

/***/ }),

/***/ 230:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FinancasChartsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_financa_service_financa_service__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_VerificacaoEnum__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_auth_auth__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var FinancasChartsPage = /** @class */ (function () {
    function FinancasChartsPage(navCtrl, navParams, FinancaService, authService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.FinancaService = FinancaService;
        this.authService = authService;
        this.usuario = {};
        this.financas = [];
        this.mostrarGrafico = false;
        this.doughnutData = [];
        this.doughnutOptions = {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Gastos por Categoria (R$)'
            }
        };
        this.barChartData = [];
        this.barChartLabels = [
            'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
            'jul', 'ago', 'set', 'out', 'nov', 'dez'
        ];
        this.barOptions = {
            legend: {
                display: true
            },
            title: {
                display: true,
                text: 'Resumo Mensal (R$)'
            }
        };
        this.doughnutCategorias = [];
        this.categoriasMap = {
            "alimentacao": "Alimentação",
            "vestuario": "Vestuário",
            "entretenimento": "Entretenimento",
            "bebida": "Bebida",
            "supermercado": "Supermercado",
            "transporte": "Transporte",
            "eletronicos": "Eletrônicos",
            "outros": "Outros"
        };
        authService.getUsuario().subscribe(function (res) {
            _this.usuario = res;
        });
    }
    FinancasChartsPage.prototype.ionViewDidLoad = function () {
        this.carregaFinancas();
    };
    FinancasChartsPage.prototype.carregaFinancas = function () {
        var _this = this;
        this.FinancaService.getFinancaListRef().valueChanges().subscribe(function (financas) {
            _this.financas = _this.filtraFinancasConfirmadas(financas);
            _this.gerarDadosDoughnut();
            _this.gerarDadosBar();
            _this.mostrarGrafico = true;
        });
    };
    FinancasChartsPage.prototype.filtraFinancasConfirmadas = function (lista) {
        return lista.filter(function (x) { return x.verificacao === __WEBPACK_IMPORTED_MODULE_3__models_VerificacaoEnum__["a" /* Verificacao */].Confirmado; });
    };
    FinancasChartsPage.prototype.gerarDadosDoughnut = function () {
        var _this = this;
        var gastosCategoria = this.valoresPorCategoria();
        var keysCategorias = Object.keys(this.categoriasMap);
        this.doughnutData = keysCategorias.map(function (cat) { return gastosCategoria[cat] || 0.0; });
        this.doughnutCategorias = keysCategorias.map(function (key) { return _this.categoriasMap[key]; });
    };
    FinancasChartsPage.prototype.valoresPorCategoria = function () {
        var valorCategoria = {};
        this.financas
            .filter(function (f) { return f.ehDebito; })
            .map(function (f) {
            if (valorCategoria[f.categoria]) {
                valorCategoria[f.categoria] += f.valor;
            }
            else {
                valorCategoria[f.categoria] = f.valor;
            }
        });
        return valorCategoria;
    };
    FinancasChartsPage.prototype.gerarDadosBar = function () {
        var debPorMes = (new Array(12)).fill(0);
        var credPorMes = (new Array(12)).fill(0);
        this.financas.map(function (f) {
            var finDate = new Date(f.data);
            var mes = finDate.getMonth();
            if (f.ehDebito) {
                debPorMes[mes] += f.valor;
            }
            else {
                credPorMes[mes] += f.valor;
            }
        });
        this.barChartData = [
            { data: debPorMes, label: 'Débito' },
            { data: credPorMes, label: 'Crédito' }
        ];
    };
    FinancasChartsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-financas-charts',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/financas-charts/financas-charts.html"*/'<ion-header>\n  <ion-navbar color="corPrimaria">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Estatísticas</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content class="cor-background">\n      <ion-item class="cor-background">\n          <p text-center style="font-size:  2rem;font-weight: 500;">Bem vindo de volta, {{ usuario.nome }}!</p>\n        </ion-item>\n\n        <ion-card *ngIf="mostrarGrafico">\n            <ion-card-header color="corPrimaria">\n              Gastos mensais\n            </ion-card-header>\n              <ion-item>\n                  <canvas baseChart \n                  [data]="doughnutData"\n                  [labels]="doughnutCategorias"\n                  [options]="doughnutOptions"\n                  chartType="doughnut"></canvas>\n                  </ion-item>\n          </ion-card>\n\n          <ion-card *ngIf="mostrarGrafico">\n              <ion-card-header color="corPrimaria">\n                Débitos e créditos por mês\n              </ion-card-header>\n                <ion-item>\n                    <canvas baseChart\n                    height="200px"\n                    [datasets]="barChartData"\n                    [labels]="barChartLabels"\n                    [options]="barOptions"\n                    chartType="bar"></canvas>\n                    </ion-item>\n            </ion-card>\n\n</ion-content>\n'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/financas-charts/financas-charts.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__providers_financa_service_financa_service__["a" /* FinancaServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_4__providers_auth_auth__["a" /* AuthProvider */]])
    ], FinancasChartsPage);
    return FinancasChartsPage;
}());

//# sourceMappingURL=financas-charts.js.map

/***/ }),

/***/ 231:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FinancasPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__adiciona_financa_adiciona_financa__ = __webpack_require__(218);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__edita_financa_edita_financa__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_financa_service_financa_service__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__adiciona_meta_adiciona_meta__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_meta_service_meta_service__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__edita_meta_edita_meta__ = __webpack_require__(227);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__models_VerificacaoEnum__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_operators__ = __webpack_require__(17);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var FinancasPage = /** @class */ (function () {
    function FinancasPage(navCtrl, navParams, financaService, metaService, authService, alertCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.financaService = financaService;
        this.metaService = metaService;
        this.authService = authService;
        this.alertCtrl = alertCtrl;
        this.financas = [];
        this.financasPendentes = [];
        this.metas = [];
        // Mês Atual
        this.hoje = new Date();
        this.mesAtual = this.hoje.getMonth() + 1;
        // Mostrar financas mensal ou geral
        this.selecionouFinancasGerais = false;
        this.carregaFinancasFB();
        this.carregaMetasFB();
    }
    FinancasPage.prototype.ionViewWillEnter = function () {
        this.carregaFinancasFB();
        this.carregaMetasFB();
    };
    FinancasPage.prototype.carregaFinancasFB = function () {
        var _this = this;
        this.financaService.getFinancaListRef().snapshotChanges()
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_10_rxjs_operators__["map"])(function (actions) { return actions.map(function (a) {
            var data = a.payload.val();
            return __assign({ key: a.key }, data);
        }); })).subscribe(function (financas) {
            financas = financas;
            _this.financas = _this.filtraFinancasConfirmadas(financas);
            _this.financasPendentes = _this.filtraFinancasPendentes(financas);
        });
    };
    FinancasPage.prototype.filtraFinancasPendentes = function (lista) {
        return lista.filter(function (x) { return x.verificacao === __WEBPACK_IMPORTED_MODULE_8__models_VerificacaoEnum__["a" /* Verificacao */].Pendente; });
    };
    FinancasPage.prototype.filtraFinancasConfirmadas = function (lista) {
        return this.filtraFinancas(lista.filter(function (x) { return x.verificacao === __WEBPACK_IMPORTED_MODULE_8__models_VerificacaoEnum__["a" /* Verificacao */].Confirmado; }));
    };
    FinancasPage.prototype.carregaMetasFB = function () {
        var _this = this;
        this.metaService.recebeMetasFB()
            .then(function (metas) {
            _this.metas = metas || [];
        });
    };
    FinancasPage.prototype.modalAdicionaFinanca = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__adiciona_financa_adiciona_financa__["a" /* AdicionaFinancaPage */]);
    };
    FinancasPage.prototype.modalAdicionaMeta = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__adiciona_meta_adiciona_meta__["a" /* AdicionaMetaPage */]);
    };
    FinancasPage.prototype.modalEditaFinanca = function (financa) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__edita_financa_edita_financa__["a" /* EditaFinancaPage */], financa);
    };
    FinancasPage.prototype.modalEditaMeta = function (meta) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__edita_meta_edita_meta__["a" /* EditaMetaPage */], meta);
    };
    FinancasPage.prototype.removeFinanca = function (financa) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: "Excluir finança",
            message: "Você tem certeza que deseja excluir esta finança?"
                + "\n\n" + "Todas as informações serão deletadas.",
            buttons: [{
                    text: 'Cancelar',
                    handler: function () { }
                },
                {
                    text: 'Excluir',
                    handler: function () {
                        _this.financaService.removeFinancaFB(financa)
                            .then(function (_) {
                            _this.financas = _this.financas.filter(function (fin) { return fin.key !== financa.key; });
                            _this.metaService.debitaFinanca(financa);
                        });
                    }
                }
            ]
        });
        alert.present();
    };
    FinancasPage.prototype.removeMeta = function (meta) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: "Excluir meta",
            message: "Você tem certeza que deseja excluir esta meta?"
                + "\n\n" + "Todas as informações serão deletadas.",
            buttons: [{
                    text: 'Cancelar',
                    handler: function () { }
                },
                {
                    text: 'Excluir',
                    handler: function () {
                        _this.metaService.removeMetaFB(meta)
                            .then(function (_) {
                            _this.metas = _this.metas
                                .filter(function (met) { return met.key !== meta.key; });
                        });
                    }
                }
            ]
        });
        alert.present();
    };
    FinancasPage.prototype.existeFinanca = function () {
        return this.financas.length > 0;
    };
    FinancasPage.prototype.existeMeta = function () {
        return this.metas.length > 0;
    };
    FinancasPage.prototype.existeFinancaPendente = function () {
        return this.financasPendentes.length > 0;
    };
    FinancasPage.prototype.retornaSomaCredito = function (lista) {
        var soma = 0.0;
        for (var i = 0; i < lista.length; i++) {
            if (lista[i].ehDebito == false) {
                soma += +lista[i].valor;
            }
        }
        return this.formataValor(soma);
    };
    FinancasPage.prototype.retornaSomaDebito = function (lista) {
        var soma = 0.0;
        for (var i = 0; i < lista.length; i++) {
            if (lista[i].ehDebito == true) {
                soma += +lista[i].valor;
            }
        }
        return this.formataValor(soma);
    };
    FinancasPage.prototype.formataValor = function (valor) {
        return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
    };
    FinancasPage.prototype.retornaCategoria = function (cat) {
        var categoria = {
            "alimentacao": "Alimentação",
            "vestuario": "Vestuário",
            "entretenimento": "Entretenimento",
            "bebida": "Bebida",
            "supermercado": "Supermercado",
            "transporte": "Transporte",
            "eletronicos": "Eletrônicos",
            "outros": "Outros"
        };
        return categoria[cat];
    };
    FinancasPage.prototype.getIcon = function (categoria) {
        switch (categoria) {
            case "alimentacao": return "pizza";
            case "vestuario": return "shirt";
            case "entretenimento": return "football";
            case "bebida": return "beer";
            case "supermercado": return "cart";
            case "transporte": return "car";
            case "eletronicos": return "phone-portrait";
            case "outros": return "grid";
            default: return 'cash';
        }
    };
    FinancasPage.prototype.createItemCardBtn = function (icon, color, title, action) {
        return { icon: icon, color: color, title: title, action: action };
    };
    FinancasPage.prototype.getFinancaBtns = function (financa) {
        var _this = this;
        var showEditBtn = !(financa.categoria == 'Dívida' || financa.categoria == 'Empréstimo');
        var deleteBtn = this.createItemCardBtn('trash', 'corDivida', 'Excluir', function () { return _this.removeFinanca(financa); });
        var editBtn = this.createItemCardBtn('create', 'corEmprestimo', 'Editar', function () { return _this.modalEditaFinanca(financa); });
        return showEditBtn ? [deleteBtn, editBtn] : [deleteBtn];
    };
    FinancasPage.prototype.getFinancaPendBtns = function (financa) {
        var _this = this;
        var rejectBtn = this.createItemCardBtn('close', 'corDivida', 'Rejeitar', function () { return _this.rejeitaFinanca(financa); });
        var acceptBtn = this.createItemCardBtn('checkmark', 'corPrimaria', 'Aceitar', function () { return _this.aceitaFinanca(financa); });
        return this.podeAnalisarFinanca(financa) ? [rejectBtn, acceptBtn] : [];
    };
    FinancasPage.prototype.getMetaBtns = function (meta) {
        var _this = this;
        var deleteBtn = this.createItemCardBtn('trash', 'corDivida', 'Excluir', function () { return _this.removeMeta(meta); });
        var editBtn = this.createItemCardBtn('create', 'corEmprestimo', 'Editar', function () { return _this.modalEditaMeta(meta); });
        return [deleteBtn, editBtn];
    };
    FinancasPage.prototype.getMetaProgressClass = function (meta) {
        if (this.retornaPorcentagemMeta(meta) <= 30) {
            return "financaCredito";
        }
        else if (this.retornaPorcentagemMeta(meta) <= 80) {
            return "classeMeta";
        }
        else {
            return "financaDebito";
        }
    };
    FinancasPage.prototype.getTextoData = function (financa) {
        var options = { weekday: "long", month: 'long', day: '2-digit' };
        var dataSeparada = financa.data.toString().split("-");
        var ano = Number(dataSeparada[0]);
        var mes = Number(dataSeparada[1]) - 1;
        var dia = Number(dataSeparada[2]);
        var dataAjustada = new Date(ano, mes, dia);
        return dataAjustada.toLocaleDateString("pt-br", options);
    };
    FinancasPage.prototype.filtraFinancas = function (financas) {
        if (this.selecionouFinancasGerais) {
            return financas;
        }
        else {
            var financasFiltradas = [];
            for (var i = 0; i < financas.length; i++) {
                var dataFinancaAtual = new Date(financas[i].data);
                if (dataFinancaAtual.getMonth() == this.mesAtual - 1) {
                    financasFiltradas.push(financas[i]);
                }
            }
            return financasFiltradas;
        }
    };
    FinancasPage.prototype.financasGerais = function (resposta) {
        if (resposta == "sim") {
            this.selecionouFinancasGerais = true;
            this.ionViewWillEnter();
        }
        else {
            this.selecionouFinancasGerais = false;
            this.ionViewWillEnter();
        }
    };
    FinancasPage.prototype.retornaNomeMes = function () {
        switch (this.mesAtual) {
            case 1: return "janeiro";
            case 2: return "fevereiro";
            case 3: return "março";
            case 4: return "abril";
            case 5: return "maio";
            case 6: return "junho";
            case 7: return "julho";
            case 8: return "agosto";
            case 9: return "setembro";
            case 10: return "outubro";
            case 11: return "novembro";
            default: return "dezembro";
        }
    };
    FinancasPage.prototype.retornaPorcentagemMeta = function (meta) {
        return this.metaService.calcProgessoMeta(meta);
    };
    FinancasPage.prototype.retornaTotalMeta = function (meta) {
        return this.metaService.calcTotalMeta(meta);
    };
    FinancasPage.prototype.podeAnalisarFinanca = function (financa) {
        var criador;
        this.authService.getUsername().then(function (username) {
            criador = username;
        });
        return financa.usuarioCriador !== criador;
    };
    FinancasPage.prototype.aceitaFinanca = function (financa) {
        financa.verificacao = __WEBPACK_IMPORTED_MODULE_8__models_VerificacaoEnum__["a" /* Verificacao */].Confirmado;
        this.financaService.getFinancaListRef().update(financa.key, financa);
    };
    FinancasPage.prototype.rejeitaFinanca = function (financa) {
        financa.verificacao = __WEBPACK_IMPORTED_MODULE_8__models_VerificacaoEnum__["a" /* Verificacao */].Negado;
        this.removeFinanca(financa);
    };
    FinancasPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-financas',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/financas/financas.html"*/'<ion-header>\n  <ion-navbar color="corPrimaria">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Finanças</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content class="cor-background">\n\n  <button padding ion-button clear icon-start color="corPrimaria" *ngIf="selecionouFinancasGerais" (click)="financasGerais(\'nao\')">\n    <ion-icon color="corPrimaria" name="arrow-dropleft"></ion-icon>\n    Ver finanças do mês atual\n  </button>\n\n  <ion-list *ngIf="existeMeta()">\n    <ion-card>\n      <ion-card-header color="corMeta">\n        Suas metas\n      </ion-card-header>\n\n      <ion-list>\n        <item-card *ngFor="let meta of metas; trackBy: trackById"\n          icon="{{getIcon(meta.categoria)}}" iconColor="corPrimaria"\n          description="Limite de R$ {{formataValor(meta.limite)}}" \n          subtitle="{{retornaPorcentagemMeta(meta)}}% gasto"\n          subtitleClass="{{getMetaProgressClass(meta)}}"\n          secSubtitle="Total: R$ {{formataValor(retornaTotalMeta(meta))}}"\n          [btns]="getMetaBtns(meta)">\n        </item-card>\n      </ion-list>\n    </ion-card>\n  </ion-list>\n\n  <ion-list *ngIf="existeFinancaPendente()">\n    <ion-card>\n      <ion-card-header color="corMeta">\n        Finanças Pendentes\n      </ion-card-header>\n\n      <ion-list>\n        <item-card *ngFor="let financa of financasPendentes; trackBy: trackById"\n          icon="{{getIcon(financa.categoria)}}" iconColor="corPrimaria"\n          description="{{financa.descricao}}" \n          subtitle="R$ {{formataValor(financa.valor)}}"\n          subtitleClass="{{financa.ehDebito ? \'financaDebito\':\'financaCredito\'}}"\n          secSubtitle="{{getTextoData(financa)}}"\n          [btns]="getFinancaPendBtns(financa)">\n        </item-card>\n      </ion-list>\n    </ion-card>\n  </ion-list>\n\n  <ion-list *ngIf="!selecionouFinancasGerais">\n    <ion-card>\n      <ion-card-header color="corPrimaria" class="item-text-wrap">\n        Finanças de {{retornaNomeMes()}}\n        <p *ngIf="existeFinanca()" class="totalDebito">Total gasto: R$ {{retornaSomaDebito(financas)}}</p>\n        <p> <br> </p>\n        <p *ngIf="existeFinanca()" class="totalCredito">Total recebido: R$ {{retornaSomaCredito(financas)}}</p>\n      </ion-card-header>\n\n      <ion-item *ngIf="!existeFinanca()">\n        <p style="white-space: normal;" text-center>Não há nenhuma finança registrada.</p>\n      </ion-item>\n\n      <ion-list>\n        <item-card *ngFor="let financa of financas; trackBy: trackById"\n          icon="{{getIcon(financa.categoria)}}" iconColor="corPrimaria"\n          description="{{financa.descricao}}" \n          subtitle="R$ {{formataValor(financa.valor)}}"\n          subtitleClass="{{financa.ehDebito ? \'financaDebito\':\'financaCredito\'}}"\n          secSubtitle="{{getTextoData(financa)}}"\n          [btns]="getFinancaBtns(financa)">\n        </item-card>\n      </ion-list>\n    </ion-card>\n  </ion-list>\n\n  <ion-list *ngIf="selecionouFinancasGerais">\n    <ion-card>\n      <ion-card-header color="corPrimaria">\n        Finanças gerais\n        <p *ngIf="existeFinanca()" class="totalDebito">Total gasto: R$ {{retornaSomaDebito(financas)}}</p>\n        <p> </p>\n        <p *ngIf="existeFinanca()" class="totalCredito">Total recebido: R$ {{retornaSomaCredito(financas)}}</p>\n      </ion-card-header>\n\n      <ion-item *ngIf="!existeFinanca()">\n        <p style="white-space: normal;" text-center>Não há nenhuma finança registrada.</p>\n      </ion-item>\n      \n      <ion-list>\n        <item-card *ngFor="let financa of financas; trackBy: trackById"\n          icon="{{getIcon(financa.categoria)}}" iconColor="corPrimaria"\n          description="{{financa.descricao}}" \n          subtitle="R$ {{formataValor(financa.valor)}}"\n          subtitleClass="{{financa.ehDebito ? \'financaDebito\':\'financaCredito\'}}"\n          secSubtitle="{{getTextoData(financa)}}"\n          [btns]="getFinancaBtns(financa)">\n        </item-card>\n      </ion-list>\n    </ion-card>\n  </ion-list>\n\n  <button padding ion-button icon-right clear color="corPrimaria" *ngIf="!selecionouFinancasGerais" (click)="financasGerais(\'sim\')">\n    <ion-icon color="corPrimaria" name="arrow-down"></ion-icon>\n    Ver todas\n  </button>\n\n  <br>\n  <br>\n  <br>\n  <br>\n\n  <ion-fab bottom right #fab>\n    <button ion-fab color="corPrimaria">\n      <ion-icon name="add"></ion-icon>\n    </button>\n    <ion-fab-list side="top">\n      <button ion-fab (click)="modalAdicionaFinanca()" color="corPrimaria">\n        <ion-icon name="add" color="light"></ion-icon>\n        <ion-label>Registrar transação</ion-label>\n      </button>\n      <button ion-fab (click)="modalAdicionaMeta()" color="corMeta">\n        <ion-icon name="add" color="light"></ion-icon>\n        <ion-label>Adicionar meta de gastos</ion-label>\n      </button>\n    </ion-fab-list>\n\n  </ion-fab>\n\n</ion-content>'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/financas/financas.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_4__providers_financa_service_financa_service__["a" /* FinancaServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_6__providers_meta_service_meta_service__["a" /* MetaServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_9__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */]])
    ], FinancasPage);
    return FinancasPage;
}());

//# sourceMappingURL=financas.js.map

/***/ }),

/***/ 232:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PagamentosPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_pagamento_service_pagamento_service__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__edita_pagamento_edita_pagamento__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__adiciona_pagamento_adiciona_pagamento__ = __webpack_require__(220);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ionic_img_viewer__ = __webpack_require__(373);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_notification_notification__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__models_VerificacaoEnum__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_financa_service_financa_service__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__realiza_pagamento_realiza_pagamento__ = __webpack_require__(377);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











/**
 * Generated class for the PagamentosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var PagamentosPage = /** @class */ (function () {
    function PagamentosPage(navCtrl, navParams, alertCtrl, pagamentoService, auth, imageViewerCtrl, notificacao, authService, toastCtrl, financaService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.pagamentoService = pagamentoService;
        this.auth = auth;
        this.imageViewerCtrl = imageViewerCtrl;
        this.notificacao = notificacao;
        this.authService = authService;
        this.toastCtrl = toastCtrl;
        this.financaService = financaService;
        this.usuario = {};
        this.financa = {};
        this.pagamentos = [];
        this.hoje = new Date();
        authService.getUsuario().subscribe(function (res) {
            _this.usuario = res;
        });
    }
    PagamentosPage.prototype.ionViewWillEnter = function () {
        this.carregaPagamentosFB();
    };
    PagamentosPage.prototype.abreToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    };
    PagamentosPage.prototype.carregaPagamentosFB = function () {
        var _this = this;
        this.pagamentoService.recebePagamentosFB()
            .then(function (pagamentos) {
            _this.pagamentos = pagamentos;
            _this.verificaPagamentos();
        });
    };
    PagamentosPage.prototype.verificaPagamentos = function () {
        var _this = this;
        var proxDeVencer = this.pagamentos
            .filter(function (p) { return _this.venceHoje(new Date(p.data)); });
        this.notifica(proxDeVencer.length);
    };
    PagamentosPage.prototype.venceHoje = function (data) {
        var hoje = this.hoje.toISOString().slice(0, 10);
        var prazo = data.toISOString().slice(0, 10);
        return hoje === prazo;
    };
    PagamentosPage.prototype.notifica = function (pagamentos) {
        var _this = this;
        var titulo = "Pagamentos a se vencer";
        var msg = this.criaMensagem(pagamentos);
        this.auth.getUserId()
            .then(function (userId) {
            _this.notificacao.enviarNotificacao(userId, titulo, msg);
        });
    };
    PagamentosPage.prototype.criaMensagem = function (pagamentos) {
        if (pagamentos > 1) {
            return pagamentos + " pagamento se vence hoje";
        }
        else {
            return pagamentos + " pagamentos se vencem hoje";
        }
    };
    PagamentosPage.prototype.modalAdicionaPagamento = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__adiciona_pagamento_adiciona_pagamento__["a" /* AdicionaPagamentoPage */]);
    };
    PagamentosPage.prototype.modalEditaPagamento = function (pagamento) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__edita_pagamento_edita_pagamento__["a" /* EditaPagamentoPage */], pagamento);
    };
    PagamentosPage.prototype.modalRealizaPagamento = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__realiza_pagamento_realiza_pagamento__["a" /* RealizaPagamentoPage */]);
    };
    PagamentosPage.prototype.removePagamento = function (pagamento) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: "Excluir pagamento",
            message: "Você tem certeza que deseja excluir este pagamento?"
                + "\n\n" + "Todas as informações serão deletadas.",
            buttons: [{
                    text: 'Cancelar',
                    handler: function () { }
                },
                {
                    text: 'Excluir',
                    handler: function () {
                        _this.pagamentoService.removePagamentoFB(pagamento)
                            .then(function (_) {
                            _this.pagamentos = _this.pagamentos.filter(function (pag) { return pag.key !== pagamento.key; });
                        });
                    }
                }
            ]
        });
        alert.present();
    };
    PagamentosPage.prototype.fechaPagamento = function (pagamento) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: "Finalizar pagamento",
            message: "Você tem certeza que deseja concluir este pagamento?"
                + "\n\n" + "Confirme apenas se já tiver pago. O pagamento será incluído em suas estatísticas.",
            buttons: [{
                    text: 'Cancelar',
                    handler: function () { }
                },
                {
                    text: 'Concluir',
                    handler: function () {
                        _this.financa = __assign({}, _this.financa, { ehDebito: true, descricao: "Pagamento de " + pagamento.nomeDoFiador, valor: pagamento.valor, data: pagamento.data, categoria: "Dívida", verificacao: __WEBPACK_IMPORTED_MODULE_8__models_VerificacaoEnum__["a" /* Verificacao */].Confirmado, usuarioCriador: _this.usuario.username });
                        _this.financaService.adicionaFinancaEmUsuarioFB(_this.financa.usuarioCriador, _this.financa).then(function (_) {
                            _this.authService.incrementarNumPagamentos(_this.usuario.numPagamentos);
                            _this.pagamentoService.removePagamentoFB(pagamento)
                                .then(function (_) {
                                _this.pagamentos = _this.pagamentos.filter(function (pag) { return pag.key !== pagamento.key; });
                            });
                            _this.abreToast("Pagamento concluído.");
                        });
                    }
                }
            ]
        });
        alert.present();
    };
    PagamentosPage.prototype.getTextoData = function (pagamento) {
        var options = { weekday: "long", month: 'long', day: '2-digit' };
        var dataSeparada = pagamento.data.toString().split("-");
        var ano = Number(dataSeparada[0]);
        var mes = Number(dataSeparada[1]) - 1;
        var dia = Number(dataSeparada[2]);
        var dataAjustada = new Date(ano, mes, dia);
        return dataAjustada.toLocaleDateString("pt-br", options);
    };
    PagamentosPage.prototype.filtraPagamentos = function (pagamentos) {
        var pagamentosFiltrados = [];
        for (var i = 0; i < pagamentos.length; i++) {
            var dataFinancaAtual = new Date(pagamentos[i].data);
            if (dataFinancaAtual >= this.hoje) {
                pagamentosFiltrados.push(pagamentos[i]);
            }
        }
        return pagamentosFiltrados;
    };
    PagamentosPage.prototype.filtraPagamentosAtrasados = function (pagamentos) {
        var pagamentosFiltrados = [];
        for (var i = 0; i < pagamentos.length; i++) {
            var dataFinancaAtual = new Date(pagamentos[i].data);
            if (dataFinancaAtual < this.hoje) {
                pagamentosFiltrados.push(pagamentos[i]);
            }
        }
        return pagamentosFiltrados;
    };
    PagamentosPage.prototype.existePagamento = function () {
        return this.filtraPagamentos(this.pagamentos).length > 0;
    };
    PagamentosPage.prototype.temPagamentosAtrasados = function () {
        return this.filtraPagamentosAtrasados(this.pagamentos).length > 0;
    };
    PagamentosPage.prototype.abreFoto = function (foto) {
        var imageViewer = this.imageViewerCtrl.create(foto);
        imageViewer.present();
    };
    PagamentosPage.prototype.existeFoto = function (pagamento) {
        return !(pagamento.imagem == null) && !(pagamento.imagem === "") && !(pagamento.imagem === "nnn");
    };
    PagamentosPage.prototype.formataValor = function (valor) {
        return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
    };
    PagamentosPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-pagamentos',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/pagamentos/pagamentos.html"*/'<ion-header>\n  <ion-navbar color="corPrimaria">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Pagamentos</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content class="cor-background">\n\n<ion-list *ngIf="temPagamentosAtrasados()">\n  <ion-card>\n    <ion-card-header color="corMeta" class="item-text-wrap">\n      Lembretes de pagamentos prioritários\n    </ion-card-header>\n      <ion-item *ngFor="let pagamento of filtraPagamentosAtrasados(pagamentos)">\n          <hr>\n          <ion-item>\n          <h2>{{pagamento.nomeDoFiador}}</h2>\n          <div style="overflow: hidden;">\n            <p>{{pagamento.descricao}}</p>\n            <p>{{getTextoData(pagamento)}}</p>\n            <p class="totalDebito">R$ {{formataValor(pagamento.valor)}}</p>\n          </div>\n          <ion-item *ngIf="existeFoto(pagamento)">\n            <img (click)="abreFoto(pagamento.imagem)" [src]="pagamento.imagem">\n          </ion-item>\n        <button ion-button color="corEmprestimo" large clear item-end (click)="modalEditaPagamento(pagamento)">\n          <ion-icon name="create"></ion-icon>\n        </button>\n        <button ion-button color="corDivida" large clear item-end (click)="removePagamento(pagamento)">\n          <ion-icon name="trash"></ion-icon>\n        </button>\n        <button ion-button color="corPrimaria" large clear item-end (click)="fechaPagamento(pagamento)">\n            <ion-icon name="checkmark"></ion-icon>\n          </button>\n        </ion-item>\n      </ion-item>\n    </ion-card>\n  </ion-list>\n\n  <ion-list>\n      <ion-card>\n        <ion-card-header color="corPrimaria" class="item-text-wrap">\n          Meus lembretes de pagamentos\n        </ion-card-header>\n        <ion-item *ngIf="!existePagamento()">\n            <p style="white-space: normal;" text-center>Não há nenhum pagamento registrado.</p>\n          </ion-item>\n          <ion-item *ngFor="let pagamento of filtraPagamentos(pagamentos)">\n              <hr>\n              <ion-item>\n              <h2>{{pagamento.nomeDoFiador}}</h2>\n              <div style="overflow: hidden;">\n                <p>{{pagamento.descricao}}</p>\n                <p>{{getTextoData(pagamento)}}</p>\n                <p class="totalDebito">R$ {{formataValor(pagamento.valor)}}</p>\n              </div>\n              <ion-item *ngIf="existeFoto(pagamento)">\n                <img (click)="abreFoto(pagamento.imagem)" [src]="pagamento.imagem">\n              </ion-item>\n            <button ion-button color="corEmprestimo" large clear item-end (click)="modalEditaPagamento(pagamento)">\n              <ion-icon name="create"></ion-icon>\n            </button>\n            <button ion-button color="corDivida" large clear item-end (click)="removePagamento(pagamento)">\n              <ion-icon name="trash"></ion-icon>\n            </button>\n            <button ion-button color="corPrimaria" large clear item-end (click)="fechaPagamento(pagamento)">\n                <ion-icon name="checkmark"></ion-icon>\n              </button>\n          </ion-item>\n          </ion-item>\n        </ion-card>\n      </ion-list>\n\n  <br>\n  <br>\n  <br>\n  <br>\n\n  <ion-fab bottom right #fab>\n    <button ion-fab color="corPrimaria">\n      <ion-icon name="add"></ion-icon>\n    </button>\n    <ion-fab-list side="top">\n        <button ion-fab (click)="modalAdicionaPagamento()" color="corPrimaria">\n          <ion-icon name="add" color="light"></ion-icon>\n          <ion-label>Registrar lembrete de pagamento</ion-label>\n        </button>\n        <button ion-fab (click)="modalRealizaPagamento()" color="corPrimaria">\n          <ion-icon name="cash" color="light"></ion-icon>\n          <ion-label>Realizar pagamento</ion-label>\n        </button>\n  </ion-fab-list>\n\n  </ion-fab>\n\n</ion-content>\n'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/pagamentos/pagamentos.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_pagamento_service_pagamento_service__["a" /* PagamentoServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_5__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_6_ionic_img_viewer__["a" /* ImageViewerController */],
            __WEBPACK_IMPORTED_MODULE_7__providers_notification_notification__["a" /* NotificationProvider */],
            __WEBPACK_IMPORTED_MODULE_5__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_9__providers_financa_service_financa_service__["a" /* FinancaServiceProvider */]])
    ], PagamentosPage);
    return PagamentosPage;
}());

//# sourceMappingURL=pagamentos.js.map

/***/ }),

/***/ 265:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 265;

/***/ }),

/***/ 306:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/adiciona-acordo/adiciona-acordo.module": [
		307
	],
	"../pages/adiciona-amigo/adiciona-amigo.module": [
		379
	],
	"../pages/adiciona-dinheiro/adiciona-dinheiro.module": [
		357
	],
	"../pages/adiciona-divida/adiciona-divida.module": [
		859,
		17
	],
	"../pages/adiciona-emprestimo/adiciona-emprestimo.module": [
		860,
		16
	],
	"../pages/adiciona-financa/adiciona-financa.module": [
		861,
		15
	],
	"../pages/adiciona-meta/adiciona-meta.module": [
		862,
		14
	],
	"../pages/adiciona-pagamento/adiciona-pagamento.module": [
		863,
		13
	],
	"../pages/amigos/amigos.module": [
		864,
		12
	],
	"../pages/ativos-financeiros/ativos-financeiros.module": [
		364
	],
	"../pages/chat-room/chat-room.module": [
		865,
		11
	],
	"../pages/detalhes-amigos/detalhes-amigos.module": [
		866,
		10
	],
	"../pages/edita-acordo/edita-acordo.module": [
		366
	],
	"../pages/edita-divida/edita-divida.module": [
		867,
		9
	],
	"../pages/edita-emprestimo/edita-emprestimo.module": [
		868,
		8
	],
	"../pages/edita-financa/edita-financa.module": [
		869,
		7
	],
	"../pages/edita-meta/edita-meta.module": [
		870,
		6
	],
	"../pages/edita-pagamento/edita-pagamento.module": [
		871,
		5
	],
	"../pages/edita-perfil/edita-perfil.module": [
		872,
		4
	],
	"../pages/financas-charts/financas-charts.module": [
		873,
		3
	],
	"../pages/financas/financas.module": [
		874,
		2
	],
	"../pages/introducao/introducao.module": [
		367
	],
	"../pages/login-cadastro/login-cadastro.module": [
		875,
		1
	],
	"../pages/mostra-divida/mostra-divida.module": [
		371
	],
	"../pages/mostra-emprestimo/mostra-emprestimo.module": [
		372
	],
	"../pages/pagamentos/pagamentos.module": [
		876,
		0
	],
	"../pages/realiza-pagamento/realiza-pagamento.module": [
		378
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return Promise.all(ids.slice(1).map(__webpack_require__.e)).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 306;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 307:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdicionaAcordoPageModule", function() { return AdicionaAcordoPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__adiciona_acordo__ = __webpack_require__(168);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var AdicionaAcordoPageModule = /** @class */ (function () {
    function AdicionaAcordoPageModule() {
    }
    AdicionaAcordoPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__adiciona_acordo__["a" /* AdicionaAcordoPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__adiciona_acordo__["a" /* AdicionaAcordoPage */]),
            ],
        })
    ], AdicionaAcordoPageModule);
    return AdicionaAcordoPageModule;
}());

//# sourceMappingURL=adiciona-acordo.module.js.map

/***/ }),

/***/ 357:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdicionaDinheiroPageModule", function() { return AdicionaDinheiroPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__adiciona_dinheiro__ = __webpack_require__(358);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_brmasker_ionic_3__ = __webpack_require__(359);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var AdicionaDinheiroPageModule = /** @class */ (function () {
    function AdicionaDinheiroPageModule() {
    }
    AdicionaDinheiroPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__adiciona_dinheiro__["a" /* AdicionaDinheiroPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__adiciona_dinheiro__["a" /* AdicionaDinheiroPage */]),
                __WEBPACK_IMPORTED_MODULE_3_brmasker_ionic_3__["a" /* BrMaskerModule */]
            ],
        })
    ], AdicionaDinheiroPageModule);
    return AdicionaDinheiroPageModule;
}());

//# sourceMappingURL=adiciona-dinheiro.module.js.map

/***/ }),

/***/ 358:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdicionaDinheiroPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Helper_Utils__ = __webpack_require__(66);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the AdicionaDinheiroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var AdicionaDinheiroPage = /** @class */ (function () {
    function AdicionaDinheiroPage(navCtrl, navParams, toastCtrl, authProvider, alertCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.authProvider = authProvider;
        this.alertCtrl = alertCtrl;
        this.usuario = {};
        this.dinheiro = {};
        this.cartao = {};
        //booleans de Verificacao
        this.valorVazio = false;
        this.nomeTitularVazio = false;
        this.numeroCartaoVazio = false;
        this.dataVencimentoVazia = false;
        this.codigoSegurancaVazio = false;
        this.numeroCartaoInvalido = false;
        this.codigoSegurancaInvalido = false;
        this.usuario = this.navParams.data;
        if (this.usuario.cartao.numeroCartao != null) {
            this.cartao.nomeTitular = this.usuario.cartao.nomeTitular;
            this.cartao.numeroCartao = this.usuario.cartao.numeroCartao;
            this.cartao.dataVencimento = this.usuario.cartao.dataVencimento;
            this.cartao.codigoSeguranca = this.usuario.cartao.codigoSeguranca;
        }
    }
    AdicionaDinheiroPage.prototype.adicionaDinheiro = function () {
        var _this = this;
        if (!this.confirmaDados()) {
            this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
        }
        else if (this.dinheiro.valor < 0) {
            this.abrirToast("Ops! Você não pode adicionar um valor negativo.");
        }
        else {
            this.dinheiro.cartao = this.cartao;
            var alert_1 = this.alertCtrl.create({
                title: "Salvar dados do cartão",
                message: "Deseja manter os dados do seu cartão salvos para futuras transações? ",
                buttons: [{
                        text: 'Sim',
                        handler: function () {
                            _this.authProvider.salvarCartaoUsuario(_this.dinheiro.cartao).then(function (result) {
                                _this.abrirToast("Cartão salvo.");
                            });
                            _this.adicionaDinheiroAux();
                        }
                    },
                    {
                        text: 'Não',
                        handler: function () {
                            _this.adicionaDinheiroAux();
                        }
                    }
                ]
            });
            alert_1.present();
        }
    };
    AdicionaDinheiroPage.prototype.adicionaDinheiroAux = function () {
        var _this = this;
        var valorDinheiro = __WEBPACK_IMPORTED_MODULE_3__Helper_Utils__["a" /* default */].formataValorFB(this.dinheiro.valor);
        this.authProvider.salvarCarteiraUsuario(valorDinheiro, this.usuario.carteira).then(function (result) {
            _this.navCtrl.pop();
            _this.abrirToast("Transação autorizada.");
        });
    };
    AdicionaDinheiroPage.prototype.abrirToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    };
    AdicionaDinheiroPage.prototype.confirmaDados = function () {
        this.valorVazio = this.dinheiro.valor <= 0;
        this.nomeTitularVazio = this.cartao.nomeTitular == null;
        this.numeroCartaoVazio = this.cartao.numeroCartao == null;
        this.dataVencimentoVazia = this.cartao.dataVencimento == null;
        this.numeroCartaoInvalido = this.cartao.numeroCartao.toString().length != 16 && !this.numeroCartaoVazio;
        this.codigoSegurancaVazio = this.cartao.codigoSeguranca == null;
        this.codigoSegurancaInvalido = this.cartao.codigoSeguranca.toString().length != 3 && !this.codigoSegurancaVazio;
        return !this.valorVazio && !this.nomeTitularVazio && !this.numeroCartaoVazio && !this.dataVencimentoVazia
            && !this.codigoSegurancaVazio && !this.numeroCartaoInvalido && !this.codigoSegurancaInvalido;
    };
    AdicionaDinheiroPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-adiciona-dinheiro',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/adiciona-dinheiro/adiciona-dinheiro.html"*/'<ion-header>\n  <ion-navbar color="corPrimaria">\n    <ion-title>Adicionar dinheiro na carteira</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content class="cor-background">\n  <ion-card>\n    <ion-card-header color="corPrimaria">\n      Valor\n    </ion-card-header>\n\n    <ion-item>\n      <ion-icon name=\'cash\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" placeholder="Valor" [(ngModel)]="dinheiro.valor"\n        [brmasker]="{money: true, thousand: \'.\',  decimalCaracter: \',\', len: 11}">\n      </ion-input>\n    </ion-item>\n    <ion-item *ngIf="valorVazio">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite o valor.</p>\n    </ion-item>\n  </ion-card>\n\n  <ion-card>\n    <ion-card-header color="corPrimaria">\n      Cartão de Crédito\n    </ion-card-header>\n\n    <ion-item>\n      <ion-icon name=\'contact\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" [(ngModel)]="cartao.nomeTitular" placeholder="Nome do Titular"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="nomeTitularVazio">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite o nome do titular.</p>\n    </ion-item>\n\n    <ion-item>\n      <ion-icon name=\'finger-print\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" [(ngModel)]="cartao.numeroCartao" placeholder="Número do Cartão"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="numeroCartaoVazio">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite o número do cartão.</p>\n    </ion-item>\n    <ion-item *ngIf="numeroCartaoInvalido">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite um número de cartão válido.</p>\n    </ion-item>\n\n    <ion-item>\n      <ion-icon name=\'calendar\' item-start color="corPrimaria"></ion-icon>\n      <ion-datetime placeholder="Data de Vencimento" cancelText="Cancelar" doneText="Ok" min="2017" max="2020" displayFormat="MM/YYYY" [(ngModel)]="cartao.dataVencimento">\n      </ion-datetime>\n    </ion-item>\n    <ion-item *ngIf="dataVencimentoVazia">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Selecione a data de vencimento.</p>\n    </ion-item>\n\n    <ion-item>\n      <ion-icon name=\'eye-off\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" [(ngModel)]="cartao.codigoSeguranca" placeholder="Código de Segurança"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="codigoSegurancaVazio">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite o código de segurança.</p>\n    </ion-item>\n    <ion-item *ngIf="codigoSegurancaInvalido">\n      <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n      <p class="erro">Digite um código de segurança válido.</p>\n    </ion-item>\n  </ion-card>\n\n  <ion-fab bottom right>\n    <button ion-fab (click)="adicionaDinheiro()" color="corPrimaria">\n      <ion-icon name="checkmark"></ion-icon>\n    </button>\n  </ion-fab>\n\n</ion-content>'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/adiciona-dinheiro/adiciona-dinheiro.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__["a" /* AuthProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */]])
    ], AdicionaDinheiroPage);
    return AdicionaDinheiroPage;
}());

//# sourceMappingURL=adiciona-dinheiro.js.map

/***/ }),

/***/ 363:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdicionaAmigoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_amigos_service_amigos_service__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_auth_auth__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the AdicionaAmigoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var AdicionaAmigoPage = /** @class */ (function () {
    function AdicionaAmigoPage(navCtrl, navParams, toastCtrl, authService, amigoService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.authService = authService;
        this.amigoService = amigoService;
        this.nomeUsuario = "";
        //booleans de verificação
        this.nomeVazio = false;
        this.usuarioNaoEncontrado = false;
    }
    AdicionaAmigoPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad AdicionaAmigoPage');
    };
    AdicionaAmigoPage.prototype.abrirToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    };
    AdicionaAmigoPage.prototype.adicionaAmigo = function () {
        var _this = this;
        if (!this.confirmaDados()) {
            this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
        }
        else {
            this.authService.getUsuarioRef(this.nomeUsuario).then(function (result) {
                _this.adicionaAmigoAux(result);
            }).catch(function (error) {
                console.log("entrei");
                _this.abrirToast("Ops! Parece que o usuário que você está procurando não existe.");
            });
        }
    };
    AdicionaAmigoPage.prototype.adicionaAmigoAux = function (usuario) {
        this.amigoService.adicionaAmigoFB(usuario);
        this.navCtrl.pop();
        this.abrirToast("Solicitação enviada.");
    };
    AdicionaAmigoPage.prototype.confirmaDados = function () {
        this.nomeVazio = this.nomeUsuario == null;
        return !this.nomeVazio;
    };
    AdicionaAmigoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-adiciona-amigo',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/adiciona-amigo/adiciona-amigo.html"*/'<ion-header>\n    <ion-navbar color="corAmigo">\n      <ion-title>Novo amigo</ion-title>\n    </ion-navbar>\n  </ion-header>\n  \n  \n  <ion-content class="cor-background">\n    <ion-card>\n      <ion-card-header color="corAmigo">\n        Informações\n      </ion-card-header>\n      <ion-item>\n        <ion-icon name=\'clipboard\' item-start color="corAmigo"></ion-icon>\n        <ion-input type="text" [(ngModel)]="nomeUsuario" placeholder="Nome de Usuario"></ion-input>\n      </ion-item>\n      <ion-item *ngIf="nomeVazio">\n        <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n        <p class="erro">Digite o nome de usuário.</p>\n      </ion-item>\n  \n    </ion-card>\n  \n    <ion-fab bottom right>\n      <button ion-fab (click)="adicionaAmigo()" color="corAmigo">\n        <ion-icon name="checkmark"></ion-icon>\n      </button>\n    </ion-fab>\n  \n  </ion-content>'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/adiciona-amigo/adiciona-amigo.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */], __WEBPACK_IMPORTED_MODULE_3__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_2__providers_amigos_service_amigos_service__["a" /* AmigosServiceProvider */]])
    ], AdicionaAmigoPage);
    return AdicionaAmigoPage;
}());

//# sourceMappingURL=adiciona-amigo.js.map

/***/ }),

/***/ 364:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AtivosFinanceirosPageModule", function() { return AtivosFinanceirosPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ativos_financeiros__ = __webpack_require__(186);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var AtivosFinanceirosPageModule = /** @class */ (function () {
    function AtivosFinanceirosPageModule() {
    }
    AtivosFinanceirosPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__ativos_financeiros__["a" /* AtivosFinanceirosPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__ativos_financeiros__["a" /* AtivosFinanceirosPage */]),
            ],
        })
    ], AtivosFinanceirosPageModule);
    return AtivosFinanceirosPageModule;
}());

//# sourceMappingURL=ativos-financeiros.module.js.map

/***/ }),

/***/ 366:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditaAcordoPageModule", function() { return EditaAcordoPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__edita_acordo__ = __webpack_require__(187);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var EditaAcordoPageModule = /** @class */ (function () {
    function EditaAcordoPageModule() {
    }
    EditaAcordoPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__edita_acordo__["a" /* EditaAcordoPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__edita_acordo__["a" /* EditaAcordoPage */]),
            ],
        })
    ], EditaAcordoPageModule);
    return EditaAcordoPageModule;
}());

//# sourceMappingURL=edita-acordo.module.js.map

/***/ }),

/***/ 367:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IntroducaoPageModule", function() { return IntroducaoPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__introducao__ = __webpack_require__(368);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var IntroducaoPageModule = /** @class */ (function () {
    function IntroducaoPageModule() {
    }
    IntroducaoPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__introducao__["a" /* IntroducaoPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__introducao__["a" /* IntroducaoPage */]),
            ],
        })
    ], IntroducaoPageModule);
    return IntroducaoPageModule;
}());

//# sourceMappingURL=introducao.module.js.map

/***/ }),

/***/ 368:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IntroducaoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__login_cadastro_login_cadastro__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(189);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the IntroducaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var IntroducaoPage = /** @class */ (function () {
    function IntroducaoPage(navCtrl, navParams, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
    }
    IntroducaoPage.prototype.ionViewDidLoad = function () { };
    IntroducaoPage.prototype.irParaLogin = function () {
        this.storage.set('introducaoVista', true);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__login_cadastro_login_cadastro__["a" /* LoginCadastroPage */]);
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_2__login_cadastro_login_cadastro__["a" /* LoginCadastroPage */]);
    };
    IntroducaoPage.prototype.ultimoSlide = function () {
        return this.slidesIntro.isEnd();
    };
    IntroducaoPage.prototype.avancaParaUltimo = function () {
        return this.slidesIntro.slideTo(8);
    };
    IntroducaoPage.prototype.avancaSlide = function () {
        this.slidesIntro.slideNext();
    };
    IntroducaoPage.prototype.retornaSlide = function () {
        this.slidesIntro.slideTo(0);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('slides'),
        __metadata("design:type", Object)
    ], IntroducaoPage.prototype, "slidesIntro", void 0);
    IntroducaoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-introducao',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/introducao/introducao.html"*/'<!--\n  Introdução ao Cadê Meu Dinheiro\n-->\n\n<ion-content class="corPrimaria" scroll>\n\n  <ion-slides #slides>\n\n    <ion-slide class="slide_image">\n      <img src="assets/imgs/app-branco.png" alt="">\n      <br>\n      <br>\n      <h2 class="textoIntro">Bem-vindo!</h2>\n      <div>\n        <p class="textoIntro">Iremos te ajudar a administrar sua vida financeira, mas antes deixe-nos ensinar você como nosso aplicativo funciona.</p>\n      </div>\n    </ion-slide>\n\n    <ion-slide class="slide_image">\n      <img src="assets/imgs/intro-financas.png" alt="">\n      <br>\n      <br>\n      <h2 class="textoIntro">Tenha controle de suas finanças</h2>\n      <div>\n        <p class="textoIntro">O Cadê Meu Dinheiro oferece a opção de você registrar suas finanças do mês para ter controle de \n          seus ganhos e gastos. Registre todos os seus ganhos mensais, suas compras realizadas e a categoria de cada transação realizada.\n        </p>\n      </div>\n    </ion-slide>\n\n\n    <ion-slide class="slide_image">\n      <img src="assets/imgs/intro-estatisticas.png" alt="">\n      <br>\n      <br>\n      <h2 class="textoIntro">Veja as estatísticas de sua gestão financeira</h2>\n      <div>\n        <p class="textoIntro">Gosta de analisar a sua situação financeira atual? Nosso aplicativo irá te ajudar com isso! A partir de suas finanças, \n          iremos te mostrar gráficos estatísticos úteis para você gerir melhor seu dinheiro.\n        </p>\n      </div>\n    </ion-slide>\n\n    <ion-slide class="slide_image">\n        <img src="assets/imgs/intro-metas.png" alt="">\n        <br>\n        <br>\n        <h2 class="textoIntro">Deseja não ultrapassar um determinado valor de gasto?</h2>\n        <div>\n          <p class="textoIntro">Você é aquele tipo de pessoa que não consegue resistir ao ver uma roupa na moda ou um sanduíche delicioso sem comprar?\n            O Cadê Meu Dinheiro oferece um sistema de controle de gastos baseado em metas. Sendo assim, iremos te notificar quando seu gasto atual em alguma categoria\n            como alimentação ou vestimentas estiverem próximos do limite.\n          </p>\n        </div>\n      </ion-slide>\n\n      <ion-slide class="slide_image">\n          <img src="assets/imgs/intro-divida.png" alt="">\n          <br>\n          <br>\n          <h2 class="textoIntro">Registre suas dívidas pendentes</h2>\n          <div>\n            <p class="textoIntro">Você tem dificuldade de lembrar que possui uma dívida com alguém? Basta registrar todos os seus detalhes no aplicativo!\n              Você também pode registrar o nome de algum outro usuário do Cadê Meu Dinheiro para poder marcar acordos de pagamento com ele e poder notificá-lo.\n            </p>\n          </div>\n        </ion-slide>\n    \n        <ion-slide class="slide_image">\n          <img src="assets/imgs/intro-emprestimo.png" alt="">\n          <br>\n          <br>\n          <h2 class="textoIntro">Registre seus empréstimos realizados</h2>\n          <div>\n            <p class="textoIntro">Você tem dificuldade de lembrar que emprestou dinheiro para alguém? Basta registrar todos os seus detalhes no aplicativo!\n                Você também pode registrar o nome de algum outro usuário do Cadê Meu Dinheiro para poder marcar acordos de recebimento com ele e poder notificá-lo.\n            </p>\n          </div>\n        </ion-slide>\n\n      <ion-slide class="slide_image">\n          <img src="assets/imgs/intro-coletivo.png" alt="">\n          <br>\n          <br>\n          <h2 class="textoIntro">Registre também seus pagamentos coletivos</h2>\n          <div>\n            <p class="textoIntro">Sabe quando você vai naquela pizzaria com os amigos e quer "rachar" a conta com eles? No Cadê Meu Dinheiro, você pode registrar pagamentos\n              compartilhados com amigos. Sendo assim, o aplicativo irá lembrá-los de efetuar o pagamento a você.\n            </p>\n          </div>\n        </ion-slide>\n\n        <ion-slide class="slide_image">\n            <img src="assets/imgs/intro-ativos.png" alt="">\n            <br>\n            <br>\n            <h2 class="textoIntro">Quer saber em que você pode investir?</h2>\n            <div>\n              <p class="textoIntro">Nosso aplicativo também informará a você sobre ativos financeiros, ou seja, onde você pode investir aquele restinho de dinheiro\n                que sobrou no seu mês.\n              </p>\n            </div>\n          </ion-slide>\n\n      <ion-slide class="slide_image">\n          <img src="assets/imgs/intro-fim.png" alt="">\n          <br>\n          <br>\n          <h2 class="textoIntro">Entendeu como funciona?</h2>\n          <div>\n              <button padding ion-button clear icon-start color="light" (click)="irParaLogin()">\n                  <ion-icon color="light" name="arrow-dropright-circle"></ion-icon>\n                  Vamos começar!\n                </button>\n          </div>\n        </ion-slide>  \n\n\n\n  </ion-slides>\n\n  <ion-item class="botoes_slide" color="corPrimaria">\n    <button type="submit" *ngIf="!ultimoSlide()" item-left ion-button clear color="light" class="btnPrev" (click)="avancaParaUltimo()">Pular</button>\n    <button type="submit" *ngIf="!ultimoSlide()" item-right ion-button clear color="light" class="btnNext" (click)="avancaSlide()">Próximo</button>\n    <button type="submit" *ngIf="ultimoSlide()" item-left ion-button clear color="light" class="btnPrev" (click)="retornaSlide()">Voltar</button>\n  </ion-item>\n\n\n</ion-content>'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/introducao/introducao.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */]])
    ], IntroducaoPage);
    return IntroducaoPage;
}());

//# sourceMappingURL=introducao.js.map

/***/ }),

/***/ 369:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MostraDividaPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_divida_service_divida_service__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__edita_divida_edita_divida__ = __webpack_require__(224);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__adiciona_acordo_adiciona_acordo__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_acordo_service_acordo_service__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__edita_acordo_edita_acordo__ = __webpack_require__(187);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_financa_service_financa_service__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__models_VerificacaoEnum__ = __webpack_require__(42);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var MostraDividaPage = /** @class */ (function () {
    function MostraDividaPage(navCtrl, navParams, dividaService, toastCtrl, alertCtrl, statusBar, authService, acordoService, financaService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.dividaService = dividaService;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.statusBar = statusBar;
        this.authService = authService;
        this.acordoService = acordoService;
        this.financaService = financaService;
        this.divida = {};
        this.dividaLocal = false;
        this.criadorDivida = false;
        this.divida = this.navParams.data;
        this.dividaLocal = this.divida.usuarioEmprestador == null;
    }
    MostraDividaPage.prototype.abreToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    };
    MostraDividaPage.prototype.existeAcordo = function () {
        return this.divida.acordos !== undefined && this.divida.acordos.length > 0;
    };
    MostraDividaPage.prototype.editarAcordo = function (acordo) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__edita_acordo_edita_acordo__["a" /* EditaAcordoPage */], [this.divida, acordo, "divida"]);
    };
    MostraDividaPage.prototype.pagaDivida = function (divida) {
        var _this = this;
        var usuario = this.authService.getUsuarioUser();
        console.log(divida.valor);
        console.log(usuario.carteira);
        if (divida.valor > usuario.carteira) {
            this.abreToast("Ops! Você não tem dinheiro suficiente.");
        }
        else {
            var alert_1 = this.alertCtrl.create({
                title: "Pagar dívida",
                message: "Deseja pagar essa dívida com seu dinheiro da carteira? ",
                buttons: [{
                        text: 'Sim',
                        handler: function () {
                            _this.authService.decrementaCarteira(usuario.carteira, divida.valor);
                            _this.abreToast("Pagamento efetuado.");
                            _this.fechaDivida(divida);
                        }
                    },
                    {
                        text: 'Não',
                        handler: function () {
                        }
                    }
                ]
            });
            alert_1.present();
        }
    };
    MostraDividaPage.prototype.fechaDivida = function (divida) {
        var _this = this;
        this.divida.aberta = false;
        this.dividaService.editaDividaEmprestimoFB(this.divida).then(function (_) {
            _this.financa = __assign({}, _this.financa, { ehDebito: true, descricao: "Dívida com " + _this.divida.nomeUsuarioEmprestador, valor: _this.divida.valor, data: _this.divida.data, categoria: "Dívida", verificacao: __WEBPACK_IMPORTED_MODULE_10__models_VerificacaoEnum__["a" /* Verificacao */].Confirmado, usuarioCriador: _this.divida.usuarioCriador });
            _this.financaService.adicionaFinancaEmUsuarioFB(_this.financa.usuarioCriador, _this.financa).then(function (_) {
                _this.navCtrl.pop();
                _this.abreToast("Dívida concluída.");
            });
        }).catch(function (err) {
            _this.abreToast("Erro ao tentar fechar dívida.");
            _this.divida.aberta = true;
        });
    };
    MostraDividaPage.prototype.formataValor = function (valor) {
        return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
    };
    MostraDividaPage.prototype.deletaDivida = function (divida) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: "Excluir dívida",
            message: "Você tem certeza que deseja excluir esta dívida?"
                + "\n\n" + "Todas as informações serão deletadas.",
            buttons: [{
                    text: 'Cancelar',
                    handler: function () { }
                },
                {
                    text: 'Excluir',
                    handler: function () {
                        _this.apagaDivida(divida);
                    }
                }
            ]
        });
        alert.present();
    };
    MostraDividaPage.prototype.apagaDivida = function (divida) {
        this.dividaService.removeDividaFB(divida);
        this.navCtrl.pop();
        this.abreToast("Dívida removida.");
    };
    MostraDividaPage.prototype.fecharAcordo = function (acordo) {
        this.acordoService.fechaAcordo(this.divida, acordo, "divida");
    };
    MostraDividaPage.prototype.modalAdicionaAcordo = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__adiciona_acordo_adiciona_acordo__["a" /* AdicionaAcordoPage */], [this.divida, "divida"]);
    };
    MostraDividaPage.prototype.modalEditaDivida = function (divida) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__edita_divida_edita_divida__["a" /* EditaDividaPage */], divida);
    };
    MostraDividaPage.prototype.getData = function (divida) {
        return divida.data.toLocaleString("pt-BR");
    };
    MostraDividaPage.prototype.getTextoData = function () {
        var options = { weekday: "long", month: 'long', day: '2-digit' };
        var dataSeparada = this.divida.data.toString().split("-");
        var ano = Number(dataSeparada[0]);
        var mes = Number(dataSeparada[1]) - 1;
        var dia = Number(dataSeparada[2]);
        var dataAjustada = new Date(ano, mes, dia);
        return dataAjustada.toLocaleDateString("pt-br", options);
    };
    MostraDividaPage.prototype.getTextoDataAcordo = function (dataAcordo) {
        var options = { weekday: "long", month: 'long', day: '2-digit' };
        var dataSeparada = dataAcordo.toString().split("-");
        var ano = Number(dataSeparada[0]);
        var mes = Number(dataSeparada[1]) - 1;
        var dia = Number(dataSeparada[2]);
        var dataAjustada = new Date(ano, mes, dia);
        return dataAjustada.toLocaleDateString("pt-br", options);
    };
    MostraDividaPage.prototype.ehCriador = function () {
        var _this = this;
        this.authService.getUsername().then(function (username) {
            _this.criadorDivida = username === _this.divida.usuarioCriador;
        });
        return this.criadorDivida;
    };
    MostraDividaPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-mostra-divida',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/mostra-divida/mostra-divida.html"*/'<ion-header>\n\n  <ion-navbar color="corDivida">\n\n    <ion-title>Dívida com {{divida.nomeUsuarioEmprestador}}</ion-title>\n\n    <ion-buttons *ngIf="ehCriador()" end>\n\n      <button ion-button (click)="deletaDivida(divida)" icon-only>\n\n        <ion-icon name="trash"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="cor-background">\n\n  <ion-list>\n\n    <ion-card>\n\n      <ion-card-header color="corDivida">\n\n        Informações\n\n      </ion-card-header>\n\n\n\n      <ion-item *ngIf="!dividaLocal">\n\n        <ion-icon name="person" color="corDivida" item-start></ion-icon>\n\n        <h2>\n\n          <strong>Usuário: </strong> {{divida.usuarioEmprestador}}</h2>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-icon name="cash" color="corDivida" item-start></ion-icon>\n\n        <h2>\n\n          <strong>Valor:</strong> R$ {{formataValor(divida.valor)}}</h2>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-icon name="calendar" color="corDivida" item-start></ion-icon>\n\n        <h2>\n\n          <strong>Data:</strong> {{getTextoData()}}</h2>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-icon name="clipboard" color="corDivida" item-start></ion-icon>\n\n        <h2>\n\n          <strong>Descrição:</strong> {{divida.descricao}}</h2>\n\n      </ion-item>\n\n\n\n\n\n    </ion-card>\n\n  </ion-list>\n\n\n\n  <ion-list *ngIf="!dividaLocal">\n\n    <ion-card>\n\n\n\n      <ion-card-header color="corDivida">\n\n        Acordos\n\n      </ion-card-header>\n\n      <ion-item *ngIf="!existeAcordo()">\n\n        <p style="white-space: normal;" text-center>Nenhum acordo registrado.</p>\n\n      </ion-item>\n\n\n\n      <ion-item *ngFor="let acordo of divida.acordos">\n\n        <ion-icon name="chatboxes" color="corDivida" item-start></ion-icon>\n\n        <h2> <strong>Data: </strong>{{getTextoDataAcordo(acordo.data)}}</h2>\n\n        <h2> <strong>Hora: </strong>{{acordo.hora}}</h2>\n\n        <h2> <strong>Local: </strong>{{acordo.local}}</h2>\n\n        <h2> <strong>Descrição: </strong>{{acordo.descricao}}</h2>\n\n        <ion-icon name="create" color="corDivida" (click)="editarAcordo(acordo)" style="padding-right:  6%;" item-end></ion-icon>\n\n        <ion-icon name="checkmark" color="corDivida" (click)="fecharAcordo(acordo)" style="padding-right:  4%;"\n\n          item-end></ion-icon>\n\n      </ion-item>\n\n\n\n      <ion-row>\n\n        <ion-col width-50 style="text-align: center">\n\n          <button padding icon-start ion-button round color="corDivida" (click)="modalAdicionaAcordo()">\n\n            <ion-icon name="add"></ion-icon>\n\n            Adicionar acordo\n\n          </button>\n\n        </ion-col>\n\n      </ion-row>\n\n    </ion-card>\n\n  </ion-list>\n\n\n\n\n\n\n\n\n\n\n\n  <ion-row>\n\n    <ion-col width-50 style="text-align: center">\n\n      <button padding icon-start ion-button round color="corPrimaria" (click)="pagaDivida(divida)">\n\n        <ion-icon name="card"></ion-icon>\n\n        Pagar dívida\n\n      </button>\n\n      <button padding icon-start ion-button round color="corPrimaria" (click)="fechaDivida(divida)">\n\n        <ion-icon name="checkmark"></ion-icon>\n\n        Fechar dívida\n\n      </button>\n\n    </ion-col>\n\n  </ion-row>\n\n\n\n\n\n  <ion-fab bottom right *ngIf="ehCriador()">\n\n    <button ion-fab color="corDivida" (click)="modalEditaDivida(divida)">\n\n      <ion-icon name="create"></ion-icon>\n\n    </button>\n\n  </ion-fab>\n\n</ion-content>'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/mostra-divida/mostra-divida.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__providers_divida_service_divida_service__["a" /* DividaServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_9__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_6__providers_acordo_service_acordo_service__["a" /* AcordoServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_8__providers_financa_service_financa_service__["a" /* FinancaServiceProvider */]])
    ], MostraDividaPage);
    return MostraDividaPage;
}());

//# sourceMappingURL=mostra-divida.js.map

/***/ }),

/***/ 370:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MostraEmprestimoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_divida_service_divida_service__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__edita_emprestimo_edita_emprestimo__ = __webpack_require__(225);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__adiciona_acordo_adiciona_acordo__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_acordo_service_acordo_service__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__edita_acordo_edita_acordo__ = __webpack_require__(187);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_financa_service_financa_service__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__models_VerificacaoEnum__ = __webpack_require__(42);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var MostraEmprestimoPage = /** @class */ (function () {
    function MostraEmprestimoPage(navCtrl, navParams, emprestimoService, toastController, alertController, statusBar, authService, acordoService, financaService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.emprestimoService = emprestimoService;
        this.toastController = toastController;
        this.alertController = alertController;
        this.statusBar = statusBar;
        this.authService = authService;
        this.acordoService = acordoService;
        this.financaService = financaService;
        this.emprestimo = {};
        this.criadorEmprestimo = false;
        this.emprestimo = this.navParams.data;
    }
    MostraEmprestimoPage.prototype.abreToast = function (text) {
        var toast = this.toastController.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    };
    MostraEmprestimoPage.prototype.formataValor = function (valor) {
        return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
    };
    MostraEmprestimoPage.prototype.existeAcordo = function () {
        return this.emprestimo.acordos !== undefined && this.emprestimo.acordos.length > 0;
    };
    MostraEmprestimoPage.prototype.editarAcordo = function (acordo) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__edita_acordo_edita_acordo__["a" /* EditaAcordoPage */], [this.emprestimo, acordo, "emprestimo"]);
    };
    MostraEmprestimoPage.prototype.fechaEmprestimo = function (emprestimo) {
        var _this = this;
        this.emprestimo.aberta = false;
        this.emprestimoService.editaDividaEmprestimoFB(this.emprestimo).then(function (_) {
            _this.financa = __assign({}, _this.financa, { ehDebito: false, descricao: "Empréstimo para " + _this.emprestimo.nomeUsuarioDevedor, valor: _this.emprestimo.valor, data: _this.emprestimo.data, categoria: "Empréstimo", verificacao: __WEBPACK_IMPORTED_MODULE_10__models_VerificacaoEnum__["a" /* Verificacao */].Confirmado, usuarioCriador: _this.emprestimo.usuarioCriador });
            _this.financaService.adicionaFinancaEmUsuarioFB(_this.financa.usuarioCriador, _this.financa).then(function (_) {
                _this.navCtrl.pop();
                _this.abreToast("Empréstimo concluído.");
            });
        }).catch(function (err) {
            _this.abreToast("Erro ao tentar fechar empréstimo.");
            _this.emprestimo.aberta = true;
        });
    };
    MostraEmprestimoPage.prototype.deletaEmprestimo = function (emprestimo) {
        var _this = this;
        var alert = this.alertController.create({
            title: "Excluir empréstimo",
            message: "Você tem certeza que deseja excluir este empréstimo?"
                + "\n\n" + "Todas as informações serão deletadas.",
            buttons: [{
                    text: 'Cancelar',
                    handler: function () { }
                },
                {
                    text: 'Excluir',
                    handler: function () {
                        _this.emprestimoService.removeEmprestimoFB(emprestimo);
                        _this.navCtrl.pop();
                        _this.abreToast("Empréstimo removido.");
                    }
                }
            ]
        });
        alert.present();
    };
    MostraEmprestimoPage.prototype.modalAdicionaAcordo = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__adiciona_acordo_adiciona_acordo__["a" /* AdicionaAcordoPage */], [this.emprestimo, "emprestimo"]);
    };
    MostraEmprestimoPage.prototype.fecharAcordo = function (acordo) {
        this.acordoService.fechaAcordo(this.emprestimo, acordo, "emprestimo");
    };
    MostraEmprestimoPage.prototype.modalEditaEmprestimo = function (emprestimo) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__edita_emprestimo_edita_emprestimo__["a" /* EditaEmprestimoPage */], emprestimo);
    };
    MostraEmprestimoPage.prototype.getTextoData = function () {
        var options = { weekday: "long", month: 'long', day: '2-digit' };
        var dataSeparada = this.emprestimo.data.toString().split("-");
        var ano = Number(dataSeparada[0]);
        var mes = Number(dataSeparada[1]) - 1;
        var dia = Number(dataSeparada[2]);
        var dataAjustada = new Date(ano, mes, dia);
        return dataAjustada.toLocaleDateString("pt-br", options);
    };
    MostraEmprestimoPage.prototype.getTextoDataAcordo = function (dataAcordo) {
        var options = { weekday: "long", month: 'long', day: '2-digit' };
        var dataSeparada = dataAcordo.toString().split("-");
        var ano = Number(dataSeparada[0]);
        var mes = Number(dataSeparada[1]) - 1;
        var dia = Number(dataSeparada[2]);
        var dataAjustada = new Date(ano, mes, dia);
        return dataAjustada.toLocaleDateString("pt-br", options);
    };
    MostraEmprestimoPage.prototype.ehCriador = function () {
        var _this = this;
        this.authService.getUsername().then(function (username) {
            _this.criadorEmprestimo = username === _this.emprestimo.usuarioCriador;
        });
        return this.criadorEmprestimo;
    };
    MostraEmprestimoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-mostra-emprestimo',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/mostra-emprestimo/mostra-emprestimo.html"*/'<ion-header>\n\n  <ion-navbar color="corEmprestimo">\n\n    <ion-title>Empréstimo para {{emprestimo.nomeUsuarioDevedor}}</ion-title>\n\n    <ion-buttons *ngIf="ehCriador()" end>\n\n      <button ion-button (click)="deletaEmprestimo(emprestimo)" icon-only>\n\n        <ion-icon name="trash"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="cor-background">\n\n  <ion-list>\n\n    <ion-card>\n\n      <ion-card-header color="corEmprestimo">\n\n        Informações\n\n      </ion-card-header>\n\n\n\n      <ion-item>\n\n        <ion-icon name="person" color="corEmprestimo" item-start></ion-icon>\n\n        <h2>\n\n          <strong>Usuário: </strong> {{emprestimo.usuarioDevedor}}</h2>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-icon name="cash" color="corEmprestimo" item-start></ion-icon>\n\n        <h2>\n\n          <strong>Valor:</strong> R$ {{formataValor(emprestimo.valor)}}</h2>\n\n      </ion-item>\n\n      <ion-item>\n\n          <ion-icon name="calendar" color="corEmprestimo" item-start></ion-icon>\n\n        <h2>\n\n          <strong>Data:</strong> {{getTextoData()}}</h2>\n\n          </ion-item>\n\n        <ion-item>\n\n            <ion-icon name="clipboard" color="corEmprestimo" item-start></ion-icon>\n\n          <h2>\n\n            <strong>Descrição:</strong> {{emprestimo.descricao}}</h2>\n\n        </ion-item>\n\n    </ion-card>\n\n  </ion-list>\n\n  \n\n  <ion-list>\n\n    <ion-card>\n\n        \n\n      <ion-card-header color="corEmprestimo">\n\n        Acordos\n\n      </ion-card-header>\n\n          <ion-item *ngIf="!existeAcordo()">\n\n            <p style="white-space: normal;" text-center>Nenhum acordo registrado.</p>\n\n          </ion-item>\n\n      \n\n          <ion-item *ngFor="let acordo of emprestimo.acordos">\n\n            <ion-icon name="chatboxes" color="corEmprestimo" item-start></ion-icon>\n\n              <h2> <strong>Data: </strong>{{getTextoDataAcordo(acordo.data)}}</h2>\n\n              <h2> <strong>Hora: </strong>{{acordo.hora}}</h2>\n\n              <h2> <strong>Local: </strong>{{acordo.local}}</h2>\n\n              <h2> <strong>Descrição: </strong>{{acordo.descricao}}</h2>\n\n            <ion-icon name="create" color="corEmprestimo" item-end (click)="editarAcordo(acordo)" style="padding-right:  6%;"></ion-icon>\n\n            <ion-icon name="checkmark" color="corEmprestimo" item-end (click)="fecharAcordo(acordo)" style="padding-right:  4%;"></ion-icon>\n\n          </ion-item>\n\n\n\n      <ion-row>\n\n        <ion-col width-50 style="text-align: center">\n\n          <button padding icon-start ion-button round color="corEmprestimo" (click)="modalAdicionaAcordo()">\n\n              <ion-icon name="add"></ion-icon>\n\n            Adicionar acordo\n\n          </button>\n\n        </ion-col>\n\n      </ion-row>\n\n    </ion-card>\n\n  </ion-list>\n\n\n\n  <ion-row>\n\n      <ion-col width-50 style="text-align: center">\n\n        <button padding icon-start ion-button round color="corPrimaria" (click)="fechaEmprestimo(emprestimo)">\n\n            <ion-icon name="checkmark"></ion-icon>\n\n          Fechar empréstimo\n\n        </button>\n\n      </ion-col>\n\n    </ion-row>\n\n\n\n  <ion-fab bottom right *ngIf="ehCriador()">\n\n      <button ion-fab color="corEmprestimo" (click)="modalEditaEmprestimo(emprestimo)">\n\n        <ion-icon name="create"></ion-icon>\n\n      </button>\n\n    </ion-fab>\n\n</ion-content>'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/mostra-emprestimo/mostra-emprestimo.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__providers_divida_service_divida_service__["a" /* DividaServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_9__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_6__providers_acordo_service_acordo_service__["a" /* AcordoServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_8__providers_financa_service_financa_service__["a" /* FinancaServiceProvider */]])
    ], MostraEmprestimoPage);
    return MostraEmprestimoPage;
}());

//# sourceMappingURL=mostra-emprestimo.js.map

/***/ }),

/***/ 371:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MostraDividaPageModule", function() { return MostraDividaPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mostra_divida_mostra_divida__ = __webpack_require__(369);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var MostraDividaPageModule = /** @class */ (function () {
    function MostraDividaPageModule() {
    }
    MostraDividaPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__mostra_divida_mostra_divida__["a" /* MostraDividaPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__mostra_divida_mostra_divida__["a" /* MostraDividaPage */]),
            ],
        })
    ], MostraDividaPageModule);
    return MostraDividaPageModule;
}());

//# sourceMappingURL=mostra-divida.module.js.map

/***/ }),

/***/ 372:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MostraEmprestimoPageModule", function() { return MostraEmprestimoPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mostra_emprestimo__ = __webpack_require__(370);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var MostraEmprestimoPageModule = /** @class */ (function () {
    function MostraEmprestimoPageModule() {
    }
    MostraEmprestimoPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__mostra_emprestimo__["a" /* MostraEmprestimoPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__mostra_emprestimo__["a" /* MostraEmprestimoPage */]),
            ],
        })
    ], MostraEmprestimoPageModule);
    return MostraEmprestimoPageModule;
}());

//# sourceMappingURL=mostra-emprestimo.module.js.map

/***/ }),

/***/ 377:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RealizaPagamentoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * Generated class for the RealizaPagamentoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var RealizaPagamentoPage = /** @class */ (function () {
    function RealizaPagamentoPage(navCtrl, navParams, toastCtrl, authService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.authService = authService;
        this.codigoVazio = false;
        this.codigoInvalido = false;
    }
    RealizaPagamentoPage.prototype.abrirToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    };
    RealizaPagamentoPage.prototype.realizaPagamento = function () {
        if (!this.confirmaDados()) {
            this.abrirToast("Ops! Parece que você deixou de preencher algo, ou preencheu incorretamente.");
        }
        else {
            this.navCtrl.pop();
            this.abrirToast("Pagamento realizado.");
        }
    };
    /*realizaPagamentoAux() {
      let usuario = this.authService.getUsuarioUser();
      console.log(divida.valor);
      console.log(usuario.carteira);
      if (divida.valor > usuario.carteira) {
        this.abreToast("Ops! Você não tem dinheiro suficiente.");
      }
      else {
        let alert = this.alertCtrl.create({
          title: "Pagar dívida",
          message: "Deseja pagar essa dívida com seu dinheiro da carteira? ",
          buttons: [{
            text: 'Sim',
            handler: () => {
              this.authService.decrementaCarteira(usuario.carteira, divida.valor);
              this.abreToast("Pagamento efetuado.");
              this.fechaDivida(divida);
            }
          },
          {
            text: 'Não',
            handler: () => {
            }
          }
          ]
        });
        alert.present();
      }
    } */
    RealizaPagamentoPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad RealizaPagamentoPage');
    };
    RealizaPagamentoPage.prototype.confirmaDados = function () {
        this.codigoVazio = this.codigoDeBarras == null;
        this.codigoInvalido = this.codigoDeBarras.toString().length != 20;
        return !this.codigoVazio && !this.codigoInvalido;
    };
    RealizaPagamentoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-realiza-pagamento',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/realiza-pagamento/realiza-pagamento.html"*/'<ion-header>\n  <ion-navbar color="corPrimaria">\n    <ion-title>Realizar pagamento</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content class="cor-background">      \n  <ion-card>\n    <ion-card-header color="corPrimaria">\n      Informações\n    </ion-card-header>\n\n    <ion-item>\n        <ion-icon name=\'barcode\' item-start color="corPrimaria"></ion-icon>\n        <ion-input type="text" [(ngModel)]="codigoDeBarras" placeholder="Código de barras"></ion-input>\n      </ion-item>\n      <ion-item *ngIf="codigoVazio">\n        <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n        <p class="erro">Digite o código de barras.</p>\n      </ion-item>\n      <ion-item *ngIf="codigoInvalido">\n        <ion-icon name="information-circle" color="grey" item-start></ion-icon>\n        <p class="erro">Digite um código de barras válido.</p>\n      </ion-item>\n\n    <ion-item>\n      <ion-icon name=\'clipboard\' item-start color="corPrimaria"></ion-icon>\n      <ion-input type="text" [(ngModel)]="descricao" placeholder="Descrição (opcional)"></ion-input>\n    </ion-item>\n\n  <ion-fab bottom right>\n    <button ion-fab (click)="realizaPagamento()" color="corPrimaria">\n      <ion-icon name="checkmark"></ion-icon>\n    </button>\n  </ion-fab>\n  </ion-card>\n\n</ion-content>'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/realiza-pagamento/realiza-pagamento.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__["a" /* AuthProvider */]])
    ], RealizaPagamentoPage);
    return RealizaPagamentoPage;
}());

//# sourceMappingURL=realiza-pagamento.js.map

/***/ }),

/***/ 378:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RealizaPagamentoPageModule", function() { return RealizaPagamentoPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__realiza_pagamento__ = __webpack_require__(377);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var RealizaPagamentoPageModule = /** @class */ (function () {
    function RealizaPagamentoPageModule() {
    }
    RealizaPagamentoPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__realiza_pagamento__["a" /* RealizaPagamentoPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__realiza_pagamento__["a" /* RealizaPagamentoPage */]),
            ],
        })
    ], RealizaPagamentoPageModule);
    return RealizaPagamentoPageModule;
}());

//# sourceMappingURL=realiza-pagamento.module.js.map

/***/ }),

/***/ 379:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdicionaAmigoPageModule", function() { return AdicionaAmigoPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__adiciona_amigo__ = __webpack_require__(363);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var AdicionaAmigoPageModule = /** @class */ (function () {
    function AdicionaAmigoPageModule() {
    }
    AdicionaAmigoPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__adiciona_amigo__["a" /* AdicionaAmigoPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__adiciona_amigo__["a" /* AdicionaAmigoPage */]),
            ],
        })
    ], AdicionaAmigoPageModule);
    return AdicionaAmigoPageModule;
}());

//# sourceMappingURL=adiciona-amigo.module.js.map

/***/ }),

/***/ 42:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Verificacao; });
var Verificacao;
(function (Verificacao) {
    Verificacao["Confirmado"] = "CONFIRMADO";
    Verificacao["Pendente"] = "PENDENTE";
    Verificacao["Negado"] = "NEGADO";
})(Verificacao || (Verificacao = {}));
;
//# sourceMappingURL=VerificacaoEnum.js.map

/***/ }),

/***/ 420:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PerfilPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__edita_perfil_edita_perfil__ = __webpack_require__(229);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_divida_service_divida_service__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__adiciona_dinheiro_adiciona_dinheiro__ = __webpack_require__(358);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var PerfilPage = /** @class */ (function () {
    function PerfilPage(navCtrl, navParams, authService, dividaService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.authService = authService;
        this.dividaService = dividaService;
        this.usuario = {};
        this.somaDividas = 0;
        this.somaEmprestimos = 0;
        this.somaAcordosDividas = 0;
        this.somaAcordosEmprestimos = 0;
        this.somaPagamentos = 0;
        this.retornaFoto(false);
        authService.getUsuario().subscribe(function (res) {
            _this.usuario = res;
            _this.retornaFoto(true);
        });
    }
    PerfilPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.authService.getUsername().then(function (username) {
            _this.dividaService.recebeDividasFB(username).valueChanges().subscribe(function (dividas) {
                _this.somaDividas = _this.calculaSoma(dividas, "divida");
            });
            _this.dividaService.recebeEmprestimosFB(username).valueChanges().subscribe(function (emprestimos) {
                _this.somaEmprestimos = _this.calculaSoma(emprestimos, "emprestimo");
            });
        });
    };
    PerfilPage.prototype.calculaSoma = function (lista, tipo) {
        var soma = 0.0;
        for (var i = 0; i < lista.length; i++) {
            soma += +lista[i].valor;
            if (lista[i].acordos != null) {
                if (tipo == "divida") {
                    this.somaAcordosDividas += +lista[i].acordos.length;
                }
                else {
                    this.somaAcordosEmprestimos += +lista[i].acordos.length;
                }
            }
        }
        return soma;
    };
    PerfilPage.prototype.retornaFoto = function (carregado) {
        if (carregado) {
            this.fotosrc = this.authService.getGravatarUsuario(this.usuario.email, "https://cdn.pbrd.co/images/HwxHoFO.png");
        }
        else {
            this.fotosrc = "assets/imgs/user.png";
        }
    };
    PerfilPage.prototype.editaPerfil = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__edita_perfil_edita_perfil__["a" /* EditaPerfilPage */], this.fotosrc);
    };
    PerfilPage.prototype.modalAdicionaDinheiro = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__adiciona_dinheiro_adiciona_dinheiro__["a" /* AdicionaDinheiroPage */], this.usuario);
    };
    PerfilPage.prototype.formataValor = function (valor) {
        return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
    };
    PerfilPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-perfil',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/perfil/perfil.html"*/'<ion-header>\n\n  <ion-navbar color="corPrimaria">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Perfil</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="cor-background">\n\n    <ion-grid>\n\n        <ion-row>\n\n          <ion-col>\n\n          </ion-col>\n\n          <ion-col col-9 text-center>\n\n          <img class="image_circle" [src]="fotosrc">\n\n        </ion-col>\n\n          <ion-col>\n\n          </ion-col>\n\n        </ion-row>\n\n      </ion-grid>\n\n\n\n      <ion-item class="cor-background">\n\n          <p text-center style="font-size:  2rem;font-weight: 500;">{{ usuario?.nome }}</p>\n\n          <p text-center style="font-size:  2rem;font-weight: 250;" color="corPrimaria">Carteira: R$ {{formataValor(usuario.carteira)}}  \n\n            <ion-icon name=\'add\' item-start color="corPrimaria" (click)="modalAdicionaDinheiro()"></ion-icon></p>   \n\n        </ion-item>\n\n\n\n  <ion-card>\n\n    <ion-card-header color="corPrimaria">\n\n      Meu histórico\n\n    </ion-card-header>\n\n    <ion-item>\n\n      <ion-icon name=\'arrow-up\' item-start color="corEmprestimo"></ion-icon>\n\n      <h2>Total de empréstimos</h2>\n\n      <p>R$ {{formataValor(somaEmprestimos)}}</p>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-icon name=\'arrow-down\' item-start color="corDivida"></ion-icon>\n\n      <h2>Total de dívidas</h2>\n\n      <p>R$ {{formataValor(somaDividas)}}</p>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-icon name=\'chatbubbles\' item-start color="corPrimaria"></ion-icon>\n\n      <h2>Acordos realizados</h2>\n\n      <p>{{somaAcordosDividas + somaAcordosEmprestimos}}</p>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-icon name=\'card\' item-start color="corPrimaria"></ion-icon>\n\n      <h2>Pagamentos realizados</h2>\n\n      <p>{{usuario.numPagamentos}}</p>\n\n    </ion-item>\n\n    </ion-card>\n\n\n\n  <ion-card>\n\n    <ion-card-header color="corPrimaria">\n\n      Minhas Informações\n\n    </ion-card-header>\n\n    <ion-item>\n\n        <ion-icon name=\'contact\' item-start color="corPrimaria"></ion-icon>\n\n        <h2>Nome de Usuário</h2>\n\n        <p>{{usuario?.username}}</p>\n\n    </ion-item>\n\n    <ion-item>\n\n        <ion-icon name=\'briefcase\' item-start color="corPrimaria"></ion-icon>\n\n        <h2>Profissão</h2>\n\n        <p>{{usuario?.profissao}}</p>\n\n    </ion-item>\n\n    <ion-item>\n\n        <ion-icon name=\'logo-usd\' item-start color="corPrimaria"></ion-icon>\n\n        <h2>Salário</h2>\n\n        <p>R$ {{formataValor(usuario?.salario)}}</p>\n\n    </ion-item>\n\n  </ion-card>\n\n\n\n  <ion-fab bottom right>\n\n    <button ion-fab color="corPrimaria" (click)="editaPerfil()">\n\n      <ion-icon name="create"></ion-icon>\n\n    </button>\n\n\n\n  </ion-fab>\n\n</ion-content>'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/perfil/perfil.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_4__providers_divida_service_divida_service__["a" /* DividaServiceProvider */]])
    ], PerfilPage);
    return PerfilPage;
}());

//# sourceMappingURL=perfil.js.map

/***/ }),

/***/ 421:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SobrePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SobrePage = /** @class */ (function () {
    function SobrePage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    SobrePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-sobre',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/sobre/sobre.html"*/'<ion-header>\n\n  <ion-navbar color="corPrimaria">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Sobre</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="cor-background">\n\n  <ion-avatar>\n\n    <img src="assets/imgs/cmd.png">\n\n  </ion-avatar>\n\n  <ion-card>\n\n    <ion-card-header color="corPrimaria">\n\n      Equipe\n\n    </ion-card-header>\n\n    <ion-item>\n\n      <h2>Desenvolvedores - P1 2018.2</h2>\n\n      <p>Victor Emanuel</p>\n\n      <p>Ruan Silveira</p>\n\n      <p>Gabriel Maracajá</p>\n\n      <p>Ronaldo Medeiros</p>\n\n      <p>Vinícius Medeiros</p>\n\n      <p>Lucas Fernandes</p>\n\n    </ion-item>\n\n    <ion-item>\n\n      <h2>Analistas financeiros - ETI 2018.2</h2>\n\n      <p>Victor Emanuel</p>\n\n      <p>Adbys</p>\n\n      <p>Caio Vidal</p>\n\n      <p>Ruan Silveira</p>\n\n      <p>Lucas Henrique</p>\n\n      <p>Raquel Rufino</p>\n\n    </ion-item>\n\n    <ion-item>\n\n      <h2>Desenvolvedores/Gestores - LES 2018.1</h2>\n\n      <p>Victor Emanuel</p>\n\n      <p>Mattheus Brito</p>\n\n      <p>Adbys</p>\n\n      <p>Caio Vidal</p>\n\n      <p>Wesley</p>\n\n      <p>Alice</p>\n\n      <p>Pedro Henrique</p>\n\n    </ion-item>\n\n  </ion-card>\n\n</ion-content>'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/pages/sobre/sobre.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */]])
    ], SobrePage);
    return SobrePage;
}());

//# sourceMappingURL=sobre.js.map

/***/ }),

/***/ 46:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DividaServiceProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__notification_notification__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_VerificacaoEnum__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Helper_Utils__ = __webpack_require__(66);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var DividaServiceProvider = /** @class */ (function () {
    function DividaServiceProvider(db, authProvider, notificacao) {
        var _this = this;
        this.db = db;
        this.authProvider = authProvider;
        this.notificacao = notificacao;
        this.usuario = {};
        this.authProvider.getUsuario().subscribe(function (user) {
            _this.usuario = user;
        });
    }
    DividaServiceProvider.prototype.adicionaDividaFB = function (divida) {
        var _this = this;
        divida.valor = __WEBPACK_IMPORTED_MODULE_5__Helper_Utils__["a" /* default */].formataValorFB(divida.valor);
        this.setVerificacao(divida);
        return new Promise(function (resolve) {
            _this.associaDividaFB(divida).then(function (div) {
                _this.db.list("divida-list").push(div).then(function (resp) {
                    var novaDiv = __assign({}, div, { key: resp.key });
                    resolve(novaDiv);
                });
            });
        });
    };
    DividaServiceProvider.prototype.associaDividaFB = function (divida) {
        var _this = this;
        return new Promise(function (resolve) {
            if (divida.usuarioDevedor != null && divida.usuarioEmprestador != null) {
                _this.authProvider.getUsuarioRef(divida.usuarioEmprestador).then(function (usuario) {
                    var usuarioAssociado = usuario;
                    if (Object.keys(usuarioAssociado).length > 0) {
                        divida.usuarioEmprestador = usuarioAssociado.username;
                        divida.nomeUsuarioEmprestador = usuarioAssociado.nome;
                        divida.emailUsuarioEmprestador = usuarioAssociado.email;
                        if (usuarioAssociado.userId != null) {
                            _this.enviarNotificacao(usuarioAssociado.userId, divida, false);
                        }
                    }
                    resolve(divida);
                }).catch(function (_) {
                    resolve(divida);
                });
            }
            else {
                resolve(divida);
            }
        });
    };
    DividaServiceProvider.prototype.adicionaEmprestimoFB = function (emprestimo) {
        var _this = this;
        emprestimo.valor = __WEBPACK_IMPORTED_MODULE_5__Helper_Utils__["a" /* default */].formataValorFB(emprestimo.valor);
        this.setVerificacao(emprestimo);
        return new Promise(function (resolve) {
            _this.associaEmprestimoFB(emprestimo).then(function (emp) {
                _this.db.list("divida-list").push(emp).then(function (resp) {
                    var novoEmp = __assign({}, emp, { key: resp.key });
                    resolve(novoEmp);
                });
            });
        });
    };
    DividaServiceProvider.prototype.associaEmprestimoFB = function (emprestimo) {
        var _this = this;
        return new Promise(function (resolve) {
            if (emprestimo.usuarioDevedor != null && emprestimo.usuarioEmprestador != null) {
                _this.authProvider.getUsuarioRef(emprestimo.usuarioDevedor).then(function (usuario) {
                    var usuarioAssociado = usuario;
                    if (Object.keys(usuarioAssociado).length > 0) {
                        emprestimo.usuarioDevedor = usuarioAssociado.username;
                        emprestimo.nomeUsuarioDevedor = usuarioAssociado.nome;
                        emprestimo.emailUsuarioDevedor = usuarioAssociado.email;
                        if (usuarioAssociado.userId != null) {
                            _this.enviarNotificacao(usuarioAssociado.userId, emprestimo, true);
                        }
                    }
                    resolve(emprestimo);
                }).catch(function (_) {
                    resolve(emprestimo);
                });
            }
            else {
                resolve(emprestimo);
            }
        });
    };
    DividaServiceProvider.prototype.editaDividaEmprestimoFB = function (divida) {
        var _this = this;
        divida.valor = __WEBPACK_IMPORTED_MODULE_5__Helper_Utils__["a" /* default */].formataValorFB(divida.valor);
        return new Promise(function (resolve, reject) {
            _this.db.list("divida-list").update(divida.key, divida).then(function (_) {
                resolve(divida);
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    DividaServiceProvider.prototype.enviarNotificacao = function (usuarioId, divida, ehEmprestimo) {
        var inicioMsg = ehEmprestimo ? "Nova dívida de " : "Novo empréstimo de ";
        var nomeEditor = ehEmprestimo ? divida.nomeUsuarioDevedor : divida.nomeUsuarioEmprestador;
        this.notificacao.enviarNotificacao(usuarioId, inicioMsg + nomeEditor, divida.descricao + " \nR$" + this.formataValor(divida.valor));
    };
    DividaServiceProvider.prototype.recebeDividasFB = function (username) {
        return this.db.list('/divida-list/', function (ref) { return ref.orderByChild('usuarioDevedor').equalTo(username); });
    };
    DividaServiceProvider.prototype.recebeEmprestimosFB = function (username) {
        return this.db.list('/divida-list/', function (ref) { return ref.orderByChild('usuarioEmprestador').equalTo(username); });
    };
    DividaServiceProvider.prototype.removeDividaFB = function (divida) {
        return this.db.list("divida-list/").remove(divida.key);
    };
    DividaServiceProvider.prototype.removeEmprestimoFB = function (emprestimo) {
        return this.removeDividaFB(emprestimo);
    };
    DividaServiceProvider.prototype.retornaSomaDividas = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.recebeDividasFB(_this.usuario.username).valueChanges().subscribe(function (dividas) {
                var somaDividas = dividas.reduce(function (acum, divida) {
                    return acum + divida.valor;
                }, 0.0);
                resolve(somaDividas);
            });
        });
    };
    DividaServiceProvider.prototype.formataValor = function (valor) {
        return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
    };
    DividaServiceProvider.prototype.setVerificacao = function (divEmp) {
        var semOutroUsuario = !divEmp.usuarioDevedor || !divEmp.usuarioEmprestador;
        divEmp.verificacao = semOutroUsuario ? __WEBPACK_IMPORTED_MODULE_4__models_VerificacaoEnum__["a" /* Verificacao */].Confirmado : __WEBPACK_IMPORTED_MODULE_4__models_VerificacaoEnum__["a" /* Verificacao */].Pendente;
    };
    DividaServiceProvider.prototype.getTextoData = function (data) {
        var options = { weekday: "long", month: 'long', day: '2-digit' };
        var dataSeparada = data.toString().split("-");
        var ano = Number(dataSeparada[0]);
        var mes = Number(dataSeparada[1]) - 1;
        var dia = Number(dataSeparada[2]);
        var dataAjustada = new Date(ano, mes, dia);
        return dataAjustada.toLocaleDateString("pt-br", options);
    };
    DividaServiceProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_angularfire2_database__["a" /* AngularFireDatabase */],
            __WEBPACK_IMPORTED_MODULE_2__auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_3__notification_notification__["a" /* NotificationProvider */]])
    ], DividaServiceProvider);
    return DividaServiceProvider;
}());

//# sourceMappingURL=divida-service.js.map

/***/ }),

/***/ 49:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FinancaServiceProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Helper_Utils__ = __webpack_require__(66);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var FinancaServiceProvider = /** @class */ (function () {
    function FinancaServiceProvider(db, auth) {
        this.db = db;
        this.auth = auth;
        this.financas = [];
        this.financasDoUsuario = [];
    }
    FinancaServiceProvider.prototype.adicionaFinancaEmUsuarioFB = function (username, financa) {
        var _this = this;
        financa.valor = __WEBPACK_IMPORTED_MODULE_3__Helper_Utils__["a" /* default */].formataValorFB(financa.valor);
        return new Promise(function (resolve) {
            _this.getFinancaListRefParam(username).then(function (resp) {
                var financaList = resp;
                _this.db.list(financaList)
                    .push(financa)
                    .then(function (resp) {
                    var novaFinanca = _this.setFinancaKey(financa, resp.key);
                    resolve(novaFinanca);
                });
            });
        });
    };
    FinancaServiceProvider.prototype.editaFinancaFB = function (financa) {
        financa.valor = __WEBPACK_IMPORTED_MODULE_3__Helper_Utils__["a" /* default */].formataValorFB(financa.valor);
        return this.getFinancaListRef().update(financa.key, financa);
    };
    FinancaServiceProvider.prototype.removeFinancaFB = function (financa) {
        return this.getFinancaListRef().remove(financa.key);
    };
    FinancaServiceProvider.prototype.recebeFinancasFB = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.getFinancaObjRef()
                .valueChanges()
                .subscribe(function (financas) {
                if (financas) {
                    _this.financas = _this.mapFinObjectToList(financas);
                }
                resolve(_this.financas);
            });
        });
    };
    FinancaServiceProvider.prototype.recebeFinancasDeUsuarioFB = function (username) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.getFinancaListRefParam(username).then(function (result) {
                _this.db.object(result)
                    .valueChanges()
                    .subscribe(function (financasUser) {
                    if (financasUser) {
                        _this.financasDoUsuario = _this.mapFinObjectToList(financasUser);
                    }
                    resolve(_this.financasDoUsuario);
                });
            });
        });
    };
    FinancaServiceProvider.prototype.getFinancaListRef = function () {
        return this.db.list(this.getFinancaPath());
    };
    FinancaServiceProvider.prototype.getFinancaObjRef = function () {
        return this.db.object(this.getFinancaPath());
    };
    FinancaServiceProvider.prototype.getFinancaPath = function () {
        return "financa-list/" + this.auth.getUID();
    };
    FinancaServiceProvider.prototype.getFinancaListRefParam = function (username) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.auth.getUsuarioKey(username).then(function (key) {
                resolve("financa-list/" + key);
            });
        });
    };
    FinancaServiceProvider.prototype.mapFinObjectToList = function (financaObj) {
        var _this = this;
        return Object.keys(financaObj)
            .map(function (key) {
            var financa = financaObj[key];
            return _this.setFinancaKey(financa, key);
        });
    };
    FinancaServiceProvider.prototype.setFinancaKey = function (financa, key) {
        return __assign({}, financa, { key: key });
    };
    FinancaServiceProvider.prototype.formataValor = function (valor) {
        return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
    };
    FinancaServiceProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_angularfire2_database__["a" /* AngularFireDatabase */],
            __WEBPACK_IMPORTED_MODULE_2__auth_auth__["a" /* AuthProvider */]])
    ], FinancaServiceProvider);
    return FinancaServiceProvider;
}());

//# sourceMappingURL=financa-service.js.map

/***/ }),

/***/ 53:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotificationProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_onesignal__ = __webpack_require__(183);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(5);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var NotificationProvider = /** @class */ (function () {
    function NotificationProvider(oneSignal, platform) {
        this.oneSignal = oneSignal;
        this.platform = platform;
        this.url = "https://onesignal.com/api/v1/notifications";
        this.cordova = this.platform.is('cordova');
    }
    NotificationProvider.prototype.iniciarOneSignal = function () {
        if (this.cordova) {
            this.oneSignal.startInit('d0ce017c-912b-4859-8ae2-b707856f87de', '580258323760');
            this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
            this.oneSignal.endInit();
            return this.oneSignal.getIds().then(function (result) {
                return result;
            });
        }
    };
    NotificationProvider.prototype.enviarNotificacao = function (id, titulo, msg) {
        if (this.cordova) {
            var ids = [];
            ids.push(id);
            var notificacao = {
                contents: {
                    "en": msg
                },
                include_player_ids: ids,
                headings: {
                    "en": titulo
                },
                android_accent_color: "#FF008000",
                android_led_color: "#FF008000",
            };
            this.oneSignal.postNotification(notificacao);
        }
    };
    NotificationProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_native_onesignal__["a" /* OneSignal */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["t" /* Platform */]])
    ], NotificationProvider);
    return NotificationProvider;
}());

//# sourceMappingURL=notification.js.map

/***/ }),

/***/ 550:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(551);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(673);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 66:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.formataValorFB = function (valor) {
        var valorAsString = String(valor);
        while (valorAsString.includes(".")) {
            valorAsString = valorAsString.replace(".", "");
        }
        return Number(valorAsString.replace(",", "."));
    };
    return Utils;
}());
/* harmony default export */ __webpack_exports__["a"] = (Utils);
//# sourceMappingURL=Utils.js.map

/***/ }),

/***/ 673:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_component__ = __webpack_require__(674);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(365);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angularfire2__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_angularfire2_database__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_angularfire2_auth__ = __webpack_require__(318);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_angularfire2_firestore__ = __webpack_require__(843);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__firebase_credentials__ = __webpack_require__(849);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_ionic_img_viewer__ = __webpack_require__(373);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_status_bar__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_splash_screen__ = __webpack_require__(419);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_camera__ = __webpack_require__(850);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ionic_native_file_path__ = __webpack_require__(851);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ionic_native_file__ = __webpack_require__(852);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__ionic_native_onesignal__ = __webpack_require__(183);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ionic_storage__ = __webpack_require__(189);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ionic_native_image_picker__ = __webpack_require__(362);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_ng2_charts__ = __webpack_require__(853);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_ng2_charts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_19_ng2_charts__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_brmasker_ionic_3__ = __webpack_require__(359);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__providers_auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__providers_chat_service_chat_service__ = __webpack_require__(185);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__providers_meta_service_meta_service__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__providers_notification_notification__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__providers_amigos_service_amigos_service__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__providers_divida_service_divida_service__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__providers_acordo_service_acordo_service__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__providers_financa_service_financa_service__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__providers_pagamento_service_pagamento_service__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__pages_mostra_divida_mostra_divida_module__ = __webpack_require__(371);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__pages_mostra_emprestimo_mostra_emprestimo_module__ = __webpack_require__(372);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__pages_adiciona_acordo_adiciona_acordo_module__ = __webpack_require__(307);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__pages_edita_acordo_edita_acordo_module__ = __webpack_require__(366);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__pages_adiciona_amigo_adiciona_amigo_module__ = __webpack_require__(379);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__pages_ativos_financeiros_ativos_financeiros_module__ = __webpack_require__(364);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__pages_introducao_introducao_module__ = __webpack_require__(367);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__pages_home_home__ = __webpack_require__(188);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__pages_perfil_perfil__ = __webpack_require__(420);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__pages_sobre_sobre__ = __webpack_require__(421);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__pages_financas_financas__ = __webpack_require__(231);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__pages_amigos_amigos__ = __webpack_require__(221);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__pages_chat_room_chat_room__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__pages_financas_charts_financas_charts__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__pages_login_cadastro_login_cadastro__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__pages_ativos_financeiros_ativos_financeiros__ = __webpack_require__(186);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__pages_pagamentos_pagamentos__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__pages_detalhes_amigos_detalhes_amigos__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__pages_adiciona_divida_adiciona_divida__ = __webpack_require__(216);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__pages_adiciona_emprestimo_adiciona_emprestimo__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__pages_adiciona_financa_adiciona_financa__ = __webpack_require__(218);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__pages_adiciona_meta_adiciona_meta__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52__pages_adiciona_pagamento_adiciona_pagamento__ = __webpack_require__(220);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_53__pages_edita_divida_edita_divida__ = __webpack_require__(224);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_54__pages_edita_emprestimo_edita_emprestimo__ = __webpack_require__(225);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_55__pages_edita_financa_edita_financa__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_56__pages_edita_meta_edita_meta__ = __webpack_require__(227);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_57__pages_edita_pagamento_edita_pagamento__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_58__pages_edita_perfil_edita_perfil__ = __webpack_require__(229);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_59__pages_adiciona_dinheiro_adiciona_dinheiro_module__ = __webpack_require__(357);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_60__pages_realiza_pagamento_realiza_pagamento_module__ = __webpack_require__(378);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_61__components_components_module__ = __webpack_require__(857);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






























































var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_0__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_37__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_40__pages_financas_financas__["a" /* FinancasPage */],
                __WEBPACK_IMPORTED_MODULE_38__pages_perfil_perfil__["a" /* PerfilPage */],
                __WEBPACK_IMPORTED_MODULE_41__pages_amigos_amigos__["a" /* AmigosPage */],
                __WEBPACK_IMPORTED_MODULE_46__pages_pagamentos_pagamentos__["a" /* PagamentosPage */],
                __WEBPACK_IMPORTED_MODULE_39__pages_sobre_sobre__["a" /* SobrePage */],
                __WEBPACK_IMPORTED_MODULE_49__pages_adiciona_emprestimo_adiciona_emprestimo__["a" /* AdicionaEmprestimoPage */],
                __WEBPACK_IMPORTED_MODULE_48__pages_adiciona_divida_adiciona_divida__["a" /* AdicionaDividaPage */],
                __WEBPACK_IMPORTED_MODULE_53__pages_edita_divida_edita_divida__["a" /* EditaDividaPage */],
                __WEBPACK_IMPORTED_MODULE_54__pages_edita_emprestimo_edita_emprestimo__["a" /* EditaEmprestimoPage */],
                __WEBPACK_IMPORTED_MODULE_50__pages_adiciona_financa_adiciona_financa__["a" /* AdicionaFinancaPage */],
                __WEBPACK_IMPORTED_MODULE_55__pages_edita_financa_edita_financa__["a" /* EditaFinancaPage */],
                __WEBPACK_IMPORTED_MODULE_43__pages_financas_charts_financas_charts__["a" /* FinancasChartsPage */],
                __WEBPACK_IMPORTED_MODULE_51__pages_adiciona_meta_adiciona_meta__["a" /* AdicionaMetaPage */],
                __WEBPACK_IMPORTED_MODULE_56__pages_edita_meta_edita_meta__["a" /* EditaMetaPage */],
                __WEBPACK_IMPORTED_MODULE_52__pages_adiciona_pagamento_adiciona_pagamento__["a" /* AdicionaPagamentoPage */],
                __WEBPACK_IMPORTED_MODULE_57__pages_edita_pagamento_edita_pagamento__["a" /* EditaPagamentoPage */],
                __WEBPACK_IMPORTED_MODULE_44__pages_login_cadastro_login_cadastro__["a" /* LoginCadastroPage */],
                __WEBPACK_IMPORTED_MODULE_58__pages_edita_perfil_edita_perfil__["a" /* EditaPerfilPage */],
                __WEBPACK_IMPORTED_MODULE_47__pages_detalhes_amigos_detalhes_amigos__["a" /* DetalhesAmigosPage */],
                __WEBPACK_IMPORTED_MODULE_42__pages_chat_room_chat_room__["a" /* ChatRoomPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["m" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_0__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/adiciona-acordo/adiciona-acordo.module#AdicionaAcordoPageModule', name: 'AdicionaAcordoPage', segment: 'adiciona-acordo', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/adiciona-dinheiro/adiciona-dinheiro.module#AdicionaDinheiroPageModule', name: 'AdicionaDinheiroPage', segment: 'adiciona-dinheiro', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/adiciona-divida/adiciona-divida.module#AdicionaDividaPageModule', name: 'AdicionaDividaPage', segment: 'adiciona-divida', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/adiciona-emprestimo/adiciona-emprestimo.module#AdicionaEmprestimoPageModule', name: 'AdicionaEmprestimoPage', segment: 'adiciona-emprestimo', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/adiciona-financa/adiciona-financa.module#AdicionaFinancaPageModule', name: 'AdicionaFinancaPage', segment: 'adiciona-financa', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/adiciona-meta/adiciona-meta.module#AdicionaMetaPageModule', name: 'AdicionaMetaPage', segment: 'adiciona-meta', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/adiciona-pagamento/adiciona-pagamento.module#AdicionaPagamentoPageModule', name: 'AdicionaPagamentoPage', segment: 'adiciona-pagamento', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/amigos/amigos.module#AmigosPageModule', name: 'AmigosPage', segment: 'amigos', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/ativos-financeiros/ativos-financeiros.module#AtivosFinanceirosPageModule', name: 'AtivosFinanceirosPage', segment: 'ativos-financeiros', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/chat-room/chat-room.module#ChatRoomPageModule', name: 'ChatRoomPage', segment: 'chat-room', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/detalhes-amigos/detalhes-amigos.module#DetalhesAmigosPageModule', name: 'DetalhesAmigosPage', segment: 'detalhes-amigos', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/edita-acordo/edita-acordo.module#EditaAcordoPageModule', name: 'EditaAcordoPage', segment: 'edita-acordo', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/edita-divida/edita-divida.module#EditaDividaPageModule', name: 'EditaDividaPage', segment: 'edita-divida', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/edita-emprestimo/edita-emprestimo.module#EditaEmprestimoPageModule', name: 'EditaEmprestimoPage', segment: 'edita-emprestimo', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/edita-financa/edita-financa.module#EditaFinancaPageModule', name: 'EditaFinancaPage', segment: 'edita-financa', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/edita-meta/edita-meta.module#EditaMetaPageModule', name: 'EditaMetaPage', segment: 'edita-meta', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/edita-pagamento/edita-pagamento.module#EditaPagamentoPageModule', name: 'EditaPagamentoPage', segment: 'edita-pagamento', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/edita-perfil/edita-perfil.module#EditaPerfilPageModule', name: 'EditaPerfilPage', segment: 'edita-perfil', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/financas-charts/financas-charts.module#FinancasChartsPageModule', name: 'FinancasChartsPage', segment: 'financas-charts', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/financas/financas.module#FinancasPageModule', name: 'FinancasPage', segment: 'financas', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/introducao/introducao.module#IntroducaoPageModule', name: 'IntroducaoPage', segment: 'introducao', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/login-cadastro/login-cadastro.module#LoginCadastroPageModule', name: 'LoginCadastroPage', segment: 'login-cadastro', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/mostra-divida/mostra-divida.module#MostraDividaPageModule', name: 'MostraDividaPage', segment: 'mostra-divida', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/mostra-emprestimo/mostra-emprestimo.module#MostraEmprestimoPageModule', name: 'MostraEmprestimoPage', segment: 'mostra-emprestimo', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/pagamentos/pagamentos.module#PagamentosPageModule', name: 'PagamentosPage', segment: 'pagamentos', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/realiza-pagamento/realiza-pagamento.module#RealizaPagamentoPageModule', name: 'RealizaPagamentoPage', segment: 'realiza-pagamento', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/adiciona-amigo/adiciona-amigo.module#AdicionaAmigoPageModule', name: 'AdicionaAmigoPage', segment: 'adiciona-amigo', priority: 'low', defaultHistory: [] }
                    ]
                }),
                __WEBPACK_IMPORTED_MODULE_5_angularfire2__["a" /* AngularFireModule */].initializeApp(__WEBPACK_IMPORTED_MODULE_9__firebase_credentials__["a" /* FIREBASE_CONFIG */]),
                __WEBPACK_IMPORTED_MODULE_17__ionic_storage__["a" /* IonicStorageModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_6_angularfire2_database__["b" /* AngularFireDatabaseModule */],
                __WEBPACK_IMPORTED_MODULE_30__pages_mostra_divida_mostra_divida_module__["MostraDividaPageModule"],
                __WEBPACK_IMPORTED_MODULE_31__pages_mostra_emprestimo_mostra_emprestimo_module__["MostraEmprestimoPageModule"],
                __WEBPACK_IMPORTED_MODULE_7_angularfire2_auth__["b" /* AngularFireAuthModule */],
                __WEBPACK_IMPORTED_MODULE_32__pages_adiciona_acordo_adiciona_acordo_module__["AdicionaAcordoPageModule"],
                __WEBPACK_IMPORTED_MODULE_33__pages_edita_acordo_edita_acordo_module__["EditaAcordoPageModule"],
                __WEBPACK_IMPORTED_MODULE_36__pages_introducao_introducao_module__["IntroducaoPageModule"],
                __WEBPACK_IMPORTED_MODULE_20_brmasker_ionic_3__["a" /* BrMaskerModule */],
                __WEBPACK_IMPORTED_MODULE_19_ng2_charts__["ChartsModule"],
                __WEBPACK_IMPORTED_MODULE_35__pages_ativos_financeiros_ativos_financeiros_module__["AtivosFinanceirosPageModule"],
                __WEBPACK_IMPORTED_MODULE_34__pages_adiciona_amigo_adiciona_amigo_module__["AdicionaAmigoPageModule"],
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_44__pages_login_cadastro_login_cadastro__["a" /* LoginCadastroPage */]),
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_58__pages_edita_perfil_edita_perfil__["a" /* EditaPerfilPage */]),
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_49__pages_adiciona_emprestimo_adiciona_emprestimo__["a" /* AdicionaEmprestimoPage */]),
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_48__pages_adiciona_divida_adiciona_divida__["a" /* AdicionaDividaPage */]),
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_54__pages_edita_emprestimo_edita_emprestimo__["a" /* EditaEmprestimoPage */]),
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_53__pages_edita_divida_edita_divida__["a" /* EditaDividaPage */]),
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_50__pages_adiciona_financa_adiciona_financa__["a" /* AdicionaFinancaPage */]),
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_55__pages_edita_financa_edita_financa__["a" /* EditaFinancaPage */]),
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_51__pages_adiciona_meta_adiciona_meta__["a" /* AdicionaMetaPage */]),
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_56__pages_edita_meta_edita_meta__["a" /* EditaMetaPage */]),
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_52__pages_adiciona_pagamento_adiciona_pagamento__["a" /* AdicionaPagamentoPage */]),
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_57__pages_edita_pagamento_edita_pagamento__["a" /* EditaPagamentoPage */]),
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_47__pages_detalhes_amigos_detalhes_amigos__["a" /* DetalhesAmigosPage */]),
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_42__pages_chat_room_chat_room__["a" /* ChatRoomPage */]),
                __WEBPACK_IMPORTED_MODULE_59__pages_adiciona_dinheiro_adiciona_dinheiro_module__["AdicionaDinheiroPageModule"],
                __WEBPACK_IMPORTED_MODULE_60__pages_realiza_pagamento_realiza_pagamento_module__["RealizaPagamentoPageModule"],
                __WEBPACK_IMPORTED_MODULE_61__components_components_module__["a" /* ComponentsModule */]
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_49__pages_adiciona_emprestimo_adiciona_emprestimo__["a" /* AdicionaEmprestimoPage */],
                __WEBPACK_IMPORTED_MODULE_48__pages_adiciona_divida_adiciona_divida__["a" /* AdicionaDividaPage */],
                __WEBPACK_IMPORTED_MODULE_50__pages_adiciona_financa_adiciona_financa__["a" /* AdicionaFinancaPage */],
                __WEBPACK_IMPORTED_MODULE_53__pages_edita_divida_edita_divida__["a" /* EditaDividaPage */],
                __WEBPACK_IMPORTED_MODULE_54__pages_edita_emprestimo_edita_emprestimo__["a" /* EditaEmprestimoPage */],
                __WEBPACK_IMPORTED_MODULE_55__pages_edita_financa_edita_financa__["a" /* EditaFinancaPage */],
                __WEBPACK_IMPORTED_MODULE_51__pages_adiciona_meta_adiciona_meta__["a" /* AdicionaMetaPage */],
                __WEBPACK_IMPORTED_MODULE_56__pages_edita_meta_edita_meta__["a" /* EditaMetaPage */],
                __WEBPACK_IMPORTED_MODULE_52__pages_adiciona_pagamento_adiciona_pagamento__["a" /* AdicionaPagamentoPage */],
                __WEBPACK_IMPORTED_MODULE_57__pages_edita_pagamento_edita_pagamento__["a" /* EditaPagamentoPage */],
                __WEBPACK_IMPORTED_MODULE_44__pages_login_cadastro_login_cadastro__["a" /* LoginCadastroPage */],
                __WEBPACK_IMPORTED_MODULE_58__pages_edita_perfil_edita_perfil__["a" /* EditaPerfilPage */],
                __WEBPACK_IMPORTED_MODULE_47__pages_detalhes_amigos_detalhes_amigos__["a" /* DetalhesAmigosPage */],
                __WEBPACK_IMPORTED_MODULE_20_brmasker_ionic_3__["a" /* BrMaskerModule */]
            ],
            schemas: [__WEBPACK_IMPORTED_MODULE_3__angular_core__["CUSTOM_ELEMENTS_SCHEMA"], __WEBPACK_IMPORTED_MODULE_3__angular_core__["NO_ERRORS_SCHEMA"]],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4_ionic_angular__["k" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_0__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_37__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_40__pages_financas_financas__["a" /* FinancasPage */],
                __WEBPACK_IMPORTED_MODULE_38__pages_perfil_perfil__["a" /* PerfilPage */],
                __WEBPACK_IMPORTED_MODULE_41__pages_amigos_amigos__["a" /* AmigosPage */],
                __WEBPACK_IMPORTED_MODULE_46__pages_pagamentos_pagamentos__["a" /* PagamentosPage */],
                __WEBPACK_IMPORTED_MODULE_39__pages_sobre_sobre__["a" /* SobrePage */],
                __WEBPACK_IMPORTED_MODULE_43__pages_financas_charts_financas_charts__["a" /* FinancasChartsPage */],
                __WEBPACK_IMPORTED_MODULE_45__pages_ativos_financeiros_ativos_financeiros__["a" /* AtivosFinanceirosPage */],
                __WEBPACK_IMPORTED_MODULE_39__pages_sobre_sobre__["a" /* SobrePage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_11__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_12__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_13__ionic_native_camera__["a" /* Camera */],
                __WEBPACK_IMPORTED_MODULE_15__ionic_native_file__["a" /* File */],
                __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */],
                __WEBPACK_IMPORTED_MODULE_14__ionic_native_file_path__["a" /* FilePath */],
                { provide: __WEBPACK_IMPORTED_MODULE_3__angular_core__["ErrorHandler"], useClass: __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["l" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_26__providers_divida_service_divida_service__["a" /* DividaServiceProvider */],
                __WEBPACK_IMPORTED_MODULE_21__providers_auth_auth__["a" /* AuthProvider */],
                __WEBPACK_IMPORTED_MODULE_16__ionic_native_onesignal__["a" /* OneSignal */],
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["b" /* AlertController */],
                __WEBPACK_IMPORTED_MODULE_27__providers_acordo_service_acordo_service__["a" /* AcordoServiceProvider */],
                __WEBPACK_IMPORTED_MODULE_24__providers_notification_notification__["a" /* NotificationProvider */],
                __WEBPACK_IMPORTED_MODULE_28__providers_financa_service_financa_service__["a" /* FinancaServiceProvider */],
                __WEBPACK_IMPORTED_MODULE_23__providers_meta_service_meta_service__["a" /* MetaServiceProvider */],
                __WEBPACK_IMPORTED_MODULE_25__providers_amigos_service_amigos_service__["a" /* AmigosServiceProvider */],
                __WEBPACK_IMPORTED_MODULE_29__providers_pagamento_service_pagamento_service__["a" /* PagamentoServiceProvider */],
                __WEBPACK_IMPORTED_MODULE_10_ionic_img_viewer__["a" /* ImageViewerController */],
                __WEBPACK_IMPORTED_MODULE_18__ionic_native_image_picker__["a" /* ImagePicker */],
                __WEBPACK_IMPORTED_MODULE_22__providers_chat_service_chat_service__["a" /* ChatService */],
                __WEBPACK_IMPORTED_MODULE_8_angularfire2_firestore__["a" /* AngularFirestore */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 674:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(419);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(188);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_perfil_perfil__ = __webpack_require__(420);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_sobre_sobre__ = __webpack_require__(421);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_login_cadastro_login_cadastro__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_onesignal__ = __webpack_require__(183);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__providers_notification_notification__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_introducao_introducao__ = __webpack_require__(368);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_storage__ = __webpack_require__(189);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_financas_financas__ = __webpack_require__(231);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_amigos_amigos__ = __webpack_require__(221);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_financas_charts_financas_charts__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_ativos_financeiros_ativos_financeiros__ = __webpack_require__(186);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_pagamentos_pagamentos__ = __webpack_require__(232);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


















var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, autenticacao, notification, oneSignal, storage) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.autenticacao = autenticacao;
        this.notification = notification;
        this.oneSignal = oneSignal;
        this.storage = storage;
        this.setPages();
        this.setupApp();
    }
    MyApp.prototype.setupApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.autenticacao.retornaUserObservable().subscribe(function (user) {
                if (user) {
                    if (_this.platform.is("cordova")) {
                        _this.notification.iniciarOneSignal().then(function (result) {
                            _this.autenticacao.salvarOneSignalInfo(result.userId, result.pushToken);
                        });
                        _this.splashScreen.hide();
                        _this.statusBar.backgroundColorByHexString("#006400");
                    }
                    _this.rootPage = __WEBPACK_IMPORTED_MODULE_15__pages_financas_charts_financas_charts__["a" /* FinancasChartsPage */];
                }
                else {
                    _this.storage.get('introducaoVista').then(function (introducaoVista) {
                        if (!introducaoVista) {
                            _this.rootPage = __WEBPACK_IMPORTED_MODULE_11__pages_introducao_introducao__["a" /* IntroducaoPage */];
                        }
                        else {
                            _this.rootPage = __WEBPACK_IMPORTED_MODULE_8__pages_login_cadastro_login_cadastro__["a" /* LoginCadastroPage */];
                        }
                    });
                }
            });
        });
    };
    MyApp.prototype.setPages = function () {
        this.pages = [
            { title: 'Estatísticas', component: __WEBPACK_IMPORTED_MODULE_15__pages_financas_charts_financas_charts__["a" /* FinancasChartsPage */] },
            { title: 'Minhas finanças', component: __WEBPACK_IMPORTED_MODULE_13__pages_financas_financas__["a" /* FinancasPage */] },
            { title: 'Dívidas e empréstimos', component: __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */] },
            { title: 'Pagamentos', component: __WEBPACK_IMPORTED_MODULE_17__pages_pagamentos_pagamentos__["a" /* PagamentosPage */] },
            { title: 'Ativos financeiros', component: __WEBPACK_IMPORTED_MODULE_16__pages_ativos_financeiros_ativos_financeiros__["a" /* AtivosFinanceirosPage */] },
            { title: 'Perfil', component: __WEBPACK_IMPORTED_MODULE_5__pages_perfil_perfil__["a" /* PerfilPage */] },
            { title: 'Amigos', component: __WEBPACK_IMPORTED_MODULE_14__pages_amigos_amigos__["a" /* AmigosPage */] },
            { title: 'Sobre', component: __WEBPACK_IMPORTED_MODULE_6__pages_sobre_sobre__["a" /* SobrePage */] }
        ];
    };
    MyApp.prototype.logout = function () {
        this.autenticacao.logout();
        this.rootPage = __WEBPACK_IMPORTED_MODULE_8__pages_login_cadastro_login_cadastro__["a" /* LoginCadastroPage */];
    };
    MyApp.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/app/app.html"*/'<ion-menu [content]="content">\n\n  <ion-header color="corPrimaria">\n\n    <ion-toolbar>\n\n      <ion-title>Menu</ion-title>\n\n    </ion-toolbar>\n\n  </ion-header>\n\n\n\n  <ion-content>\n\n    <ion-list no-lines>\n\n      <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">\n\n        {{p.title}}\n\n      </button>\n\n      <button menuClose ion-item (click)="logout()">\n\n        Sair\n\n      </button>\n\n    </ion-list>\n\n  </ion-content>\n\n\n\n</ion-menu>\n\n\n\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>\n\n'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["t" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_7__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_10__providers_notification_notification__["a" /* NotificationProvider */],
            __WEBPACK_IMPORTED_MODULE_9__ionic_native_onesignal__["a" /* OneSignal */],
            __WEBPACK_IMPORTED_MODULE_12__ionic_storage__["b" /* Storage */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 721:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 723:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 755:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 756:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 809:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Cartao; });
var Cartao = /** @class */ (function () {
    function Cartao() {
    }
    return Cartao;
}());

//# sourceMappingURL=cartao.js.map

/***/ }),

/***/ 849:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FIREBASE_CONFIG; });
var FIREBASE_CONFIG = {
    apiKey: "AIzaSyD60kBs3aYkGk8ayEFM1mrTBPB2Q2X-UvE",
    authDomain: "cademeudinheiro-7e411.firebaseapp.com",
    databaseURL: "https://cademeudinheiro-7e411.firebaseio.com",
    projectId: "cademeudinheiro-7e411",
    storageBucket: "cademeudinheiro-7e411.appspot.com",
    messagingSenderId: "580258323760"
};
//# sourceMappingURL=firebase.credentials.js.map

/***/ }),

/***/ 856:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 423,
	"./af.js": 423,
	"./ar": 424,
	"./ar-dz": 425,
	"./ar-dz.js": 425,
	"./ar-kw": 426,
	"./ar-kw.js": 426,
	"./ar-ly": 427,
	"./ar-ly.js": 427,
	"./ar-ma": 428,
	"./ar-ma.js": 428,
	"./ar-sa": 429,
	"./ar-sa.js": 429,
	"./ar-tn": 430,
	"./ar-tn.js": 430,
	"./ar.js": 424,
	"./az": 431,
	"./az.js": 431,
	"./be": 432,
	"./be.js": 432,
	"./bg": 433,
	"./bg.js": 433,
	"./bm": 434,
	"./bm.js": 434,
	"./bn": 435,
	"./bn.js": 435,
	"./bo": 436,
	"./bo.js": 436,
	"./br": 437,
	"./br.js": 437,
	"./bs": 438,
	"./bs.js": 438,
	"./ca": 439,
	"./ca.js": 439,
	"./cs": 440,
	"./cs.js": 440,
	"./cv": 441,
	"./cv.js": 441,
	"./cy": 442,
	"./cy.js": 442,
	"./da": 443,
	"./da.js": 443,
	"./de": 444,
	"./de-at": 445,
	"./de-at.js": 445,
	"./de-ch": 446,
	"./de-ch.js": 446,
	"./de.js": 444,
	"./dv": 447,
	"./dv.js": 447,
	"./el": 448,
	"./el.js": 448,
	"./en-SG": 449,
	"./en-SG.js": 449,
	"./en-au": 450,
	"./en-au.js": 450,
	"./en-ca": 451,
	"./en-ca.js": 451,
	"./en-gb": 452,
	"./en-gb.js": 452,
	"./en-ie": 453,
	"./en-ie.js": 453,
	"./en-il": 454,
	"./en-il.js": 454,
	"./en-nz": 455,
	"./en-nz.js": 455,
	"./eo": 456,
	"./eo.js": 456,
	"./es": 457,
	"./es-do": 458,
	"./es-do.js": 458,
	"./es-us": 459,
	"./es-us.js": 459,
	"./es.js": 457,
	"./et": 460,
	"./et.js": 460,
	"./eu": 461,
	"./eu.js": 461,
	"./fa": 462,
	"./fa.js": 462,
	"./fi": 463,
	"./fi.js": 463,
	"./fo": 464,
	"./fo.js": 464,
	"./fr": 465,
	"./fr-ca": 466,
	"./fr-ca.js": 466,
	"./fr-ch": 467,
	"./fr-ch.js": 467,
	"./fr.js": 465,
	"./fy": 468,
	"./fy.js": 468,
	"./ga": 469,
	"./ga.js": 469,
	"./gd": 470,
	"./gd.js": 470,
	"./gl": 471,
	"./gl.js": 471,
	"./gom-latn": 472,
	"./gom-latn.js": 472,
	"./gu": 473,
	"./gu.js": 473,
	"./he": 474,
	"./he.js": 474,
	"./hi": 475,
	"./hi.js": 475,
	"./hr": 476,
	"./hr.js": 476,
	"./hu": 477,
	"./hu.js": 477,
	"./hy-am": 478,
	"./hy-am.js": 478,
	"./id": 479,
	"./id.js": 479,
	"./is": 480,
	"./is.js": 480,
	"./it": 481,
	"./it-ch": 482,
	"./it-ch.js": 482,
	"./it.js": 481,
	"./ja": 483,
	"./ja.js": 483,
	"./jv": 484,
	"./jv.js": 484,
	"./ka": 485,
	"./ka.js": 485,
	"./kk": 486,
	"./kk.js": 486,
	"./km": 487,
	"./km.js": 487,
	"./kn": 488,
	"./kn.js": 488,
	"./ko": 489,
	"./ko.js": 489,
	"./ku": 490,
	"./ku.js": 490,
	"./ky": 491,
	"./ky.js": 491,
	"./lb": 492,
	"./lb.js": 492,
	"./lo": 493,
	"./lo.js": 493,
	"./lt": 494,
	"./lt.js": 494,
	"./lv": 495,
	"./lv.js": 495,
	"./me": 496,
	"./me.js": 496,
	"./mi": 497,
	"./mi.js": 497,
	"./mk": 498,
	"./mk.js": 498,
	"./ml": 499,
	"./ml.js": 499,
	"./mn": 500,
	"./mn.js": 500,
	"./mr": 501,
	"./mr.js": 501,
	"./ms": 502,
	"./ms-my": 503,
	"./ms-my.js": 503,
	"./ms.js": 502,
	"./mt": 504,
	"./mt.js": 504,
	"./my": 505,
	"./my.js": 505,
	"./nb": 506,
	"./nb.js": 506,
	"./ne": 507,
	"./ne.js": 507,
	"./nl": 508,
	"./nl-be": 509,
	"./nl-be.js": 509,
	"./nl.js": 508,
	"./nn": 510,
	"./nn.js": 510,
	"./pa-in": 511,
	"./pa-in.js": 511,
	"./pl": 512,
	"./pl.js": 512,
	"./pt": 513,
	"./pt-br": 514,
	"./pt-br.js": 514,
	"./pt.js": 513,
	"./ro": 515,
	"./ro.js": 515,
	"./ru": 516,
	"./ru.js": 516,
	"./sd": 517,
	"./sd.js": 517,
	"./se": 518,
	"./se.js": 518,
	"./si": 519,
	"./si.js": 519,
	"./sk": 520,
	"./sk.js": 520,
	"./sl": 521,
	"./sl.js": 521,
	"./sq": 522,
	"./sq.js": 522,
	"./sr": 523,
	"./sr-cyrl": 524,
	"./sr-cyrl.js": 524,
	"./sr.js": 523,
	"./ss": 525,
	"./ss.js": 525,
	"./sv": 526,
	"./sv.js": 526,
	"./sw": 527,
	"./sw.js": 527,
	"./ta": 528,
	"./ta.js": 528,
	"./te": 529,
	"./te.js": 529,
	"./tet": 530,
	"./tet.js": 530,
	"./tg": 531,
	"./tg.js": 531,
	"./th": 532,
	"./th.js": 532,
	"./tl-ph": 533,
	"./tl-ph.js": 533,
	"./tlh": 534,
	"./tlh.js": 534,
	"./tr": 535,
	"./tr.js": 535,
	"./tzl": 536,
	"./tzl.js": 536,
	"./tzm": 537,
	"./tzm-latn": 538,
	"./tzm-latn.js": 538,
	"./tzm.js": 537,
	"./ug-cn": 539,
	"./ug-cn.js": 539,
	"./uk": 540,
	"./uk.js": 540,
	"./ur": 541,
	"./ur.js": 541,
	"./uz": 542,
	"./uz-latn": 543,
	"./uz-latn.js": 543,
	"./uz.js": 542,
	"./vi": 544,
	"./vi.js": 544,
	"./x-pseudo": 545,
	"./x-pseudo.js": 545,
	"./yo": 546,
	"./yo.js": 546,
	"./zh-cn": 547,
	"./zh-cn.js": 547,
	"./zh-hk": 548,
	"./zh-hk.js": 548,
	"./zh-tw": 549,
	"./zh-tw.js": 549
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 856;

/***/ }),

/***/ 857:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__item_card_item_card__ = __webpack_require__(858);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(5);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var ComponentsModule = /** @class */ (function () {
    function ComponentsModule() {
    }
    ComponentsModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [__WEBPACK_IMPORTED_MODULE_1__item_card_item_card__["a" /* ItemCardComponent */]],
            imports: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["m" /* IonicModule */]],
            exports: [__WEBPACK_IMPORTED_MODULE_1__item_card_item_card__["a" /* ItemCardComponent */]]
        })
    ], ComponentsModule);
    return ComponentsModule;
}());

//# sourceMappingURL=components.module.js.map

/***/ }),

/***/ 858:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ItemCardComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ItemCardComponent = /** @class */ (function () {
    function ItemCardComponent() {
    }
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], ItemCardComponent.prototype, "icon", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], ItemCardComponent.prototype, "iconColor", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], ItemCardComponent.prototype, "description", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], ItemCardComponent.prototype, "subtitle", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], ItemCardComponent.prototype, "secSubtitle", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], ItemCardComponent.prototype, "subtitleClass", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Array)
    ], ItemCardComponent.prototype, "btns", void 0);
    ItemCardComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'item-card',template:/*ion-inline-start:"/home/victor/Documentos/CadeMeuDinheiro/src/components/item-card/item-card.html"*/'<ion-card>\n  <ion-card-content class="item-card__content">\n    <ion-icon class="icon" name="{{icon}}" color="{{iconColor}}"></ion-icon>\n    <h4 class="description">{{description}}</h4>\n    <p class="subtitle" ngClass="{{subtitleClass}}">{{subtitle}}</p>\n    <p class="second-subtitle">{{secSubtitle}}</p>\n  </ion-card-content>\n  <div class="btns">\n    <button *ngFor="let btn of btns; trackBy: trackById" ion-button clear class="item-card__btn"\n      color="{{btn.color}}" (click)="btn.action()">\n      <ion-icon name="{{btn.icon}}"></ion-icon>\n      <span>{{btn.title}}</span>\n    </button>\n  </div>\n</ion-card>'/*ion-inline-end:"/home/victor/Documentos/CadeMeuDinheiro/src/components/item-card/item-card.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], ItemCardComponent);
    return ItemCardComponent;
}());

//# sourceMappingURL=item-card.js.map

/***/ }),

/***/ 89:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AcordoServiceProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__divida_service_divida_service__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__notification_notification__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_database__ = __webpack_require__(52);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// import { HttpClient } from '@angular/common/http';





var AcordoServiceProvider = /** @class */ (function () {
    function AcordoServiceProvider(db, dividaProvider, notificacao, authProvider) {
        this.db = db;
        this.dividaProvider = dividaProvider;
        this.notificacao = notificacao;
        this.authProvider = authProvider;
    }
    AcordoServiceProvider.prototype.adicionaAcordo = function (divida, acordo, tipo) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (divida.acordos) {
                divida.acordos.push(acordo);
            }
            else {
                divida.acordos = [acordo];
            }
            _this.editaAcordoEmDivEmp(divida, acordo, tipo, "adicionou").then(function (_) {
                resolve();
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    AcordoServiceProvider.prototype.fechaAcordo = function (divida, acordo, tipo) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var index = divida.acordos.indexOf(acordo);
            divida.acordos.splice(index, 1);
            _this.editaAcordoEmDivEmp(divida, acordo, tipo, "fechou").then(function (_) {
                resolve();
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    AcordoServiceProvider.prototype.editaAcordo = function (divida, acordo, tipo) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var index = divida.acordos.indexOf(acordo);
            divida.acordos[index] = acordo;
            _this.editaAcordoEmDivEmp(divida, acordo, tipo, "editou").then(function (_) {
                resolve();
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    AcordoServiceProvider.prototype.editaAcordoEmDivEmp = function (divida, acordo, tipo, acao) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.list("divida-list").update(divida.key, divida).then(function (_) {
                _this.notificaAcordoUsuario(divida, acordo, acao, tipo)
                    .then(function (_) { return resolve(divida); });
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    AcordoServiceProvider.prototype.notificaAcordoUsuario = function (divida, acordo, acao, tipo) {
        var _this = this;
        var ehEmprestimo = tipo === "emprestimo";
        var nomeUsuarioNotificado = ehEmprestimo ? divida.nomeUsuarioDevedor : divida.nomeUsuarioEmprestador;
        var nomeEditor = ehEmprestimo ? divida.nomeUsuarioEmprestador : divida.nomeUsuarioDevedor;
        return new Promise(function (resolve) {
            _this.authProvider.getUsuarioRef(nomeUsuarioNotificado).then(function (usuario) {
                var usuarioNotificado = usuario;
                if (Object.keys(usuarioNotificado).length > 0 && usuarioNotificado.userId != null) {
                    _this.enviarNotificacao(usuarioNotificado.userId, nomeEditor, acordo, acao);
                }
                resolve(divida);
            }).catch(function (_) {
                resolve(divida);
            });
        });
    };
    AcordoServiceProvider.prototype.enviarNotificacao = function (usuarioId, nomeEditor, acordo, acao) {
        this.notificacao.enviarNotificacao(usuarioId, nomeEditor + " " + acao + " um acordo.", this.getTextoData(acordo.data) + " às " + acordo.hora + " em " + acordo.local);
    };
    AcordoServiceProvider.prototype.getTextoData = function (data) {
        var options = { weekday: "long", month: 'long', day: '2-digit' };
        var dataSeparada = data.toString().split("-");
        var ano = Number(dataSeparada[0]);
        var mes = Number(dataSeparada[1]) - 1;
        var dia = Number(dataSeparada[2]);
        var dataAjustada = new Date(ano, mes, dia);
        return dataAjustada.toLocaleDateString("pt-br", options);
    };
    AcordoServiceProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4_angularfire2_database__["a" /* AngularFireDatabase */],
            __WEBPACK_IMPORTED_MODULE_1__divida_service_divida_service__["a" /* DividaServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_2__notification_notification__["a" /* NotificationProvider */],
            __WEBPACK_IMPORTED_MODULE_3__auth_auth__["a" /* AuthProvider */]])
    ], AcordoServiceProvider);
    return AcordoServiceProvider;
}());

//# sourceMappingURL=acordo-service.js.map

/***/ }),

/***/ 98:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MetaServiceProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth_auth__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__notification_notification__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__financa_service_financa_service__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_VerificacaoEnum__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Helper_Utils__ = __webpack_require__(66);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var MetaServiceProvider = /** @class */ (function () {
    function MetaServiceProvider(db, auth, notificacao, financasService) {
        this.db = db;
        this.auth = auth;
        this.notificacao = notificacao;
        this.financasService = financasService;
        this.metas = [];
        this.financas = [];
        this.carregaFinancas();
        this.recebeMetasFB();
    }
    MetaServiceProvider.prototype.adicionaMetaFB = function (meta) {
        var _this = this;
        meta.limite = __WEBPACK_IMPORTED_MODULE_6__Helper_Utils__["a" /* default */].formataValorFB(meta.limite);
        return new Promise(function (resolve) {
            _this.getMetaListRef().push(meta)
                .then(function (resp) {
                var novaMeta = _this.setMetaKey(meta, resp.key);
                resolve(novaMeta);
            });
        });
    };
    MetaServiceProvider.prototype.editaMetaFB = function (meta) {
        meta.limite = __WEBPACK_IMPORTED_MODULE_6__Helper_Utils__["a" /* default */].formataValorFB(meta.limite);
        return this.getMetaListRef().update(meta.key, meta);
    };
    MetaServiceProvider.prototype.removeMetaFB = function (meta) {
        return this.getMetaListRef().remove(meta.key);
    };
    MetaServiceProvider.prototype.recebeMetasFB = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.getMetaObjRef()
                .valueChanges()
                .subscribe(function (metas) {
                _this.metas = metas && _this.mapFinObjectToList(metas) || [];
                resolve(_this.metas);
            });
        });
    };
    MetaServiceProvider.prototype.carregaFinancas = function () {
        var _this = this;
        this.financasService.getFinancaListRef().valueChanges().subscribe(function (financas) {
            _this.financas = _this.filtraFinancasConfirmadas(financas);
        });
    };
    MetaServiceProvider.prototype.filtraFinancasConfirmadas = function (lista) {
        return lista.filter(function (x) { return x.verificacao === __WEBPACK_IMPORTED_MODULE_5__models_VerificacaoEnum__["a" /* Verificacao */].Confirmado; });
    };
    MetaServiceProvider.prototype.debitaFinanca = function (financa) {
        this.financas = this.financas.filter(function (f) { return f.key !== financa.key; });
        this.verificaMetas(financa.categoria);
    };
    MetaServiceProvider.prototype.verificaMetas = function (categoria) {
        var _this = this;
        this.metas.filter(function (meta) { return meta.categoria === categoria; })
            .map(function (meta) {
            _this.notificaMetas(_this.calcProgessoMeta(meta), categoria);
        });
    };
    MetaServiceProvider.prototype.calcProgessoMeta = function (meta) {
        var porcentagem = parseFloat(((this.calcTotalMeta(meta) / meta.limite) * 100).toFixed(2));
        return porcentagem >= 100 ? 100 : porcentagem;
    };
    MetaServiceProvider.prototype.calcTotalMeta = function (meta) {
        var mesAtual = new Date().getMonth();
        return this.financas
            .filter(function (f) { return f.categoria === meta.categoria && new Date(f.data).getMonth() === mesAtual; })
            .reduce(function (soma, financa) { return soma + financa.valor; }, 0.0);
    };
    MetaServiceProvider.prototype.notificaMetas = function (progresso, categoria) {
        var titulo, msg = "";
        if (progresso >= 100) {
            titulo = "Meta alcançada";
            msg = "A meta estipulada para a categoria " +
                categoria + " foi alcançada";
            this.enviarNotificacao(titulo, msg);
        }
        else if (progresso >= 75) {
            titulo = "Meta próxima do limite";
            msg = "A meta estipulada para a categoria " +
                categoria + " está prestes de ser alcançada";
            this.enviarNotificacao(titulo, msg);
        }
    };
    MetaServiceProvider.prototype.enviarNotificacao = function (titulo, msg) {
        var _this = this;
        this.auth.getUserId()
            .then(function (userId) {
            _this.notificacao.enviarNotificacao(userId, titulo, msg);
        });
    };
    MetaServiceProvider.prototype.getMetaListRef = function () {
        return this.db.list(this.getMetaPath());
    };
    MetaServiceProvider.prototype.getMetaObjRef = function () {
        return this.db.object(this.getMetaPath());
    };
    MetaServiceProvider.prototype.getMetaPath = function () {
        return "meta-list/" + this.auth.getUID();
    };
    MetaServiceProvider.prototype.mapFinObjectToList = function (metaObj) {
        var _this = this;
        return Object.keys(metaObj)
            .map(function (key) {
            var meta = metaObj[key];
            return _this.setMetaKey(meta, key);
        });
    };
    MetaServiceProvider.prototype.setMetaKey = function (meta, key) {
        return __assign({}, meta, { key: key });
    };
    MetaServiceProvider.prototype.formataValor = function (valor) {
        return Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
    };
    MetaServiceProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_angularfire2_database__["a" /* AngularFireDatabase */],
            __WEBPACK_IMPORTED_MODULE_2__auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_3__notification_notification__["a" /* NotificationProvider */],
            __WEBPACK_IMPORTED_MODULE_4__financa_service_financa_service__["a" /* FinancaServiceProvider */]])
    ], MetaServiceProvider);
    return MetaServiceProvider;
}());

//# sourceMappingURL=meta-service.js.map

/***/ })

},[550]);
//# sourceMappingURL=main.js.map