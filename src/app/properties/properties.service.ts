import { Injectable, ɵisListLikeIterable } from '@angular/core';
import { Property } from './property.model';
import { Like } from './like.model';
import { AuthService } from '../auth.service';
import { BehaviorSubject, Observable, throwError, of, from } from 'rxjs';
import { take, map, tap, delay, retry, catchError, switchMap, mergeMap, finalize } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AngularFireStorage} from '@angular/fire/storage'
import { analytics } from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class PropertiesService {
  private _properties = new BehaviorSubject<Property[]>([]);
  private propertiesCollection: AngularFirestoreCollection<Property>;

  properties: Observable<Property[]>;
// apiURL = 'http://159.89.146.255:8001/api';
// // apiURL = 'http://localhost:8000/api';
// httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type': 'application/json',
//   })
// };
// headers = new HttpHeaders()
//    .append('Content-Type' , 'application/json');
loading = false
  constructor( 
    private authService: AuthService,
    private http: HttpClient,
    private afStorage: AngularFireStorage,
    public afs: AngularFirestore
  ) {
    this.propertiesCollection = this.afs.collection<Property>('properties');
    this.properties = this.propertiesCollection.valueChanges({ idField: 'id' }) as Observable<Property[]>;
  }

  // get properties() {
  //   return this._properties.asObservable();
  // }

  getProperties() {
    
    return this.afs.collection('properties').valueChanges({ idField: 'id' }) as Observable<Property[]>;
  }

  // getProperties(){
  //   this.authService.signedIn.subscribe(user => {
  //     if(user){
  //       return this.fs.collection<{ [key: string]: Property }>('properties').valueChanges({ idField: 'id' })
  //       .pipe(map(resData => {
  //                       const properties = [];
  //                       for (const key in resData) {
  //                         if (resData.hasOwnProperty(key)) {
  //                           properties.push(
  //                            { 
  //                            id: key,
  //                            address:  resData[key].address,
  //                           bathrooms:  resData[key].bathrooms,
  //                           bedrooms:  resData[key].bedrooms,
  //                           description: resData[key].description,
  //                           display:  resData[key].display,
  //                           endDate:  resData[key].endDate,
  //                           garages:  resData[key].garages,
  //                           gardens:  resData[key].gardens,
  //                           hasOffer:  resData[key].hasOffer,
  //                           ketchins:  resData[key].ketchins,
  //                           kind:  resData[key].kind,
  //                           likes:  resData[key].likes,
  //                           livingrooms:  resData[key].livingrooms,
  //                           owner:  resData[key].owner,
  //                           price:  resData[key].price,
  //                           propertyName:  resData[key].propertyName,
  //                           propertyPic:  resData[key].propertyPic,
  //                           reservations: resData[key].reservations,
  //                           space:  resData[key].space,
  //                           startDate:  resData[key].startDate,
  //                           tags:  resData[key].tags,
  //                           userId:  resData[key].userId,
  //                           views:  resData[key].views,
  //                           location:  resData[key].location,
  //                           updated_at: resData[key].updated_at,
  //                           created_at: resData[key].created_at
  //                            });
  //                         }
  //                       }
  //                       return properties;
  //                       // return [];
  //                     }),
  //                     tap(properties => {
  //                       console.log(properties)
  //                       this._properties.next(properties);
  //                     })
  //                   );
  //     }
  //   })
  // }
  
  // getProperties(){
  //   // return this._properties.asObservable();
  //   // const props =
  //  return this.authService.token.pipe(switchMap(token => {

  //     return this.http.get<{ [key: string]: Property }>(
  //      `https://propertiestag-25d9d.firebaseio.com/properties.json?auth=${token}`)
  //   }),map(resData => {
  //               const properties = [];
  //               for (const key in resData) {
  //                 if (resData.hasOwnProperty(key)) {
  //                   properties.push(
  //                    { 
  //                    id: key,
  //                    address:  resData[key].address,
  //                   bathrooms:  resData[key].bathrooms,
  //                   bedrooms:  resData[key].bedrooms,
  //                   description: resData[key].description,
  //                   display:  resData[key].display,
  //                   endDate:  resData[key].endDate,
  //                   garages:  resData[key].garages,
  //                   gardens:  resData[key].gardens,
  //                   hasOffer:  resData[key].hasOffer,
  //                   ketchins:  resData[key].ketchins,
  //                   kind:  resData[key].kind,
  //                   likes:  resData[key].likes,
  //                   livingrooms:  resData[key].livingrooms,
  //                   owner:  resData[key].owner,
  //                   price:  resData[key].price,
  //                   propertyName:  resData[key].propertyName,
  //                   propertyPic:  resData[key].propertyPic,
  //                   reservations: resData[key].reservations,
  //                   space:  resData[key].space,
  //                   startDate:  resData[key].startDate,
  //                   tags:  resData[key].tags,
  //                   userId:  resData[key].userId,
  //                   views:  resData[key].views,
  //                   location:  resData[key].location,
  //                   updated_at: resData[key].updated_at,
  //                   created_at: resData[key].created_at
  //                    });
  //                 }
  //               }
  //               return properties;
  //               // return [];
  //             }),
  //             tap(properties => {
  //               console.log(properties)
  //               this._properties.next(properties);
  //             })
  //           );
    
  // }

  addProperty(newProperty: Property){
    let generatedId: string;
   return this.authService.token.pipe(take(1),switchMap(token => {

     return this.http.post<{ name: string }>(                     
       `https://propertiestag-25d9d.firebaseio.com/properties.json?auth=${token}`,
        {
          ...newProperty,
           id:null
         });
  }),switchMap(resData => {
               console.log("hey....", resData.name)
               generatedId = resData.name;
               return this.properties;
             }),
             take(1),
             tap(properties => {
               newProperty.id = generatedId;
               this._properties.next(properties.concat(newProperty))
             })
             // tap(resltData => {
             //   console.log(resltData)
             // }),
             
             
           )
    
  }

  updateProperty(property: Property) {
    // convert object of type Employee to JSON object
    // because Firestore understand JSON
    const employeeObject = {...property};
   return from(this.afs.doc('properties/' + property.id).update(property));
  } 
  
  deleteProperty(property: Property) {
    this.afs.doc('properties/' + property.id).delete();
  }

  getProperty(id: string){
  return from(this.afs.collection('properties').doc(id).get())
  .pipe(
    map(propertyData => {
    
          return {
            id:id,
            userId: propertyData.get('userId'),
            address: propertyData.get('address'),
            bathrooms: propertyData.get('bathrooms'),
            bedrooms: propertyData.get('bedrooms'),
            description: propertyData.get('description'),
            display: propertyData.get('display'),
            endDate: propertyData.get('endDate'),
            garages: propertyData.get('garages'),
            gardens: propertyData.get('gardens'),
            hasOffer: propertyData.get('hasOffer'),
            kind: propertyData.get('kind'),
            ketchins: propertyData.get('ketchins'),
            likes: propertyData.get('likes'),
            livingrooms: propertyData.get('livingrooms'),
            owner: propertyData.get('owner'),
            price: propertyData.get('price'),
            propertyName: propertyData.get('propertyName'),
            propertyPic: propertyData.get('propertyPic'),
            reservations: propertyData.get('reservations'),
            space: propertyData.get('space'),
            startDate: propertyData.get('startDate'),
            tags: propertyData.get('tags'),
            views: propertyData.get('views'),
            location: propertyData.get('location'),
            created_at: propertyData.get('created_at'),
            updated_at: propertyData.get('updated_at'),
           };
        }));
  }
  // getProperty(id: string) {
  //  return this.authService.token.pipe(take(1),switchMap(token => {

  //     return this.http
  //       .get<Property>(
  //         `https://propertiestag-25d9d.firebaseio.com/properties/${id}.json?auth=${token}`
  //       )
  //   }),
  //  map(propertyData => {
  //         return {
  //           id:id,
  //           address: propertyData.address,
  //           bathrooms: propertyData.bathrooms,
  //           bedrooms: propertyData.bedrooms,
  //           description: propertyData.description,
  //           display: propertyData.display,
  //           endDate: propertyData.endDate,
  //           garages: propertyData.garages,
  //           gardens: propertyData.gardens,
  //           hasOffer: propertyData.hasOffer,
  //           ketchins: propertyData.ketchins,
  //           kind: propertyData.kind,
  //           likes: propertyData.likes,
  //           livingrooms: propertyData.livingrooms,
  //           owner: propertyData.owner,
  //           price: propertyData.price,
  //           propertyName: propertyData.propertyName,
  //           propertyPic: propertyData.propertyPic,
  //           reservations: propertyData.reservations,
  //           space: propertyData.space,
  //           startDate: propertyData.startDate,
  //           tags: propertyData.tags,
  //           userId: propertyData.userId,
  //           views: propertyData.views,
  //           location: propertyData.location,
  //           created_at: propertyData.created_at,
  //           updated_at: propertyData.updated_at,
  //          };
  //       })
  //     );
  // }

//   updateProperty(property: Property) {
//     let updatedProperties: Property[];
//     let fetchedToken: string;
//  return  this.authService.token.pipe(take(1),switchMap(token  => {
//       fetchedToken = token;
//       return this.properties   
//     }),
//       take(1),
//       switchMap(properties => {
//         if (!properties || properties.length <= 0) {
//           return this.properties;
//         } else {
//           return of(properties);
//         }
//       }
//     ),
//       switchMap(properties => {
//         const updatedPropertyIndex = properties.findIndex(pr => pr.id === property.id);
//         updatedProperties = [...properties];
//         const oldProperty = updatedProperties[updatedPropertyIndex];
//         updatedProperties[updatedPropertyIndex] = {
//                 id: oldProperty.id,
//                 address: oldProperty.address,
//                 bathrooms: oldProperty.bathrooms,
//                 bedrooms: oldProperty.bedrooms,
//                 description: oldProperty.description,
//                 display: oldProperty.display,
//                 endDate: oldProperty.endDate,
//                 garages: oldProperty.garages,
//                 gardens: oldProperty.gardens,
//                 hasOffer: oldProperty.hasOffer,
//                 ketchins: oldProperty.ketchins,
//                 kind: oldProperty.kind,
//                 likes: oldProperty.likes,
//                 livingrooms: oldProperty.livingrooms,
//                 owner: oldProperty.owner,
//                 price: oldProperty.price,
//                 propertyName: oldProperty.propertyName,
//                 propertyPic: oldProperty.propertyPic,
//                 reservations: oldProperty.reservations,
//                 space: oldProperty.space,
//                 startDate: oldProperty.startDate,
//                 tags: oldProperty.tags,
//                 userId: oldProperty.userId,
//                 views: oldProperty.views,
//                 location: oldProperty.location,
//                 created_at: oldProperty.created_at,
//                 updated_at: oldProperty.updated_at,
//                };
//         return this.http.put(
//           `https://propertiestag-25d9d.firebaseio.com/properties/${property.id}.json?auth=${fetchedToken}`,
//           { ...updatedProperties[updatedPropertyIndex], id: null }
//         );
//       }),
//       tap(() => {
//         this._properties.next(updatedProperties);
//       })
//     );
//   }

  
      uploadImage(filePath: File, property: Property){
        console.log(property)
        console.log(filePath)
        this.loading = true
     return   this.authService.token.pipe(take(1),switchMap(token => {

          const path = '/images/'+Math.random()+filePath
          const storageRef = this.afStorage.ref (path);
          const task = this.afStorage.upload(path, filePath);
          return from(task)
          .pipe(
            switchMap(() => storageRef.getDownloadURL()),
            tap(url => {
              // use url here, e.g. assign it to a model
            property.propertyPic = url
            console.log(url)
            this.addProperty(property).subscribe()
          })
           )
        }))
       
      }

}