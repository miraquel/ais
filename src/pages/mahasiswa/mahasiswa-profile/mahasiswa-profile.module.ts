import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MahasiswaProfilePage } from './mahasiswa-profile';

@NgModule({
  declarations: [
    MahasiswaProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(MahasiswaProfilePage),
  ],
})
export class MahasiswaProfilePageModule {}
