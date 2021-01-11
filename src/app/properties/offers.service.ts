import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { from, Observable } from 'rxjs';

interface Offer{
  createdAt: Date;
  offerPrice: number;
  userId: string;
  propertyId: string;
}

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  private offersCollection: AngularFirestoreCollection<Offer>;
  offers: Observable<Offer[]>;

   constructor(
    private authService: AuthService,
    private http: HttpClient,
    private afStorage: AngularFireStorage,
    public afs: AngularFirestore
  ) { 
    this.offersCollection = this.afs.collection<Offer>('offers');
    this.offers = this.offersCollection.valueChanges({ idField: 'id' }) as Observable<Offer[]>;
  }

  addOffer(offer: Offer){
    const myOffer = {...offer};
      return from(this.afs.collection('offers').add(myOffer));
  }

  cancelOffer(offerId:string) {
    return from(this.afs.doc('offers/' + offerId).delete());
   }
}
