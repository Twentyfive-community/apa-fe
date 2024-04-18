import {TwentyfiveCookieModalComponent} from "twentyfive-cookie-modal";
import {TwentyfiveModalGenericComponentService} from "twentyfive-modal-generic-component";
import {TwentyfiveCookieModalDetailedComponent} from "twentyfive-cookie-modal-detailed";
import {TwentyfiveCookieModalPolicyComponent} from "twentyfive-cookie-modal-policy";
import {Injectable, Injector} from "@angular/core";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class Cookies {

  /**
   * This class is used to show the cookie modal. It's used in the home component of the project. To use the modal follow these steps:
   *
   * 1. Import in package.json the following dependencies (check on npmjs for latest versions):
   * "twentyfive-cookie-modal": "^0.0.14",
   * "twentyfive-cookie-modal-detailed": "^0.0.28",
   * "twentyfive-cookie-modal-policy": "^0.0.1",
   * "twentyfive-style": "^0.0.83",
   * 2. Configure in environment.ts and environment.prod.ts the variable showCookiePopup to true or false and the cookieKey with the key of the cookie
   * 3. In AppComponent constructor, add the following line -> private cookies: Cookies
   * 4. In AppComponent, use the method showCookies in ngOnInit method. The method showCookies checks if the cookie popup has to be shown and if the cookie has already been accepted or rejected
   * 5. add in styles.scss of the project the class ->
   * ngb-modal-window {
   *   pointer-events: none !important;
   * }
   * 6. if logo is not shown in first cookie modal import company logo in assets/images folder with name "twentyfive-logo.png"
   */

  static cookieKey = environment.cookieKey;
  private static userPreferences: any = [];
  private static _service: TwentyfiveModalGenericComponentService;

  constructor(private injector: Injector) {
    Cookies._service = this.injector.get(TwentyfiveModalGenericComponentService);
  }

  static showCookies(showCookiePopup: boolean) {
    if (showCookiePopup)
      this.showCookieButton();
    if (showCookiePopup &&
      (!this.getCookie(Cookies.cookieKey) || JSON.parse(this.getCookie(Cookies.cookieKey)!).value === null)) {
      Cookies.openCookieModal();
    }
  }
  private static openCookieModal() {
    const modalRef = Cookies._service.open(TwentyfiveCookieModalComponent, 'xl', {
      centered: false,
      backdropClass: 'modal-backdrop',
      keyboard: false
    }, false);

    document.body.style.overflow = 'visible';

    modalRef.componentInstance.openDetailedModal.subscribe(() => {
      this.openDetailedModal();
    });
    modalRef.componentInstance.openEntireCookiePolicy.subscribe(() => {
      this.openEntireCookiePolicy();
    });

    modalRef.dismissed.subscribe((res) => {
      this.setCookie(Cookies.cookieKey, JSON.stringify(res), 30); // Set cookie to expire in 30 days
    });
  }
  private static openDetailedModal() {
    const detailedModalRef = Cookies._service.open(TwentyfiveCookieModalDetailedComponent, 'lg', {centered: true}, 'static');

    this.userPreferences = this.parseUserPreferences(this.getCookie(Cookies.cookieKey));
    detailedModalRef.componentInstance.userPreferences = this.userPreferences;

    detailedModalRef.componentInstance.closeDetailedModal.subscribe((res: any) => {
      detailedModalRef.close();
    })
    detailedModalRef.componentInstance.openEntireCookiePolicy.subscribe(() => {
      Cookies.openEntireCookiePolicy();
    })

    detailedModalRef.dismissed.subscribe((res) => {
      if (res) {
        this.setCookie(Cookies.cookieKey, JSON.stringify(res), 30); // Set cookie to expire in 30 days
      } else {
        detailedModalRef.close();
      }
    });
  }
  private static openEntireCookiePolicy() {
    const entirePolicyModalRef = Cookies._service.open(TwentyfiveCookieModalPolicyComponent, 'lg', {centered: true}, 'static');
    entirePolicyModalRef.componentInstance.closeEntireModal.subscribe(() => {
      entirePolicyModalRef.close();
    })
  }
  private static showCookieButton() {
    const button = document.createElement('button');
    button.setAttribute('class', 'cookie-policy-button');
    button.setAttribute('aria-label', 'Open cookie policy');

    const icon = document.createElement('i');
    icon.className = 'bi bi-cookie';
    icon.style.color = '#1A1660';
    button.appendChild(icon);

    button.addEventListener('click', () => {
      Cookies.openDetailedModal();
    });

    document.body.appendChild(button);
  }
  private static parseUserPreferences(item: string | null) {
    if (item) {
      return JSON.parse(item);
    }
    return [];
  }
  private static setCookie(name: string, value: string, days: number) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
  private static getCookie(name: string) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
      let c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }
  private static eraseCookie(name: string) {
    document.cookie = name+'=; Max-Age=-99999999;';
  }

}
