import { Customer } from '../customers/customer.model';



import { Location } from './location.model';


// tslint:disable-next-line: no-namespace


export interface HasOffer {
     
   
      active: boolean;
      endDate: Date;
      price: number;
      startDate: Date;
    
   }

export interface Like {
   id: string,
   propertyId: string,
   guestId: string,
   date: Date,
   time: Date
   }

   export interface Reservation {
      // tslint:disable-next-line: align
     
       
       customerId: string;
       onDate: Date
     

      
   }


export interface View {
   id: string,
   propertyId: string,
   guestId: string,
   date: Date,
   time: Date
   }

   export interface Booking {
    id: string,
    propertyId: string,
    guestId: string,
    date: Date,
    time: Date
   }

export interface Property {
    
         id: string;
        address: string;
        bathrooms: number;
        bedrooms: number;
        description: string;
        display: string;
        endDate: Date;
        garages: number;
        gardens: number;
        hasOffer: HasOffer[];
        ketchins: number;
        kind: string;
        likes: Like[];
        livingrooms: number;
        owner: string;
        price: number;
        propertyName: string;
        propertyPic: string;
        reservations: Reservation[];
        space: string;
        startDate: Date;
        tags: string[];
        userId: string;
        views: View[];
        location: Location;
        created_at: Date;
        updated_at: Date;
     
   }





// export class HasOffer{


//    constructor( on: boolean string;  offerPrice: numberstring;  startDate: Datestring;  endDate: Date) {}
// }

// export class Reservation {

//    constructor( customerId:  string;  onDate: Date) {}
// }

// export class Property {
//      constructor(
//          id: string;
//          userId: string;
//          propertyName: string;
//          description: string;
//          propertyPicture: string;
//          price: numberstring;
//          type: 'إيجار' | 'للبيع' | 'نوع العرض'string;
//          address: string;
//          space: string;
//          owner: string;
//          likes: Like[]string;
//          bedrooms: numberstring;
//          bathrooms: numberstring;
//          ketchins: numberstring;
//          livingrooms: numberstring;
//          gardens: numberstring;
//          garages: numberstring;
//          startDate: Datestring;
//          endDate: Datestring;
//          views: View[]string;
//          hasOffer: HasOfferstring;
//          display: booleanstring;
//          reservatons: Reservation[]
//      ) { }
//  }
