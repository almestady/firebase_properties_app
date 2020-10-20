// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  gateway: '',
  callback: 'http://localhost:8100/callback',
  // callback: 'capacitor://almestady.auth0.com/store.ulmestady.properties/callback',
  // callback: 'store.ulmestady.properties://almestady.auth0.com/cordova/store.ulmestady.properties/callback',
  domain: 'almestady.auth0.com',
  clientId: '9mIsLa8Ta2P9BuQexn4pqAL6bJyERyKQ',
  audience: 'https://properties-golang-api',
  userId: '',
  googleMapsAPIKey: 'AIzaSyCQGAi0HmfmSzPEGImEYzJxiX5C7vtjKSo',
  firebaseAPIKey: 'AIzaSyCFLk7p2LybX2Vpu9bIa2771ow94dXJFAo'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
