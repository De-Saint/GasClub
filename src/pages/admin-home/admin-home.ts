import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Datalink } from '../../providers/datalink';
import { IUser, IMessage, ILocation, IProduct, IOrder } from '../../models/interface';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'page-admin-home',
  templateUrl: 'admin-home.html',
})
export class AdminHome {
  availablebalance: any;
  users: IUser[];
  totaluses: any;
  totalpending: any;
  totaldelivered: any;
  totalcancelled: any;
  firstcount: number = 0;
  products: IProduct[];
  shopproducts: IProduct[];
  accesoryproducts: IProduct[];
  totalproducts: any;
  totalaccesoryproducts: any;
  totalshopproducts: any;
  locations: ILocation[];
  totallocations: any;
  userid: any;
  UDetails: any;
  totalInboxmsgs: any;
  totalSentmsgs: any;
  inboxmsgs: IMessage[];
  sentmsgs: IMessage[];
  orders: IOrder[];
  constructor(
    public loadingCtrl: LoadingController, public storage: Storage, public datalink: Datalink, public navCtrl: NavController, public navParams: NavParams) {
    this.GetAvailableBalance();
    this.getUsers();
    this.getRefill();
    this.getAccessories();
    this.getLocations();
    this.getSentMsg();
    this.getInboxMsg();
    this.getPending();
    this.getDelivered();
    this.getCancelled();
  }

  GetAvailableBalance() {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.GetAvailableBalance()
      .subscribe(result => {
        loading.dismiss().catch(() => { });
        this.availablebalance = result;
      }, err => {
        loading.dismiss().catch(() => { });
        return false;
      });
  }
  getUsers() {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.getUsers()
      .subscribe(users => {
        loading.dismiss().catch(() => { });
        this.totaluses = users;
      }, (err) => {
        loading.dismiss().catch(() => { });
        return false;
      });
  }

  getRefill() {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.GetRefillProducts().subscribe(shopproducts => {
      loading.dismiss().catch(() => { });
      if (shopproducts[0] === "400") {
        this.shopproducts = [];
        this.totalshopproducts = 0;
      } else {
        this.shopproducts = shopproducts[1];
        this.totalshopproducts = this.shopproducts.length;
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      return false;
    });
  }


  getAccessories() {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.GetAccessoriesProducts().subscribe(accesoryproducts => {
      loading.dismiss().catch(() => { });
      if (accesoryproducts[0] === "400") {
        this.accesoryproducts = [];
        this.totalaccesoryproducts = 0;
      } else {
        this.accesoryproducts = accesoryproducts[1];
        this.totalaccesoryproducts = this.accesoryproducts.length;
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      return false;
    });
  }

  getLocations() {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.getLocation().subscribe(locations => {
      loading.dismiss().catch(() => { });
      if (locations[0] === "400") {
        this.locations = [];
        this.totallocations = 0;
      } else {
        this.locations = locations[1];
        this.totallocations = this.locations.length;
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      return false;
    });
  }


  getInboxMsg() {
    let loading = this.loadingCtrl.create({
    });
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          loading.present();
          this.datalink.GetInboxMessages(this.userid)
          .subscribe(inboxmsgs => {
            loading.dismiss().catch(() => { });
            this.totalInboxmsgs = inboxmsgs;
          }, (err) => {
            loading.dismiss().catch(() => { });
            return false;
          });
        }
      });
    });
  }

  getSentMsg() {
    let loading = this.loadingCtrl.create({
    });
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          loading.present();
          this.datalink.GetSentMessages(this.userid)
          .subscribe(sentmsgs => {
            loading.dismiss().catch(() => { });
            this.totalSentmsgs = sentmsgs;
          }, (err) => {
            loading.dismiss().catch(() => { });
            return false;
          });
        }
      });
    });
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
                this.orders = result[1];
                this.totalpending = this.orders.length;
              } else {
                this.orders = [];
                this.totalpending = 0;
              }
            }, err => {
              loading.dismiss().catch(() => { });
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
                this.orders = result[1];
                this.totaldelivered = this.orders.length;
              } else {
                this.orders = [];
                this.totaldelivered = 0;
              }
            }, err => {
              loading.dismiss().catch(() => { });
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
                this.orders = result[1];
                this.totalcancelled = this.orders.length;
              } else {
                this.orders = [];
                this.totalcancelled = 0;
              }
            }, err => {
              loading.dismiss().catch(() => { });
              return false;
            });
        }
      });
    });
  }

}
