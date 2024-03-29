import {canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { CallbackComponent } from './callback/callback.component';

// import { AuthResolver } from './auth-resolver.service';

// Send unauthorized users to login
const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(['auth']);
 
// Automatically log in users
const redirectLoggedInToHome = () => redirectLoggedInTo(['properties/tabs/discover']);


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthPageModule),
    
  },
  // { path: '', redirectTo: 'properties/tabs', pathMatch: 'full' },
  // { path: 'home',
  //  loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'auth',
   loadChildren: () => import('./auth/auth.module').then(m => m.AuthPageModule) },
  //  loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'properties',
  loadChildren: () => import('./properties/properties.module').then(m => m.PropertiesPageModule) ,
  // ...canActivate(redirectLoggedInToHome),
  // canLoad: [AuthGuard]
 canActivate: [AuthGuard]
},
{ path: 'callback', component: CallbackComponent, 
// resolve: {token: AuthResolver}
//  loadChildren: () => import('./callback/callback.component').then(m => m.CallbackComponent)
},
  //  loadChildren: './properties/properties.module#PropertiesPageModule', canLoad: [AuthGuard] },
  
  
  {
    path: 'customers',
      children: [
          {
            path: '',
            loadChildren: () => import('./customers/customers.module').then(m => m.CustomersPageModule)
            // loadChildren: './customers/customers.module#CustomersPageModule'
          },
          {
              path: 'new',
              loadChildren: './customers/new-customer/new-customer.module#NewCustomerPageModule'
          },
          {
              path: ':customerId',
              loadChildren: './customers/customer-detail/customer-detail.module#CustomerDetailPageModule'
          },
          {
            path: 'edit/:customerId',
            loadChildren: () => import('./customers/edit-customer/edit-customer.module').then(m => m.EditCustomerPageModule)
            // loadChildren: './customers/edit-customer/edit-customer.module#CustomerDetailPageModule'
        }
        
          
          // , {
          //     path: '',
          //     redirectTo: '',
          //     pathMatch: 'full'
          // }
      ]
   },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'stat-chat', loadChildren: './chat/stat-chat/stat-chat.module#StatChatPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
