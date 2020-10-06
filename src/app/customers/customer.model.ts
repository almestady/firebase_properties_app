import { Booking } from '../properties/property.model';



export class Customer {
  constructor(
   public id: string,
   public title: string,
   public  firstName: string,
   public  lastName: string,
   public  birthday: Date,
   public  email: string,
   public password: string,
   public gender: string,
   public country: string,
   public city: string,
   public area: string,
   public address: string,
   public zipcode: number,
   public  phone: number,
   public personalPic: string,
   public bookings: Booking[]
  ) {}  
}