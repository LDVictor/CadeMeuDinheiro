import { Injectable } from '@angular/core';
import { OneSignal, OSNotification } from '@ionic-native/onesignal';
import { Platform } from 'ionic-angular';

@Injectable()
export class NotificationProvider {

  cordova: boolean;
  url: string = "https://onesignal.com/api/v1/notifications";

  constructor(
    public oneSignal: OneSignal,
    public platform: Platform) {
    this.cordova = this.platform.is('cordova');
  }

  public iniciarOneSignal() {
    if (this.cordova) {

      this.oneSignal.startInit('d0ce017c-912b-4859-8ae2-b707856f87de', '580258323760');
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
      this.oneSignal.endInit();

      return this.oneSignal.getIds().then(result => {
        return result;
      });

    }
  }

  public enviarNotificacao(id: string, titulo: string, msg: string) {
    if (this.cordova) {
      var ids: string[] = [];
      ids.push(id);

      var notificacao: OSNotification = {
        contents: {
          "en": msg
        },
        include_player_ids: ids,
        headings: {
          "en": titulo
        },
        android_accent_color: "#FF008000",
        android_led_color: "#FF008000", 
      }
      this.oneSignal.postNotification(notificacao);
    }
  }
    
}
