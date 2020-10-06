import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CustomersPage } from './customers.page';

const routes: Routes = [
  {
      path: 'customers',
      component: CustomersPage,
      children: [
                {
                    path: 'new',
                    loadChildren: './customers/new-customer/new-customer.module#NewCustomerPageModule'
                },
                {
                    path: ':propertyId',
                    loadChildren: './customers/customer-detail/customer-detail.module#CustomerDetailPageModule'
                }
                // , {
                //     path: '',
                //     redirectTo: '',
                //     pathMatch: 'full'
                // }
  ]
  },
  { path: 'edit-customer', loadChildren: './edit-customer/edit-customer.module#EditCustomerPageModule' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CustomersRoutingModule {

}


