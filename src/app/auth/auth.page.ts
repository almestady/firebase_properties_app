import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthResponseData, AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LoadingController, IonInput, AlertController, ToastController } from '@ionic/angular';
import { present } from '@ionic/core/dist/types/utils/overlays';
import { NgForm, FormGroup, FormBuilder } from '@angular/forms';
import { View } from '../properties/view.model';
import { from, Observable, Subscription } from 'rxjs';
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
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
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

  async openReset() {
    let inputAlert = await this.alertCtrl.create({
      header: 'Reset Password',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Reset',
          handler: data => {
            this.resetPw(data.email);
          }
        }
      ]
    });
    inputAlert.present();
  }

  resetPw(email) {
    this.authService.resetPw(email).then(async (res) => {
      let toast = await this.toastCtrl.create({
        duration: 3000,
        message: 'Success! Check your Emails for more information.'
      });
      toast.present();
    }, async (err) => {
      let alert = await this.alertCtrl.create({
        header: 'Error',
        message: err.message,
        buttons: ['OK']
      });
      alert.present();
    });
  }

  register({email, password, nickname}) {
    this.authService.isNicknameAvailable(nickname).subscribe(res => {
      if (res.length > 0) {
        let alert = this.alertCtrl.create({
          header: 'Error',
          message: 'Nickname already taken',
          buttons: ['OK']
        });
        alert.then(alert => alert.present());
      } else {
        this.authService.signUp({email, password, nickname}).then(async (res) => {
          let toast = await this.toastCtrl.create({
            duration: 3000,
            message: 'Successfully created new Account!'
          });
          toast.present();
          this.router.navigateByUrl('chat');
        }, async (err) => {
          let alert = await this.alertCtrl.create({
            header: 'Error',
            message: err.message,
            buttons: ['OK']
          });
          alert.present();
        })
      }
    })
  }

  authenticate(email: string, password: string, nickname: string) {
    this.isLoading = true;

    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<any>;
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
         this.register({email, password, nickname})
          this.loadingCtrl.dismiss()
        }
        if(authObs){
          authObs.subscribe(
            resData => {
              this.isLoading = false;
              console.log(resData);
              loadingEl.dismiss();
              this.router.navigateByUrl('/properties/tabs/browser');
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
        }
      
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
   const nickname = form.value.nickname;
   console.log(email, password);
   this.authenticate(email, password,nickname);
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
