import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Cart } from '../cart/cart';
import { IProduct } from '../../models/interface';
import { Datalink } from '../../providers/datalink';
import { Storage } from '@ionic/storage';
import { ProductPreview } from '../product-preview/product-preview';
@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
})
export class Shop {
  products: IProduct[];
  originalproducts: IProduct[];
  error: any;
  noprod: any;
  UDetails: any;
  userid: any;
  cartcount: any;
  discountpointcount: any;
  cartid: any;
  SHOP: string;
  toggled: boolean;
  searchTerm: string = '';
  constructor(public storage: Storage,
    public datalink: Datalink, public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.getRefill();
    this.getUserCartProductCount();
    this.getUserDiscountPointCount();
    this.SHOP = "refill";
    this.toggled = false;
  }

  toggleSearch() {
    this.toggled = this.toggled ? false : true;
  }
  getRefill() {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.GetRefillProducts().subscribe(products => {
      loading.dismiss().catch(() => { });
      if (products[0] === "400") {
        this.products = []
        this.error = products[1];
        this.noprod = "noprod";
        loading.dismiss().catch(() => { });
      } else {
        this.products = products[1];
        this.originalproducts = products[1];
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Your internet appears to be offline, try again");
      return false;
    });
  }


  getAccessories() {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.GetAccessoriesProducts().subscribe(products => {
      loading.dismiss().catch(() => { });
      if (products[0] === "400") {
        this.products = []
        this.error = products[1];
        this.noprod = "noprod";
        loading.dismiss().catch(() => { });
      } else {
        this.products = products[1];
        this.originalproducts = products[1];
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      return false;
    });
  }
  Cart() {
    let cartid = this.cartid;
    this.navCtrl.setRoot(Cart, { cartid });
  }

  GotoProductPreview(productid) {
    this.navCtrl.push(ProductPreview, { productid });
  }

  getUserCartProductCount() {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
          this.cartcount = '';
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          this.datalink.GetUserCartCount(String(this.userid))
            .subscribe(result => {
              this.cartcount = result[0];
              this.cartid = result[1];
            }, err => {
              return false;
            });
        }
      });
    });
  }


  getUserDiscountPointCount() {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
          this.discountpointcount = 0;
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          this.datalink.GetUserDiscountPointCount(String(this.userid))
            .subscribe(result => {
              this.discountpointcount = result;
            }, err => {
              this.datalink.showToast('bottom', "Your internet appears to be offline, try again");
              return false;
            });
        }
      });
    });
  }


  Search() {
    let term = this.searchTerm;
    if (term.trim() === '' || term.trim().length < 0) {
      if (this.products.length === 0) {
        this.noprod = "noprod";
      } else {
        this.noprod = "full";
        this.products = this.originalproducts;
      }
    } else {
      //to search an already popolated arraylist
      this.products = [];
      if (this.originalproducts) {
        this.products = this.originalproducts.filter((v) => {
          if (v.name.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1 || v.properties.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1) {
            this.noprod = "full";
            return true;
          } else {
            if (this.products.length === 0) {
              this.products = [];
              this.noprod = "noprod";
            }
            return false;
          }
        });
      }
    }
  }

  onClear(ev) {
    this.searchTerm = "";
    this.getRefill();
    this.getAccessories();
  }
  onCancel(ev) {
    this.searchTerm = "";
    this.getRefill();
    this.getAccessories();
  }
}
