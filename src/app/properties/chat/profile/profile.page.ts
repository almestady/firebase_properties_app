import { AuthService } from '../../../auth.service';


import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  nickname = '';
  constructor(private auth: AuthService, private toastCtrl: ToastController) { }
 
  ngOnInit() {
    this.nickname = this.auth.nickname;
  }
 
  updateUser() {
    this.auth.updateUser(this.nickname).then(async () => {
      let toast = await this.toastCtrl.create({
        duration: 3000,
        message: 'Successfully updated nickname!'
      });
      toast.present();
    })
  }

}
