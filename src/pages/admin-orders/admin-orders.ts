import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Datalink } from '../../providers/datalink';
import { IProduct, IOrder } from '../../models/interface';
import { AdminOrderDetails } from '../admin-order-details/admin-order-details';

@Component({
  selector: 'page-admin-orders',
  templateUrl: 'admin-orders.html',
})
export class AdminOrders {
  ORDER: string = 'pend';
  orderSegment: any;
  ord: string;
  orderid: any;
  UDetails: any;
  products: IProduct[];
  orders: IOrder[];
  originalorders: IOrder[];
  userid: any;
  noprod: any;
  getOrderid: string;
  constructor(public loadingCtrl: LoadingController, public storage: Storage, public navCtrl: NavController, public datalink: Datalink, public navParams: NavParams) {
    this.orderSegment = this.navParams.get("order");
    this.orderid = navParams.get('orderid');
    if (this.orderSegment == undefined || this.orderSegment == null) {
      this.ORDER = 'pending';
      this.getPending();
    } else if (this.orderSegment == "pending") {
      this.ORDER = 'pending';
      this.getPending();
    } else if (this.orderSegment == "delivered") {
      this.ORDER = 'delivered';
      this.getDelivered();
    } else if (this.orderSegment == "cancelled") {
      this.ORDER = 'cancelled';
      this.getCancelled();
    }
  }


  getPending() {
    let loading = this.loadingCtrl.create({
    });
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          loading.present();
          this.datalink.getPlacedOrders(this.userid, "Pending", "Admin")
            .subscribe(result => {
              loading.dismiss().catch(() => { });
              if (result[0] === "200") {
                this.originalorders = result[1];
                if (this.originalorders.length > 0) {
                  this.orders = result[1];
                  this.noprod = "prod";
                } else {
                  this.orders = [];
                  this.noprod = "noprod";
                }
              } else {
                this.orders = [];
                this.noprod = "noprod";
                return false;
              }
            }, err => {
              loading.dismiss().catch(() => { });
              this.datalink.showToast('bottom', 'Your internet appears to be offline');
              return false;
            });
        }
      });
    });

  }

  getDelivered() {
    let loading = this.loadingCtrl.create({

    });
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          loading.present();
          this.datalink.getPlacedOrders(this.userid, "Delivered", "Admin")
            .subscribe(result => {
              loading.dismiss().catch(() => { });
              if (result[0] === "200") {
                this.originalorders = result[1];
                if (this.originalorders.length > 0) {
                  this.orders = result[1];
                  this.noprod = "prod";
                } else {
                  this.orders = [];
                  this.noprod = "noprod";
                }
              } else {
                this.orders = [];
                this.noprod = "noprod";
                return false;
              }

            }, err => {
              loading.dismiss().catch(() => { });
              this.datalink.showToast('bottom', 'Your internet appears to be offline');
              return false;
            });
        }
      });
    });
  }
  getCancelled() {
    let loading = this.loadingCtrl.create({
    });
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          loading.present();
          this.datalink.getPlacedOrders(this.userid, "Cancelled", "Admin")
            .subscribe(result => {
              loading.dismiss().catch(() => { });
              if (result[0] === "200") {
                this.originalorders = result[1];
                if (this.originalorders.length > 0) {
                  this.orders = result[1];
                  this.noprod = "prod";
                } else {
                  this.orders = [];
                  this.noprod = "noprod";
                }
              } else {
                this.orders = [];
                this.noprod = "noprod";
                return false;
              }
            }, err => {
              loading.dismiss().catch(() => { });
              this.datalink.showToast('bottom', 'Your internet appears to be offline');
              return false;
            });
        }
      });
    });
  }

  GotoOrderDetails(orderid) {
    this.navCtrl.push(AdminOrderDetails, { orderid });
  }
}
