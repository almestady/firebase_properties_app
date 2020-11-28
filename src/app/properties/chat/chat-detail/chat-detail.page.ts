import { ChatService } from 'src/app/services/chat.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { map } from 'rxjs/operators';


import { AuthService } from '../../../auth.service';


@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.page.html',
  styleUrls: ['./chat-detail.page.scss'],
})
export class ChatDetailPage implements OnInit {
  messages: Observable<any[]>;
  currentUserId = this.auth.currentUserId;
  newMsg = '';
  chatTitle = '';
  chat = null;
  
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('input', { read: ElementRef }) msgInput: ElementRef;
  
  constructor(private route: ActivatedRoute, private auth: AuthService, private chatService: ChatService, 
    private router: Router, ) { }

  ngOnInit() {
    this.route.params.subscribe(data => {
      console.log('this is params:',data)
      this.chatService.getOneGroup(data.groupId).subscribe(res => {
        this.chat = res;
        console.log('my chat: ', this.chat);
        this.messages = this.chatService.getChatMessages(res.id).pipe(
          map(messages => {
            for (let msg of messages) {
              console.log('this is the message: ', msg.data)
              msg.data['user'] = this.getMsgFromName(msg.data['from']);
            }
            console.log('messages: ', messages);
            return messages;
          })
        );
      })
    })
  }

  getMsgFromName(userId) {
    for (let usr of this.chat.data.users) {
      console.log('this is the nickname   ' ,usr)
      if (usr.id === userId) {
        return usr['nickname'];
      }
    }
    return 'Deleted';
  }

  sendMessage() {
    this.chatService.addChatMessage(this.newMsg, this.chat.id).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom();
    });
  }

  resize() {
    this.msgInput.nativeElement.style.height = this.msgInput.nativeElement.scrollHeight + 'px';
  }

  leave() {
    let newUsers = this.chat.users.filter(usr => usr.id != this.auth.currentUserId);

    this.chatService.leaveGroup(this.chat.id, newUsers).subscribe(res => {
      this.router.navigateByUrl('/chats');
    });
  }

  // sendFile() {
  //   const options: CameraOptions = {
  //     quality: 70,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE,
  //     sourceType: this.camera.PictureSourceType.CAMERA,
  //     correctOrientation: true
  //   }

  //   this.camera.getPicture(options).then(data => {

  //     let obj = this.chatService.addFileMessage(data, this.chat.id);
  //     let task = obj.task;

  //     task.then(res => {
  //       obj.ref.getDownloadURL().subscribe(url => {
  //         this.chatService.saveFileMessage(url, this.chat.id);
  //       })
  //     });

  //     task.percentageChanges().subscribe(change => {
  //       console.log('change: ', change);
  //     })
  //   });

    
  // }

}
