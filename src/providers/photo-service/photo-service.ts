import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AuthProvider } from '../auth/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase/app';
import 'firebase/storage';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';

declare var window: any;

@Injectable()
export class PhotoServiceProvider {

  private basePath: string = 'fotosUsuarios/';

  private opcoesCamera: CameraOptions = {
    allowEdit: true,
    saveToPhotoAlbum: true,
    targetWidth: 1000,
    targetHeight: 1000,
    sourceType: this.camera.PictureSourceType.CAMERA,
    destinationType: this.camera.DestinationType.FILE_URI,
  }

  private opcoesGaleria: CameraOptions = {
    allowEdit: true,
    destinationType: this.camera.DestinationType.FILE_URI,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    targetWidth: 1000,
    targetHeight: 1000,
    correctOrientation: true
  }

  constructor(
    public camera: Camera,
    public auth: AuthProvider,
    public file: File,
    public filePath: FilePath,
    public database: AngularFireDatabase) {
  }

  retornaFoto(fonte) {
    if (fonte == "Camera") {
      return this.recebeFoto(this.opcoesCamera);
    } else {
      return this.recebeFoto(this.opcoesGaleria);
    }
  }

  recebeFoto(tipo: CameraOptions) {
    return this.camera.getPicture(tipo).then((imagePath) => {
      return imagePath;
    })
  }

  realizaUpload(caminhoFoto: string) {
    return new Promise((resolve, reject) => {
      return this.converteImagemParaBlob(caminhoFoto).then((imageBlob) => {
        return this.salvarNoStorage(imageBlob)//upload the blob
      }).then((url) => {
        return this.salvarLinkNoDB(url)
      }).then(() => {
        resolve();
      }, (_error) => {
        reject(_error);
      });
    });
  }

  converteImagemParaBlob(_imagePath) {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(_imagePath, (fileEntry) => {
        fileEntry.file((resFile) => {
          var reader = new FileReader();
          reader.onloadend = (evt: any) => {
            var imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
            imgBlob.name = 'amostra.jpg';
            resolve(imgBlob);
          };
          reader.onerror = (e) => {
            console.log('Falha ao ler arquivo: ' + e.toString());
            reject(e);
          };
          reader.readAsArrayBuffer(resFile);
        });
      });
    });
  }

  salvarNoStorage(imgBlob: any) {
    var userUID = this.auth.getUID();
    return new Promise((resolve, reject) => {
      let storageRef = firebase.storage().ref(this.basePath + userUID + '.jpg');
      let metadata: firebase.storage.UploadMetadata = {
        contentType: 'image/jpeg',
      };

      let uploadTask = storageRef.put(imgBlob, metadata);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
        },
        (error) => {
          // upload failed
          reject(error);
        },
        () => {
          // upload success
          resolve(this.basePath + userUID + '.jpg');
        });
    });
  }

  salvarLinkNoDB(url) {
    return new Promise((resolve, reject) => {
      this.auth.salvarFoto(url).then(result => {
        resolve();
      }).catch(error => {
        reject(error);
      });

    });
  }


}
