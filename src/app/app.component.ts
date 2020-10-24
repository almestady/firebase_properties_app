import { Component, OnInit, OnDestroy } from '@angular/core';

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
import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  labels: Labels;
  authSub: Subscription
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(null)

  token = new BehaviorSubject([]);
  private previousAuthState = false;
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private languageService: LanguagesService,
    private authService: AuthService,
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
      })
      }
      
  

  ngOnInit(){
  this.authSub =  this.authService.userIsAuthenticated.subscribe(isAuth => {
    if(!isAuth && this.previousAuthState !== isAuth){
      this.router.navigateByUrl('/auth')
    }
    this.previousAuthState = isAuth;
    })
  }

  ngOnDestroy(){
    if(this.authSub){
      this.authSub.unsubscribe()
    }
  }

  onLogout() {
   this.authService.logout();
   this.router.navigateByUrl('/auth');
  }
}
