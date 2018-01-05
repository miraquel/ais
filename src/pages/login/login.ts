import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from "../../providers/user-service/user-service";
import { Storage } from "@ionic/storage";
import { ScreenOrientation } from "@ionic-native/screen-orientation";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loading: Loading;
  rootPage = "MahasiswaHomePage";
  credentials = {
    email: '',
    password: '',
    userType: ''
  };
  user;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthServiceProvider,
    private userService: UserServiceProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private storage: Storage,
    private screenOrientation: ScreenOrientation
  ) {
    // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
  }

  public createAccount() {
    this.navCtrl.push('RegisterPage');
  }

  public login() {
    this.showLoading();
    this.authService.login(this.credentials)
      .do(a => {this.storage.set('accessToken', a); console.log(a)})
      .flatMap(u => this.userService.findById(u))
      .subscribe(u => {
        this.user = u
        this.openPage(u.nama)
        console.log(u)
      },
      e => {
        if (e.statusText === "Unauthorized") {
          this.loading.dismiss();
          this.showToast("Akses ditolak, email / password salah")
        }
        else {
          this.loading.dismiss();
          this.showToast("Koneksi error, mohon hubungi admin")
        }
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

  openPage(username) {
    this.showToast('Selamat Datang, '+username);
    this.navCtrl.setRoot(this.rootPage, {}, {animate: true, animation: 'ios-transition', direction:'forward'});
  }

}
