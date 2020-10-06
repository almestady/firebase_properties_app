import { Injectable } from '@angular/core';
import { Customer } from './customer.model';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
private _customers= new BehaviorSubject<Customer[]>( [
  new Customer('abc123', 'السيد','وائل', 'المستادي', new Date(), 'almestady@gmail.com', '12345678', 'male', 'Saudi Arabia', 'Jeddah', 'Meccah', 'Alsalamah',  21382, 505678342, '',null)
]);
  constructor() { }

  get customers() {
    return this._customers.asObservable();
  }

  getCustomer(customerId: string) {
    return this.customers.pipe(take(1), map(customers => {
      return {...customers.find(c => c.id === customerId)};
    }));
  }

  addCustomer(customer: Customer) {
  return this.customers.pipe(take(1), map(customers => {
     this._customers.next(customers.concat(customer));
   }))
  }

  updateCustomer(customer: Customer) {
  return  this.customers.pipe(take(1), delay(1000), tap(customers => {
      const updatedCustomerIndex = customers.findIndex(custm => custm.id === customer.id );
      const updatedCustomers = [...customers];
      const oldCustomer = updatedCustomers[updatedCustomerIndex];
      updatedCustomers[updatedCustomerIndex] = customer;
      this._customers.next(updatedCustomers);
    })
    );
  }
}
