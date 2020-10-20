import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthResponseData, AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LoadingController, IonInput, AlertController } from '@ionic/angular';
import { present } from '@ionic/core/dist/types/utils/overlays';
import { NgForm, FormGroup } from '@angular/forms';
import { View } from '../properties/view.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
token: string;
form: FormGroup;
@ViewChild('emailCtrl',{static: true}) username: IonInput;
@ViewChild('passwordCtrl',{static: true}) password: IonInput;
isLoading = false;
isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
     ) { }



  ngOnInit() {
   
  }

  // onLogin() {
  //   this.isLoading = true;
  //   console.log(this.username.value, this.password.value)
  //   this.authService.login();
  //   this.loadingCtlr.create({keyboardClose: true, message: 'Logging in...'}).then(loadEl => {
  //     loadEl.present();
  //       setTimeout(()=> {
  //         this.isLoading = false;
  //         loadEl.dismiss();
  //        this.router.navigateByUrl('/properties/tabs/discover');
  //       },1000);
  //   });
  // }
  // onLogin(username: Element, password: Element) {
  //   this.isLoading = true;
  //   console.log(this.username.value, this.password.value)
  //   this.authService.login(this.username.value, this.password.value);
  //   this.loadingCtl.create({keyboardClose: true, message: 'Logging in...'}).then(loadEl => {
  //     loadEl.present();
  //       setTimeout(()=> {
  //         this.isLoading = false;
  //         loadEl.dismiss();
  //        this.router.navigateByUrl('/properties/tabs/discover');
  //       },1000);
  //   });
  // }
  authenticate(email: string, password: string) {
    this.isLoading = true;
    
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          authObs = this.authService.signup(email, password);
        }
       authObs.subscribe(
          resData => {
            console.log(resData);
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/properties/tabs');
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = 'Could not sign you up, please try again.';
            if (code === 'EMAIL_EXISTS') {
              message = 'This email address exists already!';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'E-Mail address could not be found.';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'This password is not correct.';
            }
            this.showAlert(message);
          }
        );
      });
  } 

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  newCustomer() {
    this.router.navigateByUrl('/customers/new');
  }

  // onLogin() {
  //   this.isLoading = true;
  //   this.authService.login();
  //   this.loadingCtrl
  //     .create({ keyboardClose: true, message: 'Logging in...' })
  //     .then(loadingEl => {
  //       loadingEl.present();
  //       setTimeout(() => {
  //         this.isLoading = false;
  //         loadingEl.dismiss();
  //         this.router.navigateByUrl('/properties/tabs/discover');
  //       }, 1500);
  //     });
  // }

  onSubmit(form: NgForm) {
    if(!form.valid) {
      return;
    }
   const email = form.value.email;
   const password = form.value.password;
   console.log(email, password);
   this.authenticate(email, password);
  
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

}
