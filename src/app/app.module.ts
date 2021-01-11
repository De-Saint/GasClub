import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';


import { GasClub } from './app.component';
import { AddProduct } from '../pages/add-product/add-product';
import { AdminHome } from '../pages/admin-home/admin-home';
import { AdminMessages } from '../pages/admin-messages/admin-messages';
import { AdminOrders } from '../pages/admin-orders/admin-orders';
import { AdminOrderDetails } from '../pages/admin-order-details/admin-order-details';
import { AdminProfile } from '../pages/admin-profile/admin-profile';
import { Cart } from '../pages/cart/cart';
import { CheckOut } from '../pages/check-out/check-out';
import { ContactUs } from '../pages/contact-us/contact-us';
import { Locations } from '../pages/locations/locations';
import { Login } from '../pages/login/login';
import { NewLocation } from '../pages/new-location/new-location';
import { NewMessage } from '../pages/new-message/new-message';
import { PasswordRecovery } from '../pages/password-recovery/password-recovery';
import { ProductDetails } from '../pages/product-details/product-details';
import { Products } from '../pages/products/products';
import { ProductPreview } from '../pages/product-preview/product-preview';
import { Shop } from '../pages/shop/shop';
import { Signup } from '../pages/signup/signup';
import { UserDetails } from '../pages/user-details/user-details';
import { MessageDetails } from '../pages/message-details/message-details';
import { UserMessages } from '../pages/user-messages/user-messages';
import { UserOrders } from '../pages/user-orders/user-orders';
import { UserOrderDetails } from '../pages/user-order-details/user-order-details';
import { UserProfile } from '../pages/user-profile/user-profile';
import { Users } from '../pages/users/users';
import { Welcome } from '../pages/welcome/welcome';
import { Datalink } from '../providers/datalink';
import { IonicStorageModule } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CallNumber } from '@ionic-native/call-number';
import { AppRate } from '@ionic-native/app-rate';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'ea3c4b5f'
  },
};

@NgModule({
  declarations: [
    GasClub,
    AddProduct,
    AdminHome,
    AdminMessages,
    AdminOrders,
    AdminOrderDetails,
    AdminProfile,
    Cart,
    CheckOut,
    ContactUs,
    Locations,
    Login,
    NewLocation,
    NewMessage,
    PasswordRecovery,
    ProductDetails,
    Products,
    ProductPreview,
    Shop,
    Signup,
    UserDetails,
    MessageDetails,
    UserMessages,
    UserOrders,
    UserOrderDetails,
    UserProfile,
    Users,
    Welcome
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(GasClub),
    IonicStorageModule.forRoot(),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    GasClub,
    AddProduct,
    AdminHome,
    AdminMessages,
    AdminOrders,
    AdminOrderDetails,
    AdminProfile,
    Cart,
    CheckOut,
    ContactUs,
    Locations,
    Login,
    NewLocation,
    NewMessage,
    PasswordRecovery,
    ProductDetails,
    ProductPreview,
    Products,
    Shop,
    Signup,
    UserDetails,
    MessageDetails,
    UserMessages,
    UserOrders,
    UserOrderDetails,
    UserProfile,
    Users,
    Welcome
  ],
  providers: [
    Datalink,
    StatusBar,
    SplashScreen,
    CallNumber,
    AppRate,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
