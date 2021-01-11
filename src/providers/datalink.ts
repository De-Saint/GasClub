import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { ToastController, AlertController, Platform } from 'ionic-angular';
import { AppRate } from '@ionic-native/app-rate';
@Injectable()
export class Datalink {
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_WELCOME = 'hasSeenWelcome';
  year: any;
  today: any;
  hour: any;
  //  baseUrl: string = 'http://localhost:8084/GasClub/'; 
  //  baseUrl: string = 'http://192.168.179.2:8100/GasClub/'; 
  baseUrl: string = 'http://209.58.143.202:33386/GasClub/';

  constructor(public toastCtrl: ToastController, public appRate: AppRate,
    public alertCtrl: AlertController, public platform: Platform,
    public storage: Storage, public http: Http) {
    this.platform.ready().then(() => {
      this.appRate.preferences = {
        openStoreInApp: true,
        displayAppName: 'GasClub',
        usesUntilPrompt: 4,
        promptAgainForEachNewVersion: false,
        storeAppURL: {
          ios: 'com.gasclub.gasclub',
          android: 'market://details?id=com.gasclub.gasclub'
        },
        customLocale: {
          title: "Rate GasClub",
          message: "If you enjoy using GasClub, would you mind taking a moment to rate it?",
          cancelButtonLabel: "No, Thanks",
          rateButtonLabel: "Rate",
          laterButtonLabel: "Later"
        }
      };
    });
  }
  checkEmail(email) {
    let url = this.baseUrl + 'UserServlet';
    let type = "checkEmail";
    let data = JSON.stringify({ email, type });
    console.log(data);
    return this.http.post(url, data)
      .map(res => (res.json()))
  }
  login(emailphone, password) {
    let loginurl = this.baseUrl + 'UserServlet';
    let type = "Login";
    let logindata = JSON.stringify({ emailphone, password, type });
    return this.http.post(loginurl, logindata)
      .map(res =>
        res.json())
  }
  getLocation() {
    let url = this.baseUrl + 'AdminServlet';
    let type = "getLocation";
    let data = JSON.stringify({ type });
    return this.http.post(url, data)
      .map(res =>
        res.json())
  }
  getProducts() {
    let url = this.baseUrl + 'AdminServlet';
    let type = "GetProducts";
    let data = JSON.stringify({ type });
    return this.http.post(url, data)
      .map(res =>
        res.json())
  }
  GetRefillProducts() {
    let url = this.baseUrl + 'AdminServlet';
    let type = "GetRefillProducts";
    let data = JSON.stringify({ type });
    return this.http.post(url, data)
      .map(res =>
        res.json())
  }
  GetAccessoriesProducts() {
    let url = this.baseUrl + 'AdminServlet';
    let type = "GetAccessoriesProducts";
    let data = JSON.stringify({ type });
    return this.http.post(url, data)
      .map(res =>
        res.json())
  }
  getProductCategories() {
    let url = this.baseUrl + 'AdminServlet';
    let type = "getProductCategories";
    let data = JSON.stringify({ type });
    return this.http.post(url, data)
      .map(res =>
        res.json())
  }
  UserRegistration(email, phone, password, firstname, lastname, location, address, question, answer) {
    let url = this.baseUrl + 'UserServlet';
    let type = "UserRegistration";
    let data = JSON.stringify({ email, phone, password, firstname, lastname, location, address, question, answer, type });
    return this.http.post(url, data)
      .map(res =>
        res.json())
  }
  VerifyEmail(email) {
    let verifyurl = this.baseUrl + 'UserServlet';
    let type = "getRecoveryDetails";
    let verifydata = JSON.stringify({ email, type });
    return this.http.post(verifyurl, verifydata)
      .map(res => (res.json()))
  }
  ResetPassword(userid, password) {
    let loginurl = this.baseUrl + 'UserServlet';
    let type = "ResetPassword";
    let logindata = JSON.stringify({ userid, password, type });
    return this.http.post(loginurl, logindata)
      .map(res =>
        res.json())
  }

  UpdateProfile(id: string, firstname: string, lastname: string, phone: string, password: string) {
    let url = this.baseUrl + 'UserServlet';
    let type = "UpdateProfile";
    let data = JSON.stringify({ type, id, firstname, lastname, phone, password });
    console.log(data);
    return this.http.post(url, data)
      .map(res => (res.json()))
  }

