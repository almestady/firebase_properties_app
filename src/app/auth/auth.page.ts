import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthResponseData, AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LoadingController, IonInput, AlertController } from '@ionic/angular';
import { present } from '@ionic/core/dist/types/utils/overlays';
import { NgForm, FormGroup, FormBuilder } from '@angular/forms';
import { View } from '../properties/view.model';
import { Observable, Subscription } from 'rxjs';
import { User } from '../user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

isLoading = false;
isLogin = true;
public userAuth: Subscription;

  constructor(
    public fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
     ) { 
    //   this.userAuth = this.authService.signedIn.subscribe((user) => {
    //     if (user) {
           
    //     } else {
    //       this.router.navigate([ '/auth' ]);
    //     }
    // });
     }



  ngOnInit() {
   
  }

  
  authenticate(email: string, password: string, displayName: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: any;
        if (this.isLogin) {
          authObs =  this.authService.login(email, password)
            // this.isLoading = false;
            // loadingEl.dismiss();
            // this.router.navigate([ 'properties/tabs/discover' ]);
          
          // .then(login => {
            
            
          // });
          
          // this.userAuth = this.authService.signedIn.subscribe(user => {
          //   if(user){

          //     this.router.navigate([ '/properties/tabs/discover' ]);
          //   }
          // },
          // errRes => {
          //   loadingEl.dismiss();
          //   const code = errRes.error.error.message;
          //   let message = 'Could not sign you up, please try again.';
          //   if (code === 'EMAIL_EXISTS') {
          //     message = 'This email address exists already!';
          //   } else if (code === 'EMAIL_NOT_FOUND') {
          //     message = 'E-Mail address could not be found.';
          //   } else if (code === 'INVALID_PASSWORD') {
          //     message = 'This password is not correct.';
          //   }
          //   this.showAlert(message);
          // })
          
          // loadingEl.dismiss();
        } else {
          authObs = this.authService.signup({email, password, displayName})
          
        }
        authObs.subscribe(
          resData => {
            this.isLoading = false;
            console.log(resData);
            loadingEl.dismiss();
            this.router.navigateByUrl('/properties/tabs/discover');
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

  
  onSubmit(form: NgForm) {
    if(!form.valid) {
      return;
    }
   const email = form.value.email;
   const password = form.value.password;
   console.log(email, password);
   this.authenticate(email, password);
   form.reset();
  
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
