import { AuthService } from './../auth.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { switchMap, map, take, tap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable } from 'rxjs';
// import { User } from '../user.model';
import { HttpClient } from '@angular/common/http';
import * as admin from 'firebase-admin';

export interface User {
  uid: string;
  email: string;
}

// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: 'https://propertiestag-25d9d.firebaseio.com/'
// });

export interface Message {
  createdAt: firebase.firestore.FieldValue;
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
}

@Injectable({
  providedIn: 'root'
})
// export class ChatService {
//   currentUser: User = null;

//   constructor(
//     private afAuth: AngularFireAuth,
//     private afs: AngularFirestore,
//     private http: HttpClient,
//     private authService: AuthService
//     ) {
//     this.afAuth.onAuthStateChanged((user) => {
//       this.currentUser = user;      
//     });
//   }

//   async signup({ email, password }): Promise<any> {
//     const credential = await this.afAuth.createUserWithEmailAndPassword(
//       email,
//       password
//     );
 
//     const uid = credential.user.uid;
 
//     return this.afs.doc(
//       `users/${uid}`
//     ).set({
//       uid,
//       email: credential.user.email,
//     })
//   }
 
//   signIn({ email, password }) {
//     return this.afAuth.signInWithEmailAndPassword(email, password);
//   }
 
//   signOut(): Promise<void> {
//     return this.afAuth.signOut();
//   }

// //   // Chat functionality
 
// addChatMessage(msg) {
//   return this.afs.collection('messages').add({
//     msg: msg,
//     from: this.currentUser.uid,
//     createdAt: firebase.firestore.FieldValue.serverTimestamp()
//   });
// }
 
// getChatMessages() {
//   let users = [];
//   return this.getUsers().pipe(
//     switchMap(res => {
//       users = res;
//       return this.afs.collection('messages', ref => ref.orderBy('createdAt')).valueChanges({ idField: 'id' }) as Observable<Message[]>;
//     }),
//     map(messages => {
//       // Get the real name for each user
//       for (let m of messages) {          
//         m.fromName = this.getUserForMsg(m.from, users);
//         m.myMsg = this.currentUser.uid === m.from;
//       }        
//       return messages
//     })
//   )
// }
 
// private getUsers() {
  
//   return this.afs.collection('users').valueChanges({ idField: 'uid' }) as Observable<User[]>;
// }
 
// private getUserForMsg(msgFromId, users: User[]): string {    
//   for (let usr of users) {
//     if (usr.uid == msgFromId) {
//       return usr.email;
//     }
//   }
//   return 'Deleted';
// }

export class ChatService {
  currentUser: User = null;
  private messagesCollection: AngularFirestoreCollection<Message>;
  private usersCollection: AngularFirestoreCollection<User>;
  messages: Observable<Message[]>;
  users: Observable<User[]>;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private http: HttpClient,
    private authService: AuthService,
    
    ) {
      this.messagesCollection = afs.collection<Message>('messages');
    this.messages = this.messagesCollection.valueChanges();

    this.usersCollection = afs.collection<User>('users');
    this.users = this.usersCollection.valueChanges({idField: 'id'});

    // this.afAuth.onAuthStateChanged((user) => {
    //   this.currentUser = user;      
    // });
  }
  addChatMessage(message: Message) {
    return from (this.messagesCollection.add(message)) ;
  }

getMessages(){
  return this.afs.collection('messages').snapshotChanges();
}

  getUsers() { 
    return  this.usersCollection.valueChanges({ idField: 'uid' }) as Observable<User[]>;
  }
  // TODO Chat functionality

  private _messages = new BehaviorSubject<Message[]>([]);

  private _users = new BehaviorSubject<User[]>([]);

  // get messages() {
  //   return this._messages.asObservable();
  // }

  // get users() {
  //   return this._users.asObservable();
  // }

// getMessages() {
//   return  this.authService.getMessages()
// }

  // getMessages() {
  //   let fetchedUserId:String;
  //   return this.authService.userId.pipe(take(1),switchMap(userId => {
  //     if (!userId) {
  //       throw new Error('No user id found!');
  //     }
  //     fetchedUserId = userId;
  //     return this.authService.token;
  //   }),
  //   take(1), switchMap(token => {

  //     return this.http
  //       .get<{ [key: string]: Message }>(
  //         `https://propertiestag-25d9d.firebaseio.com/messages.json?orderBy="from"&auth=${token}`
  //       )
  //   }),map(messageData => {
  //         const messages = [];
  //         for (const key in messageData) {
  //           if (messageData.hasOwnProperty(key)) {
  //             messages.push(
  //               {
  //                 id: key,
  //                 createdAt: messageData[key].createdAt,
  //                 from: messageData[key].from,
  //                 msg: messageData[key].msg,
  //                 fromName: messageData[key].fromName,
  //                 myMsg: messageData[key].myMsg
  //               }
  //             );
  //           }
  //         }
  //         return messages;
  //       }),
  //       tap(messages => {
  //         this._messages.next(messages);
  //       })
  //     );
  // }


  // addChatMessage(msg: Message) {
  //   let generatedId: string;
  //   return this.authService.token.pipe(take(1), switchMap(token => {

  //     return this.http
  //       .post<{ name: string }>(
  //         `https://propertiestag-25d9d.firebaseio.com/messages.json?auth=${token}`,
  //         { ...msg, id: null }
  //       )
  //   }),switchMap(resData => {
  //         generatedId = resData.name;
  //         return this.messages;
  //       }),
  //       take(1),
  //       tap(messages => {
  //         msg.id = generatedId;
  //         this._messages.next(messages.concat(msg));
  //       })
  //     );
  //   // return this.afs.collection('messages').add({
  //   //   msg: msg,
  //   //   from: this.currentUser.uid,
  //   //   createdAt: firebase.firestore.FieldValue.serverTimestamp()
  //   // });
  // }
   
  signIn({ email, password }) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }
  

   
  //  getUsers() {
  //   let fetchedUserId:String;
  //   return this.authService.userId.pipe(take(1),switchMap(userId => {
  //     if (!userId) {
  //       throw new Error('No user id found!');
  //     }
  //     fetchedUserId = userId;
  //     return this.authService.token;
  //   }),
  //   take(1), switchMap(token => {

  //     return this.http
  //       .get<{ [key: string]: Message }>(
  //         `https://propertiestag-25d9d.firebaseio.com/users.json?&auth=${token}`
  //       )
  //   }),map(messageData => {
  //         const users = [];
  //         for (const key in messageData) {
  //           if (messageData.hasOwnProperty(key)) {
  //             users.push(
  //               {
  //                 id: key
  //               }
  //             );
  //           }
  //         }
  //         return users;
  //       }),
  //       tap(users => {
  //         this._users.next(users);
  //       })
  //     );
  // }
 
}