import { Component, OnInit } from '@angular/core';
import { CustomersRoutingModule } from './customers-routing.module';
import { CustomerService } from './customer.service';
import { Customer } from './customer.model';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
customers: Customer[];
  constructor(private customerService: CustomerService) { }

  ngOnInit() {
     this.customerService.customers.subscribe(customers => {
      this.customers = customers;
     });
  }

}
