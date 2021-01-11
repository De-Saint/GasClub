import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, AlertController, Platform, Events, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IUser } from '../../models/interface';
import { Datalink } from '../../providers/datalink';
import { AdminHome } from '../admin-home/admin-home';
import { Signup } from '../signup/signup';
import { Shop } from '../shop/shop';
import { PasswordRecovery } from '../password-recovery/password-recovery';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  private login: FormGroup;
  submitted = false;
  loggedInUserDetails: IUser[];
  Details: any;
  usertype: any;
  HAS_LOGGED_IN = 'hasLoggedIn';
  Username: any;
  userid: any;
  email: any;
  message: any;
  errormsg: any;
  constructor(public navCtrl: NavController,
    public storage: Storage, 
    public toastCtrl: ToastController,
    public events: Events,
    public platform: Platform, 
    public alertCtrl: AlertController,
    public datalink: Datalink,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public formBuilder: FormBuilder) {
    this.email = this.navParams.get('email');
    this.login = this.formBuilder.group({
      txt_email: ['', Validators.required],
      txt_password: [''],
    })
  }

  ionViewDidLoad() {
    this.login.controls['txt_email'].setValue(this.email);
  }
  loginForm(form) {
    this.submitted = true;
    if (form.valid) {
      var email = this.login.value.txt_email;
      var pass = this.login.value.txt_password;
      this.validateLogin(email, pass);
    }
  }
  validateLogin(emailphone, password) {
    let loading = this.loadingCtrl.create({
     
    });
    loading.present();
    this.datalink.login(emailphone, password)
      .subscribe(loggedInUserDetails => {
        this.loggedInUserDetails = loggedInUserDetails;

        if (loggedInUserDetails[0] != "200") {
          this.errormsg = loggedInUserDetails[1];
          this.datalink.displayAlert("Error ", this.errormsg);
          this.events.publish('user:logout');
          loading.dismiss().catch(() => { });
        } else {
          this.storage.ready().then(() => {
            this.storage.set(this.HAS_LOGGED_IN, true);
          });
          this.datalink.SetloggedInUserDetails(this.loggedInUserDetails);
          this.Details = loggedInUserDetails[1];
          this.usertype = this.Details.type;
          this.Username = this.Details.lastname + " " + this.Details.firstname;
          this.datalink.showToast('bottom', "Welcome " + this.Username);
          if (this.usertype === "Admin") {
            this.gotoAdminHomePage(loading);
          } else if (this.usertype === "User") {
            this.gotoShop(loading);
          }
          this.userid = this.Details.userid;
          // this.registerDeviceToken(this.userid);
          this.events.publish('user:login', this.usertype, this.Username);
        }
        loading.dismiss().catch(() => { });
      }, (err) => {
        loading.dismiss().catch(() => { });
        this.datalink.showToast('bottom', "Your internet connection appears to be offline");
        return false;
      });
  }
  showPassword(input: any): any {
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  gotoShop(loading) {
    this.navCtrl.setRoot(Shop).then(() => {
      this.storage.ready().then(() => {
        this.storage.set('hasSeenLogin', true);
        loading.dismiss().catch(() => { });
      });
      loading.dismiss().catch(() => { });
    });
    loading.dismiss().catch(() => { });
  }
  gotoAdminHomePage(loading) {
    this.navCtrl.setRoot(AdminHome).then(() => {
      this.storage.ready().then(() => {
        this.storage.set('hasSeenLogin', true);
        loading.dismiss().catch(() => { });
      });
      loading.dismiss().catch(() => { });
    });
    loading.dismiss().catch(() => { });
  }
  // registerDeviceToken(userid) {
  //   this.platform.ready().then(() => {
  //     this.push.register().then((t: PushToken) => {
  //       return this.push.saveToken(t);
  //     }).then((t: PushToken) => {;
  //       this.dataservice.SaveAndUpdateDeviceToken(userid, t.id, t.token).subscribe(value => {
  //         this.storage.set("tokenid", t.id);
  //         this.storage.set("devicetoken", t.token);
  //         this.storage.set("tokenregistered", t.registered);
  //         this.storage.set("tokensaved", t.token);
  //       });
  //     });
  //   });
  // }



  ResetPassword() {
    this.navCtrl.push(PasswordRecovery);
  }
  Register() {
    this.navCtrl.push(Signup);
  }
}
