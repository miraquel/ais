import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Loading, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Storage } from "@ionic/storage";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';

import { AuthServiceProvider } from "../providers/auth-service/auth-service";
import { UserServiceProvider } from "../providers/user-service/user-service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = "LoginPage";

  pages: Array<{title: string, component: any, icon: string, color: string}>;

  loading: Loading;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private authService: AuthServiceProvider,
    private userService: UserServiceProvider
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'MahasiswaHomePage' , icon: 'home', color: 'faGreen'},
      { title: 'Academic', component: 'MahasiswaAcademicPage', icon: 'graduation-cap', color: 'faOrange' },
      { title: 'Profile', component: 'MahasiswaProfilePage', icon: 'user', color: 'faLightBlue' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.verifyAccessToken();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, {}, {animate: true, animation: 'ios-transition', direction: 'forward'});
  }

  signOut() {
    this.showLoading()
    Observable.fromPromise(this.storage.get('accessToken'))
      .flatMap(a => this.authService.logout(a))
      .subscribe(a => {
        console.log(a)
        this.showToast("Anda sudah sign out, Terima Kasih")
        this.storage.clear()
        this.nav.setRoot(this.rootPage, {}, {animate:true, direction:'back', animation:'ios-transition'});
        this.loading.dismiss()
      },
      e => {
        console.log(e)
      })
  }

  showLogoutConfirmation() {
    let confirm = this.alertCtrl.create({
      title: 'Sign Out?',
      message: 'Apakah anda yakin ingin melakukan sign-out?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel'
        },
        {
          text: 'Ya',
          handler: () => {
            this.signOut();
          }
        }
      ]
    });
    confirm.present();
  }

  verifyAccessToken() {
    this.showLoading();
    Observable.fromPromise(this.storage.get("accessToken"))
      .flatMap(a => this.userService.verifyAccessToken(a))
      .flatMap(a => this.userService.findById(a))
      .subscribe(
        u => {
          console.log(u)
          this.nav.setRoot("MahasiswaHomePage",{},{animate:true, direction:'forward', animation:'ios-transition'})
          this.showToast("Selamat Datang, "+u.nama)
          this.loading.dismiss()
        },
        e => {
          console.log(e);
          if (e.statusText === "Not Found"){
            this.showToast("Sesi anda telah berakhir, silahkan login kembali")
            this.storage.clear()
          }
          this.loading.dismiss()
        }
      );
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
