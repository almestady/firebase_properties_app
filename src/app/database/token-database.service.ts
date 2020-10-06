import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';

export interface Token {
  token_id: string
}

@Injectable({
  providedIn: 'root'
})
export class TokenDatabaseService {

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  tokens = new BehaviorSubject([])

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private sqlitePorter: SQLitePorter,
    private http: HttpClient
    ) {
    console.log('Starting TokenDB Service')
    
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'tokens.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        console.log('database created')

    // this.database = db;
    // this.database.executeSql('CREATE TABLE IF NOT EXISTS tokens(token_id STRING)')
    // .then(() => {
    //   console.log('Executed SQL')
    //   this.dbReady.next(true)
    // })
    
    // .catch(e => console.log(e));

          // db.executeSql('CREATE TABLE IF NOT EXISTS  tokens(id INTEGER PRIMARY KEY AUTOINCREMENT, token_id TEXT)')
          //     .then(() => {
          //        console.log('Executed SQL')
          //        this.dbReady.next(true);
          //       }
          //     )
          //     .catch(e => console.log(e));


      })
      // .catch(e => console.log(e));
    });    
} 

token_database(db: SQLiteObject){
  this.http.get('assets/token_database.sql', { responseType: 'text'})
  .subscribe(sql => {
    this.sqlitePorter.importSqlToDb(this.database, sql)
      .then(_ => {
       this.loadToken()
       this.dbReady.next(true);
      })
      .catch(e => console.error(e));
  });
}
getDatabaseState() {
  return this.dbReady.asObservable();
}

getToken(): Observable<Token[]> {
  return this.tokens.asObservable()
}

saveToken(token_id: string) {
  console.log('Start saving...')
  let data = [token_id];
  return this.database.executeSql('INSERT INTO tokens (token_id) VALUES (?)', data).then(data => {
    this.loadToken();
  });
}
loadToken(){
  return this.database.executeSql('SELECT * FROM tokens', []).then(data => {
    let tokens: Token[] = []
    //  tokens = data;
    if (data.rows.length > 0) {
      for (var i = 0; i < data.rows.length; i++) {
        // let theToken = '';
        // if(data.rows.item(i).token_id != ''){
        //   theToken = JSON.parse(data.rows.item(i).token_id)
        // }
        tokens.push({ 
          token_id: data.rows.item(i).token_id
         });
        }
      }
        this.tokens.next(tokens)
  
  }
)
}
}