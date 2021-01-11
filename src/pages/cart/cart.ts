import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Datalink } from '../../providers/datalink';
import { ICart, IProduct } from '../../models/interface';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CheckOut } from '../check-out/check-out';
import { Shop } from '../shop/shop';
import { ProductPreview } from '../product-preview/product-preview';
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class Cart {
  productid: any;
  cartid: any;
  UDetails: any;
  userid: any;
  cartdetails: IProduct[];
  cart: ICart = new ICart;
  quantities: Map<number, string> = new Map<number, string>();
  newamount: any;
  private quantityform: FormGroup;
  quantityforms = [];
  newdets:any;
  details:any;
  originalcart: ICart;
  constructor(public formBuilder: FormBuilder, public modalCtrl: ModalController,
    public datalink: Datalink, public storage: Storage, public alertCtrl: AlertController, public loadingCtrl: LoadingController, 
    public navCtrl: NavController, public navParams: NavParams) {
    this.quantityform = this.formBuilder.group({
      quantity: ['']
    });
    this.productid = navParams.get("productid");
    this.cartid = navParams.get("cartid");
    if (this.cartid !== undefined) {
      this.getCartDetails(String(this.cartid));
    } else if (this.cartid === undefined) {
      this.GetCartDetails();
    }
  }


  GetCartDetails() {
    let loading = this.loadingCtrl.create({
    });
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          loading.present();
          this.datalink.GetUserCartID(String(this.userid))
            .subscribe(result => {
              loading.dismiss().catch(() => { });
              if (result === 0) {
                this.datalink.showToast('bottom', "Your cart is empty");
              } else {
                this.getCartDetails(result);
              }
            }, err => {
              loading.dismiss().catch(() => { });
              this.datalink.showToast("buttom", 'Your internet appears to be offline');
              return false;
            });
        }
      });
    });
  }


  getCartDetails(cartid) {
    let loading = this.loadingCtrl.create({
    });
    if (cartid == undefined) {
    } else {
      loading.present();
      this.datalink.getCartDetails(String(cartid)).subscribe(result => {
        loading.dismiss().catch(() => { });
        if (result[0] === "empty") {
          this.datalink.showToast('bottom', "Your cart is empty");
        } else {
          this.cart = result[0];
          this.cartdetails = result[1];
          let count = 0;
          for (let det of this.cartdetails) {
            this.quantityforms.push(this.quantityform);
            this.GetCartItemQuantity(count);
            this.details = det;
            count++;
          }
        }
      }, error => {
        loading.dismiss().catch(() => { });
        this.datalink.showToast("buttom", 'Your internet appears to be offline');
        return false;
      });
      
    }

  }
  DeleteItemFromCart(productid, cartid) {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Delete Cart Product',
      message: 'Are you sure you want to delete this product?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            loading.dismiss().catch(() => { });
            this.GetCartDetails();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            this.datalink.DeleteProductFromCart(productid, cartid)
            .subscribe(result => {
              loading.dismiss().catch(() => { });
              if (result == "success") {
                this.datalink.showToast('bottom', "Product deleted from cart");
                this.GetCartDetails();
              } else {
                this.datalink.showToast('bottom', 'Something went wrong try again');
              }
            }, error => {
              loading.dismiss().catch(() => { });
              this.datalink.showToast("buttom", 'Your internet appears to be offline');
              return false;
            });
          }
        }
      ]
    });
    loading.dismiss().catch(() => { });
    confirm.present();
  }

  GotoProductPreview(productid) {
    this.navCtrl.push(ProductPreview, { productid });

  }

  GetCartItemQuantity(i) {
    let qua: any;
    qua = this.cartdetails[i].Quantity;
    this.quantities.set(i, qua);
  }

  getMapQuantity(i) {
    let qua = this.quantities.get(i);
    return qua;
  }

  setMapQuantity(i, qua) {
    this.quantities.delete(i);
    this.quantities.set(i, qua);
  }

  IncreaseQuantity(i) {
    var currentvalue = this.getMapQuantity(i);
    var newvalue = parseInt(currentvalue) + 1;
    this.setMapQuantity(i, newvalue);
    this.newamount = newvalue * this.cartdetails[i].price;
    document.getElementById("newamount" + i).textContent = this.newamount;
    var totalamt = document.getElementById("totalamount").textContent;
    var TotalAmt = parseInt(totalamt) + parseInt(this.cartdetails[i].price);
    document.getElementById("totalamount").textContent = String(TotalAmt);
 }


  DecreaseQuantity(i) {
    var currentvalue = this.getMapQuantity(i);
    var cur = parseInt(currentvalue);
    if (currentvalue === "1" || cur === 1) {
      this.datalink.showToast('buttom', "Please increase your Quantity");
      this.newamount = newvalue * this.cartdetails[i].price;
      return false;
    } else {
      var newvalue = parseInt(currentvalue) - 1;
      this.setMapQuantity(i, newvalue);
      this.newamount = newvalue * this.cartdetails[i].price;
      document.getElementById("newamount" + i).textContent = this.newamount;
      var totalamt = document.getElementById("totalamount").textContent;
      var TotalAmt = parseInt(totalamt) - parseInt(this.cartdetails[i].price);
      document.getElementById("totalamount").textContent = String(TotalAmt);
    }
  }
  CheckOut(cartid) {
    if (cartid === undefined || cartid == null) {
      this.datalink.showToast('bottom', 'Your cart is empty');
    } else if (cartid !== undefined || cartid !== null) {
      var cartdet = "";
      let count = 0;
      for (let det of this.cartdetails) {
        var id = document.getElementsByClassName('product-id')[count].innerHTML;
        var amount = document.getElementsByClassName('product-amount')[count].innerHTML;
        var quantity = this.getMapQuantity(count);
       this.newdets = det;
        cartdet += id + "," + quantity + "," + amount + ";";
        count++;
      }
      this.datalink.UpdateCart(cartid, cartdet).subscribe(result => {
      }, err => {
      });
      var cartamount = document.getElementById("totalamount").textContent;
      this.navCtrl.push(CheckOut, { cartid, cartamount, cartdet });
    }

  }

  EmtpyCart(){
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Empty Cart',
      message: 'Are you sure you want to emtpy your cart?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.GetCartDetails();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            this.datalink.EmptyCart(String(this.cartid)).subscribe(result => {
              if(result === "successful"){
                loading.dismiss().catch(() => { });
                this.datalink.appRate.promptForRating(true);
                this.navCtrl.setRoot(Cart);
              }else{
                loading.dismiss().catch(() => { });
                this.datalink.showToast('bottom', 'Something went wrong try again');
              }
            }, err => {
              loading.dismiss().catch(() => { });
              this.datalink.showToast('bottom', 'Your internet appears to be offline');
              return false;
            });
          }
        }
      ]
    });
    loading.dismiss().catch(() => { });
    confirm.present();
    
  }


  GotoShop(){
    this.navCtrl.setRoot(Shop);
  }
}
