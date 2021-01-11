import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Datalink } from '../../providers/datalink';
import {IUser} from '../../models/interface';

@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html',
})
export class UserDetails {
userid:any;
user: IUser;
  constructor(public loadingCtrl: LoadingController, public datalink: Datalink, public navCtrl: NavController, public navParams: NavParams) {
  this.userid = this.navParams.get("userid");
  }

  ionViewDidLoad() {
    this.getCustomerDetails(this.userid);
  }
 getCustomerDetails(userid) {
  let loading = this.loadingCtrl.create({
  });
  loading.present();
    this.datalink.getCustomerDetails(userid).subscribe(users => {
      this.user = users;
      loading.dismiss().catch(() => { });
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Your internet connection appears to be offline, please try again");
      return false;
    });

  }
}
