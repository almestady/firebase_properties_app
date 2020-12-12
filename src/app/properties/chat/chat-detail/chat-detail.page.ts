
import { ChatService } from 'src/app/services/chat.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


import { from, Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, Platform } from '@ionic/angular';
import { map, switchMap, tap } from 'rxjs/operators';


import { AuthService } from '../../../auth.service';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';



function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

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
  imageFile: any;
  usePicker = false;

  selectedImage: string;
 imagePick = new EventEmitter<string | File>();
@Input() showPreview = false;
@ViewChild('filePicker',{ static: false}) filePickerRef: ElementRef<HTMLInputElement>;
  
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('input', { read: ElementRef }) msgInput: ElementRef;
  
  constructor(private route: ActivatedRoute,
    private auth: AuthService, 
    private chatService: ChatService, 
    private router: Router,
    private camera: Camera,
    private platform: Platform
    ) { }

  ngOnInit() {
    if(this.platform.is('mobile') && !this.platform.is('hybrid') || this.platform.is('desktop')) {
      this.usePicker = true;
    }
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
    console.log('This is the filter......',this.chat.users)
    let newUsers = this.chat.users.filter(usr => usr.id !== this.auth.currentUserId);
    this.chatService.leaveGroup(this.chat.id, newUsers).subscribe(res => {
      this.router.navigateByUrl('properties/tabs/browser/chat');
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

  onPickImage() {
    if ( !Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200, 
      resultType: CameraResultType.Base64
    }).then(img => {
     let image = base64toBlob(img.base64String.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
      let obj = this.chatService.addFileMessage(image, this.chat.id);
      let task = obj.task;
      task.then(()=> {
        obj.ref.getDownloadURL()
      
      .subscribe(
        (url) => {
          console.log(url)
          this.chatService.saveFileMessage(url, this.chat.id);
        } )
    })
  })
      
      
    
    
      .catch(err => {
        console.log(err);
        if(this.usePicker) {
          this.filePickerRef.nativeElement.click();
        }
        return false;
      }) 
}
  
  onFileChosen(event: Event) {
    const pickedFile = ( event.target as HTMLInputElement).files[0];
    if( !pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile)
    };
    fr.readAsDataURL(pickedFile);
    console.log(pickedFile)
  }
  

  onImagePicked(image: string | File ) {
    console.log('image picked...')
    if(typeof image === 'string') {
      try{
        this.imageFile =  base64toBlob(image.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
      } catch(error){
        console.log(error);
        return;
      }
       
    } else {
      this.imageFile = image;
    }
    console.log('the picked image .....', this.imageFile)
   
    // this.formFourth.patchValue({propertyPicture:imageFile})
    }

}
