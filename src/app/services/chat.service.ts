import { AuthService } from './../auth.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
// import * as firebase from 'firebase/app';
import { switchMap, map, take, tap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable } from 'rxjs';
// import { User } from '../user.model';
import { HttpClient } from '@angular/common/http';
import * as admin from 'firebase-admin';
import { AngularFireStorage } from '@angular/fire/storage';

import * as firebase from 'firebase/app';
import { forkJoin } from 'rxjs';
import {  AngularFireStorageReference } from '@angular/fire/storage';
 

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

// export interface User {
//   uid: string;
//   email: string;
// }

// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: 'https://propertiestag-25d9d.firebaseio.com/'
// });

// export interface User {
//   uid: string;
//   email: string;
//   displayName: string;
// }

export interface Message {
  createdAt: firebase.firestore.FieldValue;
  id: string;
  from: string;
  to: string;
  msg: string;
  fromName: string;
  property: string;
  myMsg: boolean;
}

@Injectable({
  providedIn: 'root'
})


export class ChatService {
 
  constructor(private db: AngularFirestore, private auth: AuthService, private storage: AngularFireStorage) { }
 
  findUser(value) {
  console.log('this is the value.....',value)
    let email = this.db.collection('users', ref => ref.where('email', '==', value)).snapshotChanges().pipe(
      take(1),
      map(actions => actions.map(a => {
        const data = a.payload.doc.data;
        const id = a.payload.doc.id;
        console.log('This is findUser....',data, id)
        return { id, data };
      }))
    );
    let nickname = this.db.collection('users', ref => ref.where('nickname', '==', value)).snapshotChanges().pipe(
      take(1),
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, data };
      }))
    );
    console.log('email is:  ', email, '   ',nickname)
    return [email, nickname];

  }
 
  createGroup(title, users) {
    console.log('The nickname of the current user is......', this.auth.currentUserId)
    let current = {
      email: this.auth.currentUser.email,
      id: this.auth.currentUserId,
      nickname: this.auth.nickname
    };
 
    let allUsers = [current, ...users];
    console.log('The All Users....', allUsers)
    return this.db.collection('groups').add({
      title: title,
      users: allUsers
    }).then(res => {
      console.log('This is working', res)
      let promises = [];
 
      for (let usr of allUsers) {
        console.log('Adding groups: ', res.id , '   collection to every user: ', usr)
        let oneAdd = this.db.collection(`users/${usr['id']}/groups`).add({
          id: res.id
        });
        promises.push(oneAdd);
      }
      return Promise.all(promises);
    })
  }
 

  getGroups() {
    return this.db.collection(`users/${this.auth.currentUserId}/groups`).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const user_group_key = a.payload.doc.id;
        return this.getOneGroup(data['id'], user_group_key);
      }))
    )
  }
 
  getOneGroup(id, user_group_key = null) {
    return this.db.doc(`groups/${id}`).snapshotChanges().pipe(
      take(1),
      map(changes => {
        const data = changes.payload.data();
        const group_id = changes.payload.id;
        return { user_group_key, id: group_id, data };
      })
    )
  }
 
  getChatMessages(groupId) {
    return this.db.collection(`groups/${groupId}/messages`, ref => ref.orderBy('createdAt')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, data };
      }))
    )
  }
 
  addChatMessage(msg, chatId) {
    return this.db.collection('groups/' + chatId + '/messages').add({
      msg: msg,
      from: this.auth.currentUserId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
 
  addFileMessage(file, chatId) {
    const path = `${new Date().getTime()}-${this.auth.currentUserId}.png`
          const storageRef: AngularFireStorageReference = this.storage.ref (path);
          const task = this.storage.upload(path, file);
          return {task:task, ref: storageRef };
          
          // return from(task)

         

    // let newName = `${new Date().getTime()}-${this.auth.currentUserId}.png`;
    // let storageRef: AngularFireStorageReference = this.storage.ref(`/files/${chatId}/${newName}`);

    // return {
    //   task: storageRef.putString(file, 'base64', { contentType: 'image/png' }), 
    //   ref: storageRef
    // };
  }                                        
 
  saveFileMessage(filepath, chatId) {

    return this.db.collection('groups/' + chatId + '/messages').add({
      file: filepath,
      from: this.auth.currentUserId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
 
  leaveGroup(groupId, users) {
    return this.getGroups().pipe(
      switchMap(userGroups => {
        return forkJoin(userGroups);
      }),
      map(data => {
        let toDelete = null;
 
        for (let group of data) {
          if (group.id == groupId) {
            toDelete = group.user_group_key;
          }
        }
        return toDelete;
      }),
      switchMap(deleteId => {
        return from(this.db.doc(`users/${this.auth.currentUserId}/groups/${deleteId}`).delete())
      }),
      switchMap(() => {
        return from(this.db.doc(`groups/${groupId}`).update({
          users: users
        }));
      })
    );
  }
}

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

// export class ChatService {
//   // currentUser: User = null;
//   private messagesCollection: AngularFirestoreCollection<Message>;
//   // private usersCollection: AngularFirestoreCollection<User>;
//   messages: Observable<Message[]>;
//   // users: Observable<User[]>;
//   private messageDoc: AngularFirestoreDocument<Message>;
//   constructor(
//     private afAuth: AngularFireAuth,
//     private afs: AngularFirestore,
//     private http: HttpClient,
//     private authService: AuthService,
    
//     ) {
//       this.messagesCollection = afs.collection<Message>('messages');
//     this.messages = this.messagesCollection.valueChanges({ idField: 'id' }) as Observable<Message[]>;
  

//     // this.usersCollection = afs.collection<User>('users');
//     // this.users = this.usersCollection.valueChanges({ idField: 'id' }) as Observable<User[]>;
  

//     // this.afAuth.onAuthStateChanged((user) => {
//     //   this.currentUser = user;      
//     // });
//     }

//     getChatMessages() {
//       let users = [];
//       return this.authService.users.pipe(
//         switchMap(res => {
//           users = res;
//           return this.afs.collection('messages', ref => ref.orderBy('createdAt')).valueChanges({ idField: 'id' }) as Observable<Message[]>;
//         }),
//         map(messages => {
//           // Get the real name for each user
//           for (let m of messages) {
//             console.log(m.fromName)          
//             m.fromName = this.getUserForMsg(m.from, users);
//             this.authService.userId.subscribe(userId => {

//               m.myMsg = userId === m.from;
//             })
//           }        
          
//           return messages
//         })
//       )
//     }

//     private getUserForMsg(msgFromId, users: User[]): string {    
//       // for (let usr of users) {
//         let user = users.find(usr => usr.uid === msgFromId) 
//        if( user){
//           return user.displayName;
//         }
//       // }
//       return 'Deleted';
//     }

//   addChatMessage(message: Message) {
//     //  const id = this.afs.createId()
//     //  const msg: Message = {
//     //   createdAt: message.createdAt,
//     //   id: '',
//     //   from: message.from,
//     //   to: message.to,
//     //   msg: message.msg,
//     //   fromName: message.from,
//     //   property: message.property,
//     //   myMsg: message.myMsg
//     //  }
     
//       // this.messageDoc.collection<Message>('messages').doc(id).set(msg)
//       // .then(() => {
//       //     // when successful clear input field value here
          
//       // })
//       // .catch((error) => {
//       //   alert(error);
//       // });
//       const myMessage = {...message}

//       return from (this.messagesCollection.add(myMessage)) ;
                 
//     // return from (this.afs.collection('messages').add(myMessage)) ;
//   }

// getMessages(from_userId: string, property_userId: string){
//  return from (
     
//      firebase.firestore().collection("messages")
//      .where("from", "==",from_userId )
//      .where("to", "==",property_userId )
//      .get())
// }

// getMessa(){
//   return this.afs.collection('messages').snapshotChanges()
// }

//   // getUsers() { 
//   //   return  this.usersCollection.valueChanges({ idField: 'uid' }) as Observable<User[]>;
//   // }
//   // TODO Chat functionality

//   private _messages = new BehaviorSubject<Message[]>([]);

//   // private _users = new BehaviorSubject<User[]>([]);

//   // get messages() {
//   //   return this._messages.asObservable();
//   // }

//   // get users() {
//   //   return this._users.asObservable();
//   // }

// // getMessages() {
// //   return  this.authService.getMessages()
// // }

//   // getMessages() {
//   //   let fetchedUserId:String;
//   //   return this.authService.userId.pipe(take(1),switchMap(userId => {
//   //     if (!userId) {
//   //       throw new Error('No user id found!');
//   //     }
//   //     fetchedUserId = userId;
//   //     return this.authService.token;
//   //   }),
//   //   take(1), switchMap(token => {

//   //     return this.http
//   //       .get<{ [key: string]: Message }>(
//   //         `https://propertiestag-25d9d.firebaseio.com/messages.json?orderBy="from"&auth=${token}`
//   //       )
//   //   }),map(messageData => {
//   //         const messages = [];
//   //         for (const key in messageData) {
//   //           if (messageData.hasOwnProperty(key)) {
//   //             messages.push(
//   //               {
//   //                 id: key,
//   //                 createdAt: messageData[key].createdAt,
//   //                 from: messageData[key].from,
//   //                 msg: messageData[key].msg,
//   //                 fromName: messageData[key].fromName,
//   //                 myMsg: messageData[key].myMsg
//   //               }
//   //             );
//   //           }
//   //         }
//   //         return messages;
//   //       }),
//   //       tap(messages => {
//   //         this._messages.next(messages);
//   //       })
//   //     );
//   // }


//   // addChatMessage(msg: Message) {
//   //   let generatedId: string;
//   //   return this.authService.token.pipe(take(1), switchMap(token => {

//   //     return this.http
//   //       .post<{ name: string }>(
//   //         `https://propertiestag-25d9d.firebaseio.com/messages.json?auth=${token}`,
//   //         { ...msg, id: null }
//   //       )
//   //   }),switchMap(resData => {
//   //         generatedId = resData.name;
//   //         return this.messages;
//   //       }),
//   //       take(1),
//   //       tap(messages => {
//   //         msg.id = generatedId;
//   //         this._messages.next(messages.concat(msg));
//   //       })
//   //     );
//   //   // return this.afs.collection('messages').add({
//   //   //   msg: msg,
//   //   //   from: this.currentUser.uid,
//   //   //   createdAt: firebase.firestore.FieldValue.serverTimestamp()
//   //   // });
//   // }
   
//   signIn({ email, password }) {
//     return this.afAuth.signInWithEmailAndPassword(email, password);
//   }
  

   
//   //  getUsers() {
//   //   let fetchedUserId:String;
//   //   return this.authService.userId.pipe(take(1),switchMap(userId => {
//   //     if (!userId) {
//   //       throw new Error('No user id found!');
//   //     }
//   //     fetchedUserId = userId;
//   //     return this.authService.token;
//   //   }),
//   //   take(1), switchMap(token => {

//   //     return this.http
//   //       .get<{ [key: string]: Message }>(
//   //         `https://propertiestag-25d9d.firebaseio.com/users.json?&auth=${token}`
//   //       )
//   //   }),map(messageData => {
//   //         const users = [];
//   //         for (const key in messageData) {
//   //           if (messageData.hasOwnProperty(key)) {
//   //             users.push(
//   //               {
//   //                 id: key
//   //               }
//   //             );
//   //           }
//   //         }
//   //         return users;
//   //       }),
//   //       tap(users => {
//   //         this._users.next(users);
//   //       })
//   //     );
//   // }
 
// }