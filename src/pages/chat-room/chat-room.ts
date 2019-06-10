import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatService } from '../../providers/chat-service/chat-service';
import { Usuario } from '../../models/usuario';
import { Chat } from '../../models/chat';
import { AuthProvider } from '../../providers/auth/auth';



@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chat-room.html',
})
export class ChatRoomPage {

  usuarioLogado: Usuario;
  amigo: Usuario;
  chats: Chat[] = [];
  message: string;
  chatPayload: Chat;
  intervalScroll;
  @ViewChild("content") content: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private chatService: ChatService,
    private auth: AuthProvider) {
      this.loadUsers();
  }

  ionViewDidEnter() {
    this.scrollToBottom();
  }

  ionViewDidLoad() {
    this.loadChats();
  }

  private loadChats() {
    this.chatService.carregarChats()
      .valueChanges()
      .subscribe(chats => {
        this.chats = chats;
      });
  }

  addChat() {
    if(this.message && this.message.trim() !== "") {
      this.chatPayload = {
        message: this.message,
        sender: this.usuarioLogado.email,
        pair: this.chatService.currentChatPairId,
        time: new Date().getTime()
      };

      this.chatService
        .adicionaChat(this.chatPayload)
        .then(() => {
					//Clear message box
          this.message = "";

          //Scroll to bottom
          this.scrollToBottom()
        });
    }
  }
  
  private loadUsers() {
    this.amigo = this.chatService.currentChatPartner;
    
    this.auth.getUsuarioLogado()
    .then(user => {
      this.usuarioLogado = user as Usuario;
    });
  }

  private scrollToBottom() {
    this.content.scrollToBottom(300); //300ms 
  }


  isChatPartner(senderEmail:string) {
    return senderEmail === this.amigo.email;
  }

}
