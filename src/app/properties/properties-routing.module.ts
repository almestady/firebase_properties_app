import { UploadComponent } from './../shared/upload/upload.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PropertiesPage } from "./properties.page";
// import { loadavg } from 'os';
import { loadingController } from "@ionic/core";

const routes: Routes = [
  {
    path: "tabs",
    component: PropertiesPage,
    children: [
        {
            path: '',
            redirectTo: '/properties/tabs/discover',
            pathMatch: 'full'
        },
      {
        
        path: "discover",
        children: [
          {
            path: "",
            loadChildren: () =>
            import("./browser/browser.module").then((m) => m.BrowserPageModule),
             
          },
          {
            path: "bookings",
            children: [
              {
                path: "",
                loadChildren: () =>
                  import("../properties/search/bookings/bookings.module").then(
                    (m) => m.BookingsPageModule
                  ),
              },
           
          {
            path: "browser",
            children: [
            {
               path: "",
              loadChildren: () =>
                import("./browser/browser.module").then((m) => m.BrowserPageModule),
            } ,
            {
              path: "search",
              loadChildren: () =>
              import("./search/search.module").then((m) => m.SearchPageModule)
            }
           
            ]
          }
        ,
              {
                path: ":propertyId",
                loadChildren: () =>
                  import("../properties/search/bookings/bookings.module").then(
                    (m) => m.BookingsPageModule
                  ),
              },
              {
                path: "new",
                loadChildren: () =>
                  import(
                    "../properties/search/bookings/create-booking/create-booking.component"
                  ).then((m) => m.CreateBookingComponent),
              }
            ]
          },
          {
            path: ":propertyId",
            loadChildren: () =>
              import("./search/search.module").then(
                (m) => m.SearchPageModule
              ),
            // loadChildren: './offers/new-offer/new-offer.module#NewOfferPageModule'
          },
        ],
      },
      {
        path: "offers",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("./offers/offers.module").then((m) => m.OffersPageModule),
          },
          {
            path: "edit/:offerId",
            loadChildren: () =>
              import("./offers/edit/edit.module").then(
                (m) => m.EditPageModule
              ),
            // loadChildren: './offers/edit-offer/edit-offer.module#EditOfferPageModule'
          },
          {
            path: "new_property",
            loadChildren: () =>
              import("./offers/new-property/new-property.module").then(
                (m) => m.NewPropertyPageModule
              ),
            // loadChildren: './offers/edit-offer/edit-offer.module#EditOfferPageModule'
          },
          {
            path: "new",
            loadChildren: () =>
              import("./offers/new-offer/new-offer.module").then(
                (m) => m.NewOfferPageModule
              ),
            // loadChildren: './offers/new-offer/new-offer.module#NewOfferPageModule'
          },
          {
            path: "rents",
            loadChildren: () =>
              import("./offers/offer-rents/offer-rents.module").then(
                (m) => m.OfferRentsPageModule
              ),
            // loadChildren: './offers/offer-rents/offer-rents.module#OfferRentsPageModule'
          },
          {
            path: "sales",
            loadChildren: () =>
              import("./offers/offer-sales/offer-sales.module").then(
                (m) => m.OfferSalesPageModule
              ),
            // loadChildren: './offers/offer-sales/offer-sales.module#OfferSalesPageModule'
          },
          {
            path: ":propertyId",
            loadChildren: () =>
              import("./offers/offers-bookings/offers-bookings.module").then(
                (m) => m.OffersBookingsPageModule
              ),
            // loadChildren: './offers/offers-bookings/offers-bookings.module#OffersBookingsPageModule'
          },
          // ,
          // {
          //     path: 'offer-item',
          //     component: OfferItemComponent
          // }
        ],
      },

      

      {
        path: "requests",
        loadChildren: () =>
          import("./requests/requests.module").then(
            (m) => m.RequestsPageModule
          ),
      },
    ],
  },
  { path: '', loadChildren: './browser/browser.module#BrowserPageModule' },
  // },

  //         { path: '', redirectTo: '/properties/tabs/discover', pathMatch: 'full' },

  //    loadChildren: './requests/requests.module#RequestsPageModule' }

  // ,{ path: 'home', loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertiesRoutingModule {}
