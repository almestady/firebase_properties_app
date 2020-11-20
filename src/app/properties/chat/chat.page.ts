import { Property } from './../property.model';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from './../../auth.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ChatService, Message } from 'src/app/services/chat.service';
// import { timeStamp } from 'console';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as admin from 'firebase-admin';

export interface User {
  uid: string;
  email: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
// export class ChatPage implements OnInit {
//   @ViewChild(IonContent) content: IonContent;
 
//   messages: Observable<any[]>;
//   newMsg = '';
 
//   constructor(private chatService: ChatService, private router: Router) { }
 
//   ngOnInit() {
//     this.messages = this.chatService.getMessages();
//   }
 
//   sendMessage() {
//     this.chatService.addChatMessage(this.newMsg).then(() => {
//       this.newMsg = '';
//       this.content.scrollToBottom();
//     });
//   }
 
//   signOut() {
//     this.chatService.signOut().then(() => {
//       this.router.navigateByUrl('/', { replaceUrl: true });
//     });
//   }
 
// }
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @Input()userId: string;
  @Input()theProperty: Property;

  messages: Message[] = [];
  newMsg: string;
  users: User[] = [];
  constructor(
    private chatService: ChatService,
    private router: Router,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
     private afs: AngularFirestore ,
     private modalCtrl: ModalController,
     ) { 

     }

  ngOnInit() {

    this.authService.user.subscribe(user => {

      this.chatService.messages.subscribe(messages => {
        
        let mess = messages;
        this.messages = mess.filter(msg => {(msg.from === user.uid )})
        console.log(this.messages.length)
      })
  
      this.chatService.users.subscribe(users => {
        
        // admin.auth().listUsers(10).then(users => {
          console.log(users)
          })
      // })
    })

  }

  ionViewWillEnter(){
    this.chatService.getMessages().subscribe()  
  }

  myMessage(msg: Message){
    //  this.authService.userId.pipe(take(1)).subscribe(userId => {
      if(!this.userId){
        return false
      }
      if (msg.from === this.userId){
        return true
      }else{
       return false
      }
    // })
  }

  sendMessage() {
    let message
    this.authService.user.pipe(take(1)).subscribe(user => {
      
       message  = {
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
         id:'',
         from: user.uid,
         to: this.theProperty.userId,
         msg: this.newMsg,
         fromName: user.displayName,
         property: this.theProperty.id,
         myMsg: true
      }
    })
    this.chatService.addChatMessage(message).subscribe((msg) => {
      this.newMsg = '';
      this.content.scrollToBottom();
    });
  }

  signOut() {
    this.modalCtrl.dismiss('chat')
    // this.chatService.signOut().then(() => {
    //   this.router.navigateByUrl('/', { replaceUrl: true });
    // });
  }
 

}
