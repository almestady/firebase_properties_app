export class Like {
    customerId:string;
    likeDate: Date;
    constructor(customerId: string, likeDate: Date) {
        this.likeDate = likeDate;
        this.customerId = customerId;
    }
}
