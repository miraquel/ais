import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MahasiswaHomePage } from './mahasiswa-home';

@NgModule({
  declarations: [
    MahasiswaHomePage,
  ],
  imports: [
    IonicPageModule.forChild(MahasiswaHomePage),
  ],
})
export class MahasiswaHomePageModule {}
