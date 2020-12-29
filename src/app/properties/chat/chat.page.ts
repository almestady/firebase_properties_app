import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Property } from './../property.model';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from './../../auth.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { IonContent, ModalController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ChatService, Message } from 'src/app/services/chat.service';
// import { timeStamp } from 'console';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as admin from 'firebase-admin';
import { ChatDetailPage } from './chat-detail/chat-detail.page';

export interface User {
  uid: string;
  email: string;
  displayName: string;
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
  theProperty: Property;
 thePropertyId: string;
  groups = [];
  

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
    private camera: Camera,
    private routes: ActivatedRoute,
    private navCtrl: NavController
     ) { 

     }

  ngOnInit() {
    this.routes.paramMap.subscribe(paramMap => {
      // if (!paramMap.has('propertyId')) {
        
      //   this.navCtrl.navigateBack('/properties/tabs/browser');
        
      //   console.log("no paramMap")
      //   return;
      // }
      console.log('the paramMaps propertyId', paramMap.get('propertyId'))
      this.thePropertyId = paramMap.get('propertyId')
    })
    this.chatService.getGroups().subscribe(groups => {
      groups.forEach(grp => {
        grp.forEach(gr => {
          if(gr.data['propertyId'] === this.theProperty.id){

            this.groups.push(gr);
          }
          console.log('Hiiiiiiiiiii ',gr.data['propertyId'])
          this.groups.find(group => group.data['propertyId'] === this.theProperty.id)
          this.groups.forEach(g => {console.log(g.data['title'], '   ' ,g.data['users'] )})
        })
      })
    });


  // this.groups = null
  // this.groups.forEach(grp => {console.log(grp)})
  // console.log(this.groups)
  
    // this.authService.user.subscribe(user => {
      console.log(this.authService.currentUserId)
    // })

    // this.authService.user.subscribe(user => {

      // this.chatService.getChatMessages().subscribe(messages => {
      //   let msgs = messages
        // this.chatService.messages.subscribe(messages => {
        // this.messages = messages
        // let mgss = messages.filter(msg => {msg.from === user.uid})
        // console.log(mgss.length)
        // messages.docChanges().forEach(data => {
        //   this.messages[data.doc.id] =  data.doc.data()
        //  }) 
      //  this.messages = msgs.filter(msg => {msg.from === user.uid})
      //  this.messages = messages
        // let mess = messages;
      //   this.messages = this.messages.filter(msg => {(msg.from === this.authService.currentUserId )})
      //   console.log(this.messages)
      // })
  
    //   this.chatService.users.subscribe(users => {
        
    //     // admin.auth().listUsers(10).then(users => {
    //       console.log(users)
    //       })
    //   // })
    // })

  }

  letsChat(groupId: string){
    this.modalCtrl.create({component: ChatDetailPage, componentProps: {groupId: groupId}, id:'chat'})
    .then(modalEl => { 
      modalEl.present();
      return modalEl.onDidDismiss();
    })
  }


goToChat(){
  this.modalCtrl.dismiss('chat')
  this.router.navigateByUrl('/properties/tabs/browser/start-chat')
}

   signOut(){
     console.log('This is theProperty ID value: ', this.thePropertyId)
    
      this.router.navigateByUrl(`properties/tabs/browser/${this.thePropertyId}`)
     
   }  


  ionViewWillEnter(){
  //   this.chatService.getMessages().subscribe()  
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



  // sendMessage() {
    
  //   this.authService.user.pipe(take(1)).subscribe(user => {
  //     console.log(user.displayName)
  //     let message:Message    = {
  //        id:'',
  //       createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  //        from: user.uid,
  //        to: this.theProperty.userId,
  //        msg: this.newMsg,
  //        fromName: user.displayName,
  //        property: this.theProperty.id,
  //         myMsg: null
  //     }
  //     this.chatService.addChatMessage(message).subscribe((msg) => {
  //   this.newMsg = '';
  //   this.content.scrollToBottom();
  //   })
      
  //   });
  // }

  // signOut() {
  //   this.modalCtrl.dismiss('chat')
    // this.chatService.signOut().then(() => {
    //   this.router.navigateByUrl('/', { replaceUrl: true });
    // });
  // }
 

}
