import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LoadingController, IonInput } from '@ionic/angular';
import { present } from '@ionic/core/dist/types/utils/overlays';
import { NgForm, FormGroup } from '@angular/forms';
import { View } from '../properties/view.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
isLoading = false;
token: string;
form: FormGroup;
@ViewChild('emailCtrl',{static: true}) username: IonInput;
@ViewChild('passwordCtrl',{static: true}) password: IonInput;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtl: LoadingController
     ) { }



  ngOnInit() {
   
  }

  onLogin() {
    this.isLoading = true;
    console.log(this.username.value, this.password.value)
    this.authService.login();
    this.loadingCtl.create({keyboardClose: true, message: 'Logging in...'}).then(loadEl => {
      loadEl.present();
        setTimeout(()=> {
          this.isLoading = false;
          loadEl.dismiss();
         this.router.navigateByUrl('/properties/tabs/discover');
        },1000);
    });
  }
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

  }

}
