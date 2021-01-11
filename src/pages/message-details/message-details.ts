import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { IMessage } from '../../models/interface';
import { Datalink } from '../../providers/datalink';
import { AdminMessages } from '../admin-messages/admin-messages';
import { UserMessages } from '../user-messages/user-messages';
@Component({
  selector: 'page-message-details',
  templateUrl: 'message-details.html',
})
export class MessageDetails {
  message: IMessage = new IMessage;

  messageid: number;
  successMsg: String;
  UDetails: any;
  userid: any;
  pagefrom: any;
  messagetype:any;
  constructor(
    public datalink: Datalink,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.messageid = navParams.get('messageid');
    this.pagefrom = navParams.get('pagefrom');
    this.messagetype = navParams.get('messagetype');
   
    this.getMsgDetails();
  }

  getMsgDetails() {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.getMsgDetails(this.messageid)
    .subscribe(message => {
      loading.dismiss().catch(() => { });
      this.message = message
    },errro => {
      loading.dismiss().catch(() => { });
    });
  }
 
  deleteMessage() {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Delete Message',
      message: 'Do you want to delete this message?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            if (this.pagefrom === "User") {
              this.navCtrl.setRoot(UserMessages);
            } else if (this.pagefrom === "Admin") {
              this.navCtrl.setRoot(AdminMessages);
            }
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            if (this.messagetype === "Sent") {
              this.datalink.deleteMessage(this.messageid).subscribe(successMsg => {
                loading.dismiss().catch(() => { });
                this.successMsg = successMsg;
                this.datalink.displayAlert("Message", this.successMsg);
                let msg = "sent";
                if (this.pagefrom === "User") {
                  loading.dismiss().catch(() => { });
                  this.navCtrl.setRoot(UserMessages, { msg });
                } else if (this.pagefrom === "Admin") {
                  loading.dismiss().catch(() => { });
                  this.navCtrl.setRoot(AdminMessages, { msg });
                }
              }, (err) => {
                loading.dismiss().catch(() => { });
                this.datalink.showToast('bottom', "Your internet connection appears to be offline.");
                return false;
              });
            } else   if (this.messagetype === "Inbox"){
              this.datalink.deleteMessage(this.messageid).subscribe(successMsg => {
                loading.dismiss().catch(() => { });
                this.successMsg = successMsg;
                this.datalink.displayAlert("Message", this.successMsg);
                if (this.pagefrom === "User") {
                  loading.dismiss().catch(() => { });
                  this.navCtrl.setRoot(UserMessages);
                } else if (this.pagefrom === "Admin") {
                  loading.dismiss().catch(() => { });
                  this.navCtrl.setRoot(AdminMessages);
                }
              }, (err) => {
                loading.dismiss().catch(() => { });
                this.datalink.showToast('bottom', "Your internet connection appears to be offline.");
                return false;
              });
            }
          }
        }
      ]
    });
    loading.dismiss().catch(() => { });
    confirm.present();
  }

}
