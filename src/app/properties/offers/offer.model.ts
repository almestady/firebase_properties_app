import { Property } from "../property.model";

export class Offer {
    constructor(
        offerId: string,
        public property: Property,
        public kind: string,
        public fromDate: Date,
        public toDate: Date,
        public newPrice: number
    ) {}
    

}