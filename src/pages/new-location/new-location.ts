import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Datalink } from '../../providers/datalink';
import {Locations } from '../locations/locations';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'page-new-location',
  templateUrl: 'new-location.html',
})
export class NewLocation {
  slideOneForm: FormGroup;
  locationid:any;
  locationname:any;
  locationfees:any;
  constructor(public loadingCtrl: LoadingController,
    public datalink: Datalink, public formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
    this.slideOneForm = formBuilder.group({
      locationname: [''],
      deliveryfees: [''],
    });
    this.locationid = navParams.get('locationid');
    this.locationname = navParams.get('locationname');
    this.locationfees = navParams.get('locationfees');

  }

 ionViewDidLoad() {
   if(this.locationid !== undefined){
    this.slideOneForm.controls['locationname'].setValue(this.locationname);
    this.slideOneForm.controls['deliveryfees'].setValue(this.locationfees);
     var editlocation = document.getElementById("editlocation");
     editlocation.classList.remove("hide");
     var newlocation = document.getElementById("newlocation");
     newlocation.classList.add("hide");
   }
 }
  AddLocation(){
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.AddLocation(this.slideOneForm.value.locationname, this.slideOneForm.value.deliveryfees)
    .subscribe(result => {
      loading.dismiss().catch(() => { });
      if(result == "success"){
        loading.dismiss().catch(() => { });
        this.datalink.showToast('bottom', "Location Added");
        this.navCtrl.setRoot(Locations);
      }else{
        loading.dismiss().catch(() => { });
        this.datalink.showToast('bottom', "Error try again");
      }
    }, err => {
       loading.dismiss().catch(() => { });
       return false;
    });
  }
  UpdateLocation(){
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.UpdateLocation(this.locationid, this.slideOneForm.value.locationname, this.slideOneForm.value.deliveryfees)
    .subscribe(result => {
      loading.dismiss().catch(() => { });
      if(result == "success"){
        loading.dismiss().catch(() => { });
        this.datalink.showToast('bottom', "Location Updated");
        this.navCtrl.setRoot(Locations);
      }else{
        loading.dismiss().catch(() => { });
        this.datalink.showToast('bottom', "Error try again");
      }
    }, err => {
       loading.dismiss().catch(() => { });
       return false;
    });
  }
  
}
