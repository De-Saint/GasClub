import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, MenuController, App, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { AdminHome } from '../pages/admin-home/admin-home';
import { AdminMessages } from '../pages/admin-messages/admin-messages';
import { AdminOrders } from '../pages/admin-orders/admin-orders';
import { AdminProfile } from '../pages/admin-profile/admin-profile';
import { Cart } from '../pages/cart/cart';
import { ContactUs } from '../pages/contact-us/contact-us';
import { Locations } from '../pages/locations/locations';
import { Login } from '../pages/login/login';
import { Products } from '../pages/products/products';
import { Shop } from '../pages/shop/shop';
import { UserMessages } from '../pages/user-messages/user-messages';
import { UserOrders } from '../pages/user-orders/user-orders';
import { UserProfile } from '../pages/user-profile/user-profile';
import { Users } from '../pages/users/users';
import { Signup } from '../pages/signup/signup';
import { Datalink } from '../providers/datalink';

import { Welcome } from '../pages/welcome/welcome';
export interface PageInterface {
  icon: string;
  color: string;
  title: string;
  logsOut?: boolean;
  component: any
};

@Component({
  templateUrl: 'app.html'
})
export class GasClub {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  activePage: any;
  Userfullname: any;
  Details: any;
  usertype: any;  appPages: PageInterface[] = [
  ];
  loggedInUserPages: PageInterface[] = [
    { icon: 'shopping-basket', color: 'faLightBlue', title: 'Shop', component: Shop },
    { icon: 'shopping-cart', color: 'faYellow', title: 'Cart', component: Cart },
    { icon: 'shopping-bag', color: 'faGreen', title: 'Orders', component: UserOrders },
    { icon: 'envelope', color: 'faPrimary', title: 'Messages', component: UserMessages },
    { icon: 'user-circle', color: 'faGreen', title: 'Profile', component: UserProfile },
    { icon: 'support', color: 'faYellow', title: 'Contact Us', component: ContactUs },
    { icon: 'sign-out', color: 'faOrange', title: 'Logout', logsOut: true, component: Login }
  ];
  loggedInAdminPages: PageInterface[] = [
    { icon: 'home', color: 'faGreen', title: 'Dashboard', component: AdminHome },
    { icon: 'user-circle', color: 'faYellow', title: 'Profile', component: AdminProfile },
    { icon: 'shopping-bag', color: 'faLightBlue', title: 'Orders', component: AdminOrders },
    { icon: 'gift', color: 'faYellow', title: 'Products', component: Products },
    { icon: 'users', color: 'faLightBlue', title: 'Customers', component: Users },
    { icon: 'map-marker', color: 'faPrimary', title: 'Locations', component: Locations },
    { icon: 'envelope', color: 'faPrimary', title: 'Messages', component: AdminMessages },
    { icon: 'sign-out', color: 'faOrange', title: 'Logout', logsOut: true, component: Login }
  ];
  loggedOutPages: PageInterface[] = [
    { icon: 'shopping-basket', color: 'faLightBlue', title: 'Shop', component: Shop },
    { icon: 'support', color: 'faYellow', title: 'Contact Us', component: ContactUs },
    { icon: 'sign-in', color: 'faPrimary', title: 'Login', component: Login },
    { icon: 'sign-out', color: 'faGreen', title: 'Register', component: Signup }
  ];
  pages: Array<{ title: string, component: any }>;

