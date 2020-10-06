import { Property } from '../../property.model';


export class Booking {
    constructor(
        public id: string,
        public property: Property,
        public userId: string,
        public guestNumber: number,
        public fromDate: Date
    ){}
} 