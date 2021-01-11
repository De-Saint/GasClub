import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController, AlertController } from 'ionic-angular';
import { Datalink } from '../../providers/datalink';
import { IProduct } from '../../models/interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Cart } from '../cart/cart';
import {Signup } from '../signup/signup';
import {Login } from '../login/login';

@Component({
  selector: 'page-product-preview',
  templateUrl: 'product-preview.html',
})
export class ProductPreview {
  productid: any;
  props: IProduct[];
  product: IProduct = new IProduct;
  totalprice: any;
  cartid: any;
  UDetails: any;
  userid: any;
  private quantityform: FormGroup; 
  constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController, public formBuilder: FormBuilder, public viewCtrl: ViewController, public datalink: Datalink,
    public navCtrl: NavController, public storage: Storage, public navParams: NavParams) {
    this.productid = navParams.get('productid');
    this.quantityform = this.formBuilder.group({
      quantity: ['']
    });
  }

  ionViewDidLoad() {
    this.GetProductDetails(this.productid);
  }
  close() {
    this.viewCtrl.dismiss();

  }
  GetProductDetails(productid) {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.GetProductDetails(this.productid)
      .subscribe(result => {
        loading.dismiss().catch(() => { });
        this.product = result[0];
        this.props = result[1];
        this.totalprice = this.product.price;
      }, err => {
        loading.dismiss().catch(() => { });
        this.datalink.showToast('bottom', "Server Error try again");
        return false;
      });
  }

  IncreaseQuantity() {
    var currentvalue = this.quantityform.value.quantity;
    var newvalue = parseInt(currentvalue) + 1;
    this.quantityform.controls['quantity'].setValue(newvalue);
    this.totalprice = newvalue * this.product.price;

  }
  DecreaseQuantity() {
    var currentvalue = this.quantityform.value.quantity;
    if (currentvalue === "1" || currentvalue === 1) {
      this.datalink.showToast('buttom', "Please increase the quantity");
      this.totalprice = this.product.price;
      return false;
    } else {
      var newvalue = parseInt(currentvalue) - 1;
      this.quantityform.controls['quantity'].setValue(newvalue);
      this.totalprice = newvalue * this.product.price;
    }

  }
  AddToCart() {
    let loading = this.loadingCtrl.create({
    });
    var amount = "";
    var amt = this.totalprice;
    if (amt == undefined) {
      amount = this.product.price;
    } else {
      amount = this.totalprice;
    }
    var quantity = this.quantityform.value.quantity;
    var productdetails = this.productid + "," + quantity + "," + amount + ";";
    //productid,quantity,amount;
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
          this.LoginAssistance();
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          loading.present();
          this.datalink.AddToCart(String(this.productid), String(this.userid), productdetails)
            .subscribe(result => {
              if (result == "success") {
                loading.dismiss().catch(() => { });
                this.datalink.showToast("bottom", "Product added to Cart");
                this.navCtrl.setRoot(Cart);
              } else if (result == "exist") {
                loading.dismiss().catch(() => { });
                this.datalink.showToast("bottom", 'Product has already been added to Cart.');
                this.navCtrl.setRoot(Cart);
              } else {
                loading.dismiss().catch(() => { });
                this.datalink.showToast("bottom", 'Something went wrong try again.');
              }
            }, err => {
              loading.dismiss().catch(() => { });
              this.datalink.showToast('bottom', "Your internet appears to be offline, try again.");
              return false;
            });
        }
      });
    });
  }


  LoginAssistance(){
    let confirm = this.alertCtrl.create({
      message: "Please Login/Register to continue",
      buttons: [
        {
          text: 'Login',
          handler: () => {
            this.navCtrl.setRoot(Login);
          }
        },
        {
          text: 'Register',
          handler: () => {
            this.navCtrl.setRoot(Signup);
          }
        },
        {
          text: 'Close',
          handler: () => {
            
          }
        }
      ]
    });
    confirm.present();
  }
}
