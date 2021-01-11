import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, App, LoadingController } from 'ionic-angular';
import { Datalink } from '../../providers/datalink';
import { IProduct } from '../../models/interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Products } from '../products/products';

@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetails {
  productid: any;
  props: IProduct[];
  slideOneForm: FormGroup;
  product: IProduct = new IProduct;
  originalproduct: IProduct = new IProduct;
  constructor(public app: App , public formBuilder: FormBuilder, public loadingCtrl: LoadingController,
    public viewCtrl: ViewController, public datalink: Datalink,
    public navCtrl: NavController, public navParams: NavParams) {
    this.productid = navParams.get('productid');
    this.slideOneForm = formBuilder.group({
      productname: [''],
      productprice: [''],
      productpropertyname: [],
      productpropertyvalue: []
    });
  }

  ionViewDidLoad() {
    this.GetProductDetails();
  }
  close() {
    this.app.getRootNav().push(Products);
    this.viewCtrl.dismiss();
  }
  GetProductDetails() {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.GetProductDetails(this.productid)
      .subscribe(result => {
        loading.dismiss().catch(() => { });
        this.product = result[0];
        this.props = result[1];
      }, err => {
        loading.dismiss().catch(() => { });
        this.datalink.showToast('bottom', "Server Error try again");
      });
  }

  EditProduct() {
    var viewproduct = document.getElementById("viewproduct");
    viewproduct.classList.add("hide");
    var editproduct = document.getElementById("editproduct");
    editproduct.classList.remove("hide");
    this.GetProductDetails();
    var div = document.getElementById("properties");
    div.innerHTML = this.product.properties + " ";
    this.slideOneForm.controls['productpropertyname'].setValue("");
    this.slideOneForm.controls['productpropertyvalue'].setValue("");
  }

  AddProperty() {
    var name = this.slideOneForm.value.productpropertyname;
    var value = this.slideOneForm.value.productpropertyvalue;
    if(name == null || name == ""){
      this.datalink.showToast('bottom', "Please property name is empty");
      return false;
    }
    if(value == null || value == ""){
      this.datalink.showToast('bottom', "Please property value is empty");
      return false;
    }
    var property = name + ":" + value + ",";
    var div = document.getElementById("properties");
    div.classList.remove("hide");
    var properties = div.innerHTML;
    if (properties !== "") {
      div.innerHTML = div.innerHTML + property + " ";
      this.slideOneForm.controls['productpropertyname'].setValue("");
      this.slideOneForm.controls['productpropertyvalue'].setValue("");
    } else {
      div.innerHTML = div.innerHTML + property + " ";
      this.slideOneForm.controls['productpropertyname'].setValue("");
      this.slideOneForm.controls['productpropertyvalue'].setValue("");
    }
  }
  RemoveProperty() {
    var div = document.getElementById("properties");
    div.innerHTML = "";
  }
  UpdateProduct() {
    //----------------------------------------Upload Image------------------------
    let loading = this.loadingCtrl.create({
    });
    var productproperties = "";
    var properties = document.getElementById("properties").innerHTML;
    var price = this.slideOneForm.value.productprice;
    var name = this.slideOneForm.value.productname;
    if (properties === " " || properties.length == 0) {
      productproperties = this.product.properties;
    } else if (properties !== "" || properties.length !== 0) {
      productproperties = properties;
    }
    loading.present();
    this.datalink.UpdateProduct(String(this.productid), name, price, productproperties.trim())
      .subscribe(productid => {
        loading.dismiss().catch(() => { });
        var viewproduct = document.getElementById("viewproduct");
        viewproduct.classList.remove("hide");
        var editproduct = document.getElementById("editproduct");
        editproduct.classList.add("hide");
        this.GetProductDetails();
      }, err => {
        loading.dismiss().catch(() => { });
        this.datalink.showToast('bottom', "Error Updating Product");
        return false;
      });
  }

}



