import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';

// Ionic-Native
import { ImagePicker } from "@ionic-native/image-picker";
import { FileTransfer, FileUploadOptions, FileTransferObject } from "@ionic-native/file-transfer";

// Providers
import { BaseUrl } from "../../../providers/base-url";
import { UserServiceProvider } from "../../../providers/user-service/user-service";

/**
 * Generated class for the MahasiswaProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mahasiswa-profile',
  templateUrl: 'mahasiswa-profile.html',
})
export class MahasiswaProfilePage {
  urlMaster: string = BaseUrl.BASE_API_URL;
  loading: Loading;
  image;
  user;
  accessToken;
  showError: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private userService: UserServiceProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private imagePicker: ImagePicker,
    private transfer: FileTransfer
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MahasiswaProfilePage');
    this.getUser();
  }

  getUser() {
    this.showLoading()
    Observable.fromPromise(this.storage.get("accessToken"))
      .flatMap(a => {
        this.accessToken = a
        return this.userService.findById(a)
      })
      .subscribe(u => {
        this.user = u
        this.user.profile_image_url = this.urlMaster+this.user.profile_image_url
      },
      e => {
        this.showToast("Koneksi error")
        this.showError = true;
      })
    this.loading.dismiss()
  }

  updateUser() {
    // this.showToast(this.user.principalType)
    this.userService.updateUser({profile_image_url: "/api/Attachments/tugas/download/bf423ea1-25d5-441b-8eaa-63b2856c4751.jpg"}, this.accessToken)
      .subscribe(a => {
        this.showToast(a);
      },e => {
        this.showToast("Error : " + e)
      })
  }

  changeProfilePicture() {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: 'file',
      headers: {}
    }
    var bool;

    Observable.fromPromise(this.imagePicker.hasReadPermission())
      .flatMap(
        a => {
          return Observable.fromPromise(this.imagePicker.getPictures({maximumImagesCount: 1}))
        })
      .flatMap(a => {
        return Observable.fromPromise(fileTransfer.upload(a[0], this.urlMaster+'/api/AttachmentMetadata/upload', options))
      })
      .map(a => {
        this.image = a
      })
      .flatMap(a => {
        return this.userService.updateUser({profile_image_url: this.image.url}, this.accessToken)
      })
      .subscribe(v => {
        this.user.profile_image_url = this.urlMaster+this.image.url
        this.showToast("Foto profil berhasil di update")
      },
      e => {
        this.showToast("Terjadi kesalahan, mohon ulangi kembali")
      })
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Mohon Tunggu...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 5000,
      position: 'bottom'
    });

    toast.present();
  }

}
