// import { User } from './chat.page';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../auth.service';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { Message } from 'src/app/services/chat.service';

export interface User {
  id: string;
  nickname: string;
  email: string;
  created: Date;
}
export interface Group {
  id: string;
  title: string;
  users: User[];
  messages: Message[];
}

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
 groups:  Observable<Group[]>;

  constructor(private db: AngularFirestore, private auth: AuthService, private storage: AngularFireStorage) { 
    this.groups = this.db.collection<Group>('groups').valueChanges({ idField: 'id' }) as Observable<Group[]>;
  }

  getProperty(id: string){
    // return this.db.collection('groups').valueChanges({ idField: 'id' }) as Observable<Group[]>;
    return this.db.doc(`groups/${id}`).snapshotChanges();
  }

}
