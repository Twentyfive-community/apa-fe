export const environment = {
  production: false,

  keycloakurl: 'http://80.211.123.141:9001',
  realmname: 'DEV',
  //realmname: 'Antica-Pasticceria',
  clientid: 'apa-app',
  redirecturi: '',
  backendUrl: 'http://localhost:8080',

  showCookiePopup: true,
  cookieKey: 'cookieResponse',

  //payment things.
  currency:'EUR',
  cancelUrl:'http:localhost:4200/catalogo/carrello',
  returnUrl:'http:localhost:4200/catalogo/carrello',
  kafkaTopic:'twentyfive_dev_preorders',
  paymentUrl:'http://80.211.123.141:8106/groypal-deamon',

  ftpUrl: 'http://80.211.123.141:8106/TwentyfiveMediaManager/twentyfiveserver',
  ftpDownloadUrl: 'http://80.211.123.141:8106/TwentyfiveMediaManager/twentyfiveserver/downloadkkk/apa/products/'
}
