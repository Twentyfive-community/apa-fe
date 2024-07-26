export const environment = {
  keycloakurl: 'http://80.211.123.141:9001',
  realmname: 'Antica-Pasticceria',
  clientid: 'apa-app',
  redirecturi: '',
  backendUrl: 'http://80.211.123.141:8104/apa-api-layer',

  showCookiePopup: true,
  cookieKey: 'cookieResponse',

  ftpUrl: 'http://80.211.123.141:8106/TwentyfiveMediaManager/twentyfiveserver',
  ftpDownloadUrl: 'http://80.211.123.141:8106/TwentyfiveMediaManager/twentyfiveserver/downloadkkk/apa/products/',

  //payment things.
  currency:'EUR',
  cancelUrl:'http://80.211.123.141:5564/catalogo/carrello',
  returnUrl:'http://80.211.123.141:5564/catalogo/carrello',
  kafkaTopic:'twentyfive_dev_preorders',
  paymentUrl:'http://80.211.123.141:8106/groypal-deamon',
};
