import { Injectable } from '@angular/core';

import { Chat } from '../../models/chat';
import { Usuario } from '../../models/usuario';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthProvider } from '../auth/auth';
import { NotificationProvider } from '../notification/notification';


@Injectable()
export class ChatService {

  chats: Chat[] = [];

  currentChatPairId: string;
  currentChatPartner: Usuario;

  constructor(public db: AngularFireDatabase,
		private auth: AuthProvider,
		private notification: NotificationProvider) {
    
  }

  adicionaChat(chat: Chat) {
		const MAX_MSG_LENGTH = 40;
		const titulo = `Nova mensagem de ${this.currentChatPartner.nome}`;
		const mensagem = chat.message.slice(0, MAX_MSG_LENGTH);

		return new Promise(resolve => {
			this.db.list<Chat>('chats/' + this.currentChatPairId).push(chat).then(_ => {
					this.notification.enviarNotificacao(this.currentChatPartner.userId, titulo, mensagem);
					resolve();
				});
		});
  }

  carregarChats() {
    return this.db.list<Chat>('chats/' + this.currentChatPairId);
  }

  setupChat(user: Usuario, other: Usuario) {
    this.setPartner(other);
    return this.criarPairId(user, other);
	}

  private criarPairId(user: Usuario, other: Usuario) {
    const userKeyPromise = this.auth.getUsuarioKey(user.username);
    const otherKeyPromise = this.auth.getUsuarioKey(other.username);

    return new Promise(resolve => {
      Promise.all([userKeyPromise, otherKeyPromise])
        .then(keys => {
          const userKey = keys[0];
          const otherKey = keys[1];
  
          if(userKey < otherKey) {
            this.currentChatPairId = `${userKey}|${otherKey}`;
          } else {
            this.currentChatPairId = `${otherKey}|${userKey}`;
          }
          resolve();
        });
    });
  }

  private setPartner(partner: Usuario) {
    this.currentChatPartner = partner;
  }

}