  constructor(public events: Events,
    public menu: MenuController, public app: App,
    public platform: Platform, public datalink: Datalink,
    public statusBar: StatusBar, public storage: Storage,
    public alertCtrl: AlertController,
    public splashScreen: SplashScreen) {
    this.storage.ready().then(() => {
      // Check if the user has already seen the WelcomePage
      this.storage.get('hasSeenWelcome')
        .then((hasSeenWelcome) => {
          if (hasSeenWelcome) {
            this.storage.get('hasSeenLogin') // Check if the user has already seen the LoginPage
              .then((hasSeenLogin) => {
                if (hasSeenLogin) {
                  this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
                    if (loggedInUserDetails === null) {
                    } else {
                      this.usertype = this.Details.type;
                      if (this.usertype === "Admin") {
                        this.rootPage = AdminHome;
                      } else {
                        this.rootPage = Shop;
                      }
                    }
                  });
                } else {
                  this.rootPage = Shop;
                }
              });
          } else {
            this.rootPage = Welcome;
          }
          this.platformReady()
        });

      this.datalink.hasLoggedIn().then((hasLoggedIn) => {
        this.storage.ready().then(() => {
          this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
            if (loggedInUserDetails == null) {
              this.rootPage = Shop;
            } else {
              this.Details = loggedInUserDetails[1];
              this.Userfullname = this.Details.lastname + " " + this.Details.firstname;
              this.usertype = this.Details.type;
              this.enableMenu(hasLoggedIn === true, this.usertype);
            }
          });
        });
      });
      this.listenToLoginEvents();
    });


  }

  platformReady() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.hideSplash();
      this.backbutton();
      this.storage.ready().then(() => {
        this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
          if (loggedInUserDetails == null) {
            this.rootPage = Shop;
          } else {
            this.Details = loggedInUserDetails[1];
            this.Userfullname = this.Details.lastname + " " + this.Details.firstname;
            
          }
        });
      });
    });
  }
  hideSplash() {
    setTimeout(() => {
      this.splashScreen.hide();
    }, 100)
  }

  backbutton() {
    this.platform.registerBackButtonAction(() => {
      let nav = this.app.getActiveNav();
      if (nav.canGoBack()) { //Can we go back?
        nav.pop();
      } else {
        let actionSheet = this.alertCtrl.create({
          title: 'Exit GasClub?',
          buttons: [
            {
              text: 'Yes',
              handler: () => {
                this.platform.exitApp(); //Exit from app
              }
            }, {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
              }
            }
          ]
        });
        actionSheet.present();
      }
    });
  }
  isActive(page: PageInterface) {
    if (this.nav.getActive() && this.nav.getActive().component === page.component) {
      return 'primary';
    }
    return;
  }

  openPage(page: PageInterface) {
    this.menu.close();
    this.nav.setRoot(page.component);
    this.activePage = page;
    if (page.logsOut === true) {
      let confirm = this.alertCtrl.create({
        title: 'Logging Out',
        message: 'Are you sure you want to logout?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
                if (loggedInUserDetails === null) {
                  this.rootPage = Shop;
                } else {
                  this.usertype = this.Details.type;
                  if (this.usertype === "Admin") {
                    this.rootPage = AdminHome;
                  } else {
                    this.rootPage = Shop;
                  }
                }
              });
            }
          },
          {
            text: 'Yes',
            handler: () => {
              setTimeout(() => {
                this.storage.remove('userid');
                this.storage.remove('hasLoggedIn');
                this.storage.remove('hasSeenLogin');
                this.storage.remove('hasSeenWelcome');;
                this.storage.remove('loggedInUserDetails');;
                this.events.publish('user:logout');
              }, 1000);
            }
          }
        ]
      });
      confirm.present();
    }

  }

  listenToLoginEvents() {
    this.events.subscribe('user:signup', () => {
      this.enableMenu(true, "");
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false, "");
      this.nav.setRoot(Shop);
    });

    this.events.subscribe('user:netwkerror', () => {
      this.enableMenu(false, "");
      this.nav.setRoot(Shop);
    });

    this.events.subscribe('user:login', (usertype, Userfullname) => {
      this.Userfullname = Userfullname;
      this.enableMenu(true, usertype);
    })
  }

  enableMenu(showmenu, usertype) {
    if (usertype === "User") {
      this.menu.enable(showmenu, 'loggedInUserMenu');
      this.menu.enable(!showmenu, 'loggedInAdminMenu');
      this.menu.enable(!showmenu, 'loggedOutMenu');
    } else if (usertype === "Admin") {
      this.menu.enable(showmenu, 'loggedInAdminMenu');
      this.menu.enable(!showmenu, 'loggedInUserMenu');
      this.menu.enable(!showmenu, 'loggedOutMenu');
    } else if (usertype === ""){
      this.menu.enable(!showmenu, 'loggedOutMenu');
      this.menu.enable(showmenu, 'loggedInAdminMenu');
      this.menu.enable(showmenu, 'loggedInUserMenu');
    }
  }

}
