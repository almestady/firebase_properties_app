import { UploadComponent } from './shared/upload/upload.component';
import { LikesService } from './shared/likes.service';
import { FormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular-lite';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CustomersRoutingModule } from './customers/customers-routing.module';
import { CallbackComponent } from './callback/callback.component';
import { PropertiesPageModule } from './properties/properties.module';
import { CustomersPageModule } from './customers/customers.module';
import { AuthPageModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { IonicStorageModule } from '@ionic/storage';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth-resolver.service';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { TokenDatabaseService } from './database/token-database.service';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { ViewsService } from './shared/views/views.service';

import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/File/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Media } from '@ionic-native/media/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import {AngularFireStorageModule} from '@angular/fire/storage'
import {AngularFireModule} from '@angular/fire'

@NgModule({
  declarations: [AppComponent, CallbackComponent, UploadComponent],
  entryComponents: [],
  imports  : [ 
    FormsModule,
    MbscModule,
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyCFLk7p2LybX2Vpu9bIa2771ow94dXJFAo",
      authDomain: "propertiestag-25d9d.firebaseapp.com",
      databaseURL: "https://propertiestag-25d9d.firebaseio.com",
      projectId: "propertiestag-25d9d",
      storageBucket: "propertiestag-25d9d.appspot.com",
      messagingSenderId: "207270852349",
      appId: "1:207270852349:web:e8134b68afc0454cae3094",
      measurementId: "G-8T79XCGGSD"
    }),
    AngularFireStorageModule,
     IonicStorageModule.forRoot({
    name: '_mydb',
    driverOrder: ['localstorage'],

  }),],
  providers: [ StatusBar, SplashScreen, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    AuthGuard,
    AuthService,
    SQLitePorter,
    SQLite,
    TokenDatabaseService,
    SafariViewController,
    AuthResolver,
    Storage,
    LikesService,
    ViewsService,
    ImagePicker,
    MediaCapture,
    File,
    Media,
    StreamingMedia,
    PhotoViewer
    // {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor,
    //   multi: true},
   ],
  bootstrap: [AppComponent]
})
export class AppModule {}
