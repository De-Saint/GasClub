import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { NewMessage } from '../new-message/new-message'
import { CallNumber } from '@ionic-native/call-number';
import { Storage } from '@ionic/storage';
import { Datalink } from '../../providers/datalink';
import {Signup } from '../signup/signup';
import {Login } from '../login/login';
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUs {

  constructor(public navCtrl: NavController, public datalink: Datalink,
    public callNumber: CallNumber, public storage: Storage, public alertCtrl: AlertController,
    public navParams: NavParams) {
  }

 
  Call(number){
    this.callNumber.callNumber(number, false)
    .then(data => {JSON.stringify(data)}).catch(err => {JSON.stringify(err)});
  }
  SendMessage(){
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
         this.LoginAssistance();
        } else {
          this.navCtrl.push(NewMessage);
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
