import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MahasiswaAcademicPage } from './mahasiswa-academic';

@NgModule({
  declarations: [
    MahasiswaAcademicPage,
  ],
  imports: [
    IonicPageModule.forChild(MahasiswaAcademicPage),
  ],
})
export class MahasiswaAcademicPageModule {}
