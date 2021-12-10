import { Component, OnInit } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
name: any;
versionCode: any;
versionNumber: any;
date: any;
  constructor(
    private appVersion: AppVersion,
    private menu: MenuController,
  ) {
    this.menu.enable(false);
  }

  ngOnInit() {
   this.appVersion.getAppName().then((response:any)=> {
    this.name = response;
   }).catch((err: any)=> {
    this.name = 'Transfo';
   });

   this.appVersion.getVersionCode().then((response:any)=> {
    this.versionCode = response;
   }).catch((err: any)=> {
    this.versionCode = '1.2.3';
   });

   this.appVersion.getVersionNumber().then((response:any)=> {
    this.versionNumber = response;
   }).catch((err: any)=> {
    this.versionNumber = '1.2.3';
   })

   this.date = new Date().getFullYear();

  }

}
