import { Component, ViewChild } from '@angular/core';
import { NavController, Events, LoadingController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Datalink } from '../../providers/datalink';
import { Storage } from '@ionic/storage';
import { IUser, ILocation } from '../../models/interface';
import { Shop } from '../shop/shop';
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class Signup {
  @ViewChild('signupSlider') signupSlider: any;

  HAS_LOGGED_IN = 'hasLoggedIn';
  loggedInUserDetails: IUser[];
  locations: ILocation[];
  Details: any;
  code: any;
  Username: any;
  userid: any;
  usertype: any;
  slideOneForm: FormGroup;
  slideTwoForm: FormGroup;
  slideThreeForm: FormGroup;
  submitAttempt: boolean = false;
  match: any;
  validate: string;
  check: any;
  Email: any;
  constructor(public storage: Storage,
    public loadingCtrl: LoadingController,
    public events: Events,
    public datalink: Datalink, public formBuilder: FormBuilder,
    public navCtrl: NavController, public navParams: NavParams) {
    this.getLocations();
    this.Email = this.navParams.get('email');

    this.slideOneForm = formBuilder.group({
      email: ['', Validators.compose([Validators.maxLength(30), Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')])],
      phone: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required, Validators.maxLength(15)])],
      confirmpassword: ['', Validators.compose([Validators.minLength(6), Validators.required, Validators.required, Validators.maxLength(15)])]

    });
    this.slideTwoForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(1), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastname: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(1), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      location: ['', Validators.required],
      address: ['', Validators.required]
    });
    this.slideThreeForm = formBuilder.group({
      question: ['', Validators.required],
      answer: ['', Validators.required]
    });

  }

  ionViewDidLoad() {
    this.slideOneForm.controls['email'].setValue(this.Email);
  }
  NextOne() {
    if (!this.slideOneForm.valid) {
      this.signupSlider.slideTo(0);
    } else {
      this.signupSlider.slideNext();
    }
  }

  BackOne() {
    this.signupSlider.slidePrev();
  }
  NextTwo() {
    if (!this.slideTwoForm.valid) {
      this.signupSlider.slideTo(1);
    } else {
      this.signupSlider.slideNext();
    }
  }

  BackTwo() {
    this.signupSlider.slidePrev();
  }
  onCheckPassword(conpass) {
    var pass = this.slideOneForm.value.password;
    if (conpass === pass && conpass.trim().length === pass.trim().length) {
      this.match = "Password confirmed";
    } else {
      this.match = "Password did not match";
    }
  }
  getLocations() {
    this.datalink.getLocation().subscribe(locations => {
      if (locations[0] === "400") {
        this.locations = [];
      } else {
        this.locations = locations[1];
      }
    }, (err) => {
      this.datalink.showToast('bottom', "Server error");
      return false;
    });
    
  }



  save() {
    let loading = this.loadingCtrl.create({
    });
    this.submitAttempt = true;
    if (!this.slideOneForm.valid) {
      this.signupSlider.slideTo(0);
    }
    else if (!this.slideTwoForm.valid) {
      this.signupSlider.slideTo(1);
    } else if (!this.slideThreeForm.valid) {
      this.signupSlider.slideTo(2);
    } else {
      loading.present();
      this.datalink.UserRegistration(
        this.slideOneForm.value.email,
        this.slideOneForm.value.phone,
        this.slideOneForm.value.password,
        this.slideTwoForm.value.firstname,
        this.slideTwoForm.value.lastname,
        this.slideTwoForm.value.location,
        this.slideTwoForm.value.address,
        this.slideThreeForm.value.question,
        this.slideThreeForm.value.answer
      ).subscribe((result) => {
        if (result[0] === "200") {
          loading.dismiss().catch(() => { });
          this.validateLogin(this.slideOneForm.value.email, this.slideOneForm.value.password);
        } else {
          this.datalink.showToast('bottom', result[1]);
        }
      }, (err) => {
        loading.dismiss().catch(() => { });
        return false;
      });
    }


  }

  validateLogin(emailphone, password) {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.login(emailphone, password)
      .subscribe(loggedInUserDetails => {
        this.loggedInUserDetails = loggedInUserDetails;
        if (loggedInUserDetails[0] != 200) {
          this.datalink.displayAlert("Error ", loggedInUserDetails[1]);
          this.events.publish('user:logout');
          loading.dismiss().catch(() => { });
        } else {
          this.storage.ready().then(() => {
            this.storage.set('hasSeenWelcome', true);
            this.storage.set(this.HAS_LOGGED_IN, true);
          });
          this.datalink.SetloggedInUserDetails(this.loggedInUserDetails);
          this.Details = loggedInUserDetails[1];
          this.usertype = this.Details.type;
          this.Username = this.Details.lastname + " " + this.Details.firstname;
          this.datalink.showToast('bottom', "Welcome " + this.Username);
          this.gotoShop(loading);
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

}