  AddProduct(catid, name, price, properties) {
    let loginurl = this.baseUrl + 'AdminServlet';
    let type = "AddProduct";
    let logindata = JSON.stringify({ catid, name, price, properties, type });
    return this.http.post(loginurl, logindata)
      .map(res =>
        res.json())
  }
  UpdateProduct(productid, name, price, properties) {
    let loginurl = this.baseUrl + 'AdminServlet';
    let type = "UpdateProduct";
    let logindata = JSON.stringify({ productid, name, price, properties, type });
    return this.http.post(loginurl, logindata)
      .map(res =>
        res.json())
  }
  AddLocation(name, fees) {
    let loginurl = this.baseUrl + 'AdminServlet';
    let type = "AddLocation";
    let logindata = JSON.stringify({ name, fees, type });
    return this.http.post(loginurl, logindata)
      .map(res =>
        res.json())
  }
  UpdateLocation(id, name, fees) {
    let loginurl = this.baseUrl + 'AdminServlet';
    let type = "UpdateLocation";
    let logindata = JSON.stringify({ id, name, fees, type });
    return this.http.post(loginurl, logindata)
      .map(res =>
        res.json())
  }
  DeleteLocation(locationid) {
    let loginurl = this.baseUrl + 'AdminServlet';
    let type = "DeleteLocation";
    let logindata = JSON.stringify({ locationid, type });
    return this.http.post(loginurl, logindata)
      .map(res =>
        res.json())
  }

  getAllUsers(count) {
    let usersurl = this.baseUrl + 'AdminServlet';
    let type = "getAllUsers";
    let userdata = JSON.stringify({ type, count });
    return this.http.post(usersurl, userdata)
      .map(res => (res.json()))
  }
  getUsers() {
    let usersurl = this.baseUrl + 'AdminServlet';
    let type = "GetUsers";
    let userdata = JSON.stringify({ type });
    return this.http.post(usersurl, userdata)
      .map(res => (res.json()))
  }

  getCustomerDetails(userid) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "getCustomerDetails";
    let transdata = JSON.stringify({ type, userid });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  DeleteCustomer(userid) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "DeleteCustomer";
    let transdata = JSON.stringify({ type, userid, });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  baseAddress() {
    return this.baseUrl + 'ImageServlet';
  }
  getInboxMessages(userid) {
    let url = this.baseUrl + 'AdminServlet';
    let type = "Message";
    let option = "inbox";
    let data = JSON.stringify({ userid, type, option });
    return this.http.post(url, data)
      .map(res => res.json())

  }
  GetInboxMessages(userid) {
    let url = this.baseUrl + 'AdminServlet';
    let type = "GetInboxMessages";
    let data = JSON.stringify({ userid, type });
    return this.http.post(url, data)
      .map(res => res.json())

  }
  GetSentMessages(userid) {
    let url = this.baseUrl + 'AdminServlet';
    let type = "GetSentMessages";
    let data = JSON.stringify({ userid, type });
    return this.http.post(url, data)
      .map(res => res.json())

  }
  getSentMessages(userid) {
    let url = this.baseUrl + 'AdminServlet';
    let type = "Message";
    let option = "sent";
    let data = JSON.stringify({ userid, type, option });
    return this.http.post(url, data)
      .map(res => res.json())
  }

  deleteMessage(messageid) {
    let url = this.baseUrl + 'AdminServlet';
    let type = "DeleteMessage";
    let data = JSON.stringify({ type, messageid });
    return this.http.post(url, data)
      .map(res => res.json())
  }
  MarkAsRead(messageid) {
    let url = this.baseUrl + 'AdminServlet';
    let type = "MarkAsRead";
    let data = JSON.stringify({ type, messageid });
    return this.http.post(url, data)
      .map(res => res.json())
  }


  getMsgDetails(messageid) {
    let url = this.baseUrl + 'AdminServlet';
    let type = "MessageDetails";
    let jsondata = JSON.stringify({ messageid, type });
    return this.http.post(url, jsondata)
      .map(res => res.json())
  }

