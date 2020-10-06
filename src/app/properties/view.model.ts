export class View {
    customerId:string;
    ViewDate: Date;
    constructor(customerId: string, viewDate: Date) {
        this.customerId = customerId;
        this.ViewDate = viewDate;
    }
}
