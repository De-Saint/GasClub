import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Datalink } from '../../providers/datalink';
import { ILocation } from '../../models/interface';
import { Storage } from '@ionic/storage';
import { UserOrders } from '../user-orders/user-orders';
import {Cart } from '../cart/cart';
@Component({
  selector: 'page-check-out',
  templateUrl: 'check-out.html',
})
export class CheckOut {
  cartid: any;
  cartamount: any;
  location: ILocation;
  locations: ILocation[];
  UDetails: any;
  totalamount: any;
  discountedamount: any;
  locationfees: any;
  locationaddress: any;
  userid: any;
  locationName: any;
  cartdetails: any;
  deliAdd: any;
  PlaceOrderForm: FormGroup;
  discountpointcount: any;
  grandtotal: any;
  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public datalink: Datalink,
    public alertCtrl: AlertController, public viewCtrl: ViewController, public formBuilder: FormBuilder,
    public storage: Storage, public navParams: NavParams) {
    this.getLocations();
    this.getDetails();
    this.cartid = navParams.get("cartid");
    this.cartamount = navParams.get("cartamount");
    this.cartdetails = navParams.get("cartdet");
    this.PlaceOrderForm = formBuilder.group({
      location: [''],
      deliveryaddress: [''],
    });
  }

  getLocations() {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.getLocation()
    .subscribe(locations => {
      loading.dismiss().catch(() => { });
      if (locations[0] === "400") {
        this.locations = [];
        loading.dismiss().catch(() => { });
      } else {
        loading.dismiss().catch(() => { });
        this.locations = locations[1];
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Server error");
      return false;
    });
  }
  getDetails() {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          this.getUserDeliveryDetails(String(this.userid));
        }
      });
    });
  }

  getUserDeliveryDetails(userid) {
    this.datalink.getUserDeliveryDetails(userid)
      .subscribe(result => {
        this.location = result;
        this.locationfees = this.location.fees;
        this.locationName = this.location.name;
        this.deliAdd = this.location.DeliveryAddress;
        this.discountpointcount = this.location.DiscountPoint;
        this.PlaceOrderForm.controls['deliveryaddress'].setValue(this.deliAdd);
        this.totalamount = parseInt(this.locationfees) + parseInt(this.cartamount);
        if (this.discountpointcount >= 500) {
          var newvalue = 0.05 * this.cartamount;
          this.discountedamount = parseInt(this.totalamount) - newvalue;
          this.grandtotal = this.discountedamount;
        } else if (this.discountpointcount < 500) {
          this.discountedamount = 0;
          this.grandtotal = this.totalamount;
        }
      }, err => {
        this.datalink.showToast('buttom', "Server Error");
        return false;
      });
  }
  onLocationSelect(locationid) {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.getlocationDetails(locationid)
      .subscribe(result => {
        loading.dismiss().catch(() => { });
        this.location = result;
        this.locationfees = this.location.fees;
        if (this.locationName === this.location.name) {
          this.PlaceOrderForm.controls['deliveryaddress'].setValue(this.deliAdd);
        } else if (this.locationName !== this.location.name) {
          this.PlaceOrderForm.controls['deliveryaddress'].setValue("");
        }
        this.totalamount = parseInt(this.locationfees) + parseInt(this.cartamount);
        if (this.discountpointcount >= 500) {
          var newvalue = 0.05 * this.cartamount;
          this.discountedamount = parseInt(this.totalamount) - newvalue;
          this.grandtotal = this.discountedamount;
        } else if (this.discountpointcount < 500) {
          this.discountedamount = 0;
          this.grandtotal = this.totalamount;
        }
      }, err => {
        loading.dismiss().catch(() => { });
        this.datalink.showToast('buttom', "Server Error");
        return false;
      });
  }

  close() {
    this.viewCtrl.dismiss();
  }
  PlaceOrder() {
    let loading = this.loadingCtrl.create({
    });
    var cartdetails = this.cartdetails;
    var totalamount = this.grandtotal;
    var deliveryfee = this.locationfees;
    var deliveryAddress = this.PlaceOrderForm.value.deliveryaddress;
    if (deliveryAddress === "" || deliveryAddress == undefined || deliveryAddress === null) {
      this.datalink.showToast("bottom", "Please fill delivery address");
      return false;
    } else {
      this.storage.ready().then(() => {
        this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
          if (loggedInUserDetails == null) {
          } else {
            this.UDetails = loggedInUserDetails[1];
            this.userid = this.UDetails.userid;
            var closinghr = "17";
            var currentHour = this.datalink.getCurrentHour();
            if (currentHour < closinghr) {
              loading.present();
              this.datalink.PlaceOrder(String(this.userid), String(this.cartid), cartdetails, String(totalamount), deliveryAddress, deliveryfee)
                .subscribe(orderid => {
                  loading.dismiss().catch(() => { });
                  this.datalink.showToast('bottom', "Your order has been placed");
                  var order = "pending";
                  loading.dismiss().catch(() => { });
                  this.navCtrl.setRoot(UserOrders, { orderid, order });
                }, err => {
                  loading.dismiss().catch(() => { });
                  this.datalink.showToast('bottom', "Your internet appears to be offline, try again");
                  return false;
                });
            } else {
              let confirm = this.alertCtrl.create({
                title: 'Late Order',
                message: 'Our closing hour is 5pm, your order will be delivered tomorrow. Do you still want to place this order?',
                buttons: [
                  {
                    text: 'No',
                    handler: () => {
                      loading.dismiss().catch(() => { });
                      this.navCtrl.setRoot(Cart);
                    }
                  },
                  {
                    text: 'Yes',
                    handler: () => {
                      loading.present();
                      this.datalink.PlaceOrder(String(this.userid), String(this.cartid), cartdetails, String(totalamount), deliveryAddress, deliveryfee)
                        .subscribe(orderid => {
                          loading.dismiss().catch(() => { });
                          this.datalink.showToast('bottom', "Your order has been placed");
                          this.datalink.appRate.promptForRating(true);
                          var order = "pending";
                          loading.dismiss().catch(() => { });
                          this.navCtrl.setRoot(UserOrders, { orderid, order });
                        }, err => {
                          loading.dismiss().catch(() => { });
                          this.datalink.showToast('bottom', "Your internet appears to be offline, try again");
                          return false;
                        });
                    }

                  }
                ]
              });
              loading.dismiss().catch(() => { });
              confirm.present();
            }
          }
        });
      });
    }

  }




}
