import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core'
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LanguagesService, Labels } from './languages.service';

// Import Auth0Cordova
import Auth0Cordova from '@auth0/cordova';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  labels: Labels;

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(null)

  token = new BehaviorSubject([]);
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private languageService: LanguagesService,
    private auth: AuthService,
    private sqlite: SQLite,
    private http: HttpClient
  ) {
    this.initializeApp();
    this.languageService.arabicLabel.subscribe(labels => this.labels = labels);  
  }


  initializeApp() {
    this.platform.ready().then(() => {
      if(Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }

      // this.statusBar.styleDefault();
      // this.splashScreen.hide();

      // this.auth.setToken()

    //   if(!this.auth.isAuthenticated()){
    //   this.auth.login();   
    // }else{
    //   this.router.navigateByUrl('properties/tabs')
    // }
      //  this.auth.authState.subscribe(state => {
      //   if (!this.auth.accessToken) {
      //     this.auth.login()
      //   }else{
      //     this.router.navigateByUrl('properties/tabs')
      //   }
      // });

      // Redirect back to app after authenticating
    //    (window as any).handleOpenURL = (url: string) => {
    //     Auth0Cordova.onRedirectUri(url);
    //   } 
      
    });
  }
  onLogout() {
   this.auth.logout();
   this.router.navigateByUrl('/auth');
  }
}
