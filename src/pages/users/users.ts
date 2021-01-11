import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, LoadingController, AlertController } from 'ionic-angular';
import { IUser } from '../../models/interface';
import { Datalink } from '../../providers/datalink';
import { UserDetails } from '../user-details/user-details';
import { NewMessage } from '../new-message/new-message';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class Users {
  users: IUser[];
  originalusers: IUser[];
  error: any;
  nouser: any;
  searchTerm: string = '';
  constructor(public callNumber: CallNumber,
    public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    public datalink: Datalink, public navCtrl: NavController, public navParams: NavParams) {
    this.getUsers();
  }

  getUsers() {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true
    });
    loading.present();
    let firstCount = "0";
    this.datalink.getAllUsers(firstCount).subscribe(users => {
      loading.dismiss().catch(() => { });
      if (users[0] === "400") {
        this.error = users[1];
        this.nouser = "nouser";
      } else {
        this.nouser = "full";
        this.users = users[1];
        this.originalusers = users[1];
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Your internet connection appears to be offline, please try again");
      return false;
    });
  }

  goToDetails(userid, lastname, phone) {
    let actionSheet = this.actionSheetCtrl.create({
      title: lastname,
      buttons: [
        {
          text: 'View',
          handler: () => {
            this.navCtrl.push(UserDetails, { userid });
          }
        },
        {
          text: 'Call',
          handler: () => {
            this.callNumber.callNumber(phone, false)
            .then(data => {JSON.stringify(data)}).catch(err => {JSON.stringify(err)});
         
          }
        },
        {
          text: 'Send Message',
          handler: () => {
            this.navCtrl.push(NewMessage, { userid });
          }
        },
        {
          text: 'Delete ',
          handler: () => {
            this.DeleteUser(userid, lastname);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]

    });
    actionSheet.present();
  }

  DeleteUser(userid, lastname) {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Are you sure you want to delete ' + lastname + '?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.getUsers();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            this.datalink.DeleteCustomer(userid)
              .subscribe(result => {
                loading.dismiss().catch(() => { });
                if (result == "successful") {
                  loading.dismiss().catch(() => { });
                  this.datalink.showToast('bottom', "Customer Account Deleted");
                  this.getUsers();
                } else {
                  loading.dismiss().catch(() => { });
                  this.datalink.showToast('bottom', "Error try again");
                }
              }, err => {
                loading.dismiss().catch(() => { });
                return false;
              });
          }
        }
      ]
    });
    loading.dismiss().catch(() => { });
    confirm.present();

  }

  searchUser() {
    let term = this.searchTerm;
    if (term.trim() === '' || term.trim().length < 0) {
      if (this.users.length === 0) {
        this.nouser = "nouser";
      } else {
        this.nouser = "full";
        this.users = this.originalusers;
      }
    } else {
      //to search an already popolated arraylist
      this.users = [];
      if (this.originalusers) {
        this.users = this.originalusers.filter((v) => {
          if (v.lastname.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1 || v.firstname.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1) {
            this.nouser = "full";
            return true;
          } else {
            if (this.users.length === 0) {
              this.users = [];
              this.nouser = "nouser";
            }
            return false;
          }
        });
      }
    }
  }


  onClear(ev) {
    this.searchTerm = "";
    this.getUsers();
  }
  onCancel(ev) {
    this.searchTerm = "";
    this.getUsers();
  }


}
