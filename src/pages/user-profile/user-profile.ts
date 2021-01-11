import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, AlertController, Events, LoadingController } from 'ionic-angular';
import { Datalink } from '../../providers/datalink';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfile {
  fname: any;
  lname: any;
  ema: any;
  pho: any;
  pass: any;
  addre: any;
  utype: any
  id: any;
  address: any;
  stateOfOrigin: any;
  date_created: any;
  location: any;
  UDetails: any;
  code: any;
  submitted = false;
  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public datalink: Datalink,
    public storage: Storage,
    public navParams: NavParams,
    public events: Events,
    public alertCtrl: AlertController) {
    this.getDetails();
  }
  getDetails() {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.id = this.UDetails.userid;
          this.lname = this.UDetails.lastname;
          this.fname = this.UDetails.firstname;
          this.ema = this.UDetails.email;
          this.pass = this.UDetails.password;
          this.pho = this.UDetails.phone;
          this.location = this.UDetails.location;
          this.date_created = this.UDetails.date_created;
          this.address = this.UDetails.address;
        }
      });
    });
  }
  EdiInfo() {
    document.getElementById("editprofile").removeAttribute("class");
    document.getElementById("profile").setAttribute("class", "hide");
  }
  firstBack() {
    document.getElementById("profile").removeAttribute("class");
    document.getElementById("editprofile").setAttribute("class", "hide");
  }
  
  onUpdate(form) {
    let loading = this.loadingCtrl.create({
    });
    this.submitted = true;
    let confirm = this.alertCtrl.create({
      title: 'Update Profile',
      message: 'Conitune?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            document.getElementById("profile").removeAttribute("class");
            document.getElementById("editprofile").setAttribute("class", "hide");
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            this.submitted = true;
            this.datalink.UpdateProfile(this.id,this.fname,this.lname,this.pho,this.pass).subscribe(user => {
                loading.dismiss().catch(() => { });
                if ( user[0] === "400") {
                  this.datalink.showToast('bottom', user[1])
                  this.navCtrl.setRoot(UserProfile);
                } else {
                  this.datalink.showToast('bottom', user[1]);
                  this.navCtrl.setRoot(UserProfile);
                  this.events.publish('user:logout');
                }
              }, (err) => {
                loading.dismiss().catch(() => { });
                this.datalink.showToast('bottom', "Your internet connection appears to be offline, please try again");
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
