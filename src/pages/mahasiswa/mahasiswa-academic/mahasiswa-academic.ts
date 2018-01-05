import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';

// Ionic-Native
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner";

/**
 * Generated class for the MahasiswaAcademicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mahasiswa-academic',
  templateUrl: 'mahasiswa-academic.html',
})
export class MahasiswaAcademicPage {
  friendAddress;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private qrScanner: QRScanner
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MahasiswaAcademicPage');
  }

  qrButtonClicked() {
    var context = this;
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {

        if (status.authorized) {
          // camera permission was granted
          console.log("scanning");
          var ionApp = <HTMLElement>document.getElementsByTagName("ion-app")[0];
          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((scannedAddress: string) => {
            console.log('Scanned address', scannedAddress);
            this.friendAddress = scannedAddress;
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
            ionApp.style.display = "block";
          });

          // show camera preview
          ionApp.style.display = "none";
          context.qrScanner.show();
          setTimeout(() => {
            ionApp.style.display = "block";
            scanSub.unsubscribe(); // stop scanning
            context.qrScanner.hide();
          }, 5000);
          // wait for user to scan something, then the observable callback will be called

        } else if (status.denied) {
          console.log("Denied permission to access camera");
        } else {
          console.log("Something else is happening with the camera");
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

}
