import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-start-chat',
  templateUrl: './start-chat.page.html',
  styleUrls: ['./start-chat.page.scss'],
})
export class StartChatPage implements OnInit {
users = [];
title = '';
participant = '';

  constructor(private chatService: ChatService, private router: Router) { }

  ngOnInit() {
  }

  addUser(){
    let obs = this.chatService.findUser(this.participant)
    
    forkJoin(obs).subscribe(res => {
      console.log('res:',res)
      for( let data of res){
        if(data.length > 0){
           console.log(data)
           let _user = {
             email:data[0].data['email'],
             id: data[0].id,
             nickname: data[0].data['nickname']
           }
          this.users.push(_user)
          console.log('users: ',this.users)
        }
      }
      this.participant = '';
    })
  }

  createGroup(){
   this.chatService.createGroup(this.title, this.users).then(()=> {
     this.router.navigateByUrl(`properties/tabs/chat/chat-detail`)
   });
  }

}