  SendMessage(fromuserid, touserid, msgTitle, msgBody) {
    let type = "SendMessage";
    let url = this.baseUrl + 'AdminServlet';
    let jsondata = JSON.stringify({ fromuserid, touserid, msgTitle, msgBody, type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }

  GetProductDetails(productid) {
    let type = "getProductDetails";
    let url = this.baseUrl + 'AdminServlet';
    let jsondata = JSON.stringify({ productid, type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }
  AddToCart(productid, userid, productdetails) {
    let type = "AddToCart";
    let url = this.baseUrl + 'BookingServlet';
    let jsondata = JSON.stringify({ productid, userid, productdetails, type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }
  UpdateCart(cartid, cartproductdetails) {
    let type = "UpdateCart";
    let url = this.baseUrl + 'BookingServlet';
    let jsondata = JSON.stringify({ cartid, cartproductdetails, type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }
  GetUserCartCount(userid) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "GetUserCartCount";
    let jsondata = JSON.stringify({ userid, type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }
  GetUserDiscountPointCount(userid) {
    let url = this.baseUrl + 'UserServlet';
    let type = "GetUserDiscountPointCount";
    let jsondata = JSON.stringify({ userid, type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }
  getCartDetails(cartid) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "GetCartDetails";
    let jsondata = JSON.stringify({ cartid, type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }

  GetUserCartID(userid) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "GetUserCartID";
    let jsondata = JSON.stringify({ userid, type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }
  DeleteProductFromCart(productid, cartid) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "DeleteProductFromCart";
    let jsondata = JSON.stringify({ productid, cartid, type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }
  DeleteProduct(productid) {
    let url = this.baseUrl + 'AdminServlet';
    let type = "DeleteProduct";
    let jsondata = JSON.stringify({ productid, type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }

  EmptyCart(cartid) {
    let url = this.baseUrl + 'AdminServlet';
    let type = "EmptyCart";
    let jsondata = JSON.stringify({ cartid, type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }

  getUserDeliveryDetails(userid) {
    let url = this.baseUrl + 'UserServlet';
    let type = "GetUserDeliveryDetails";
    let jsondata = JSON.stringify({ userid, type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }

  getlocationDetails(locationid) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "GetlocationDetails";
    let jsondata = JSON.stringify({ locationid, type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }
  PlaceOrder(userid, cartid, orderdetails, totalamount, deliveryaddress, deliveryfee) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "PlaceOrder";
    let jsondata = JSON.stringify({ userid, cartid, orderdetails, totalamount, deliveryaddress, deliveryfee, type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }
  getPlacedOrders(userid, ordertype, usertype) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "getPlacedOrders";
    let jsondata = JSON.stringify({ userid, ordertype, usertype, type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }
  GetOrderDetails(orderid) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "GetOrderDetails";
    let jsondata = JSON.stringify({ orderid, type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }
  CancelOrder(userid, orderid, usertype) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "CancelOrder";
    let jsondata = JSON.stringify({ userid, orderid, usertype, type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }
  DeleteOrder(orderid, usertype) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "DeleteOrder";
    let jsondata = JSON.stringify({ orderid, usertype, type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }
  AcceptOrder(orderid, customeruserid) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "AcceptOrder";
    let jsondata = JSON.stringify({ orderid, customeruserid, type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }
  ConfirmOrder(orderid, userid, usertype) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "ConfirmOrder";
    let jsondata = JSON.stringify({ orderid, userid, usertype, type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }
  GetAvailableBalance() {
    let url = this.baseUrl + 'AdminServlet';
    let type = "GetAvailableBalance";
    let jsondata = JSON.stringify({ type });
    return this.http.post(url, jsondata)
      .map(res => (res.json()))
  }

  hasLoggedIn() {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };
  checkHasSeenWelcome() {
    return this.storage.get(this.HAS_SEEN_WELCOME).then((value) => {
      return value;
    })
  };
  SetloggedInUserDetails(loggedInUserDetails) {
    this.storage.set('loggedInUserDetails', loggedInUserDetails);
  };
  getloggedInUserDetails() {
    return this.storage.get('loggedInUserDetails').then((value) => {
      return value;
    });
  };
  displayAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }
  showToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      closeButtonText: 'Ok',
      duration: 2000,
      position: position
    });

    toast.present(toast);
  }

  getCurrentHour() {
    this.today = new Date();
    this.hour = this.today.getHours();

    if (this.hour < 10) {
      this.hour = '0' + this.hour
    }

    this.today = this.hour;
    return this.today;
  }

}
