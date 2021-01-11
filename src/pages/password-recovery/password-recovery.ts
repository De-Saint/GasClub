import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, LoadingController } from 'ionic-angular';
import { Datalink } from '../../providers/datalink';
import { Login } from '../login/login';
import { IRecovery } from '../../models/interface';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'page-password-recovery',
  templateUrl: 'password-recovery.html',
})
export class PasswordRecovery {
  queryText = '';
  recovery: IRecovery;
  error: any;
  section1: {
    answer?: string
  } = {};
  slideOneForm: FormGroup;
  match:any;
  constructor(public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public formBuilder: FormBuilder,
    public datalink: Datalink, public navCtrl: NavController, public navParams: NavParams) {
    this.slideOneForm = formBuilder.group({
      password: ['', Validators.compose([Validators.minLength(8), Validators.required, Validators.maxLength(15)])],
      confirmpassword: ['', Validators.compose([Validators.minLength(8), Validators.required, Validators.required, Validators.maxLength(15)])]
    });
  }


  checkemail(searchterm) {
    let searchvalue = this.queryText;
    if (searchvalue.trim() != '' || searchvalue.trim().length > 10) {
      this.datalink.VerifyEmail(searchvalue).subscribe(recovery => {
        if (recovery[0] == "400") {
        } else {
          var sectn1 = document.getElementById("section1");
          sectn1.classList.remove("hide");
          this.recovery = recovery;
        }
      }, (err) => {
        this.datalink.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
        return false;
      });
    }
  }
  Next(form) {
    if (this.section1.answer === this.recovery.answer) {
      var emailsearch = document.getElementById("emailsearch");
      emailsearch.classList.add("hide");
      document.getElementById("section2").removeAttribute("hidden");
      document.getElementById("section1").setAttribute("hidden", "true");
    } else {
      this.datalink.showToast('bottom', "Invalid answer");
    }
  }

  onCheckPassword(conpass) {
    var pass = this.slideOneForm.value.password;
    if (conpass === pass && conpass.trim().length === pass.trim().length) {
      this.match = "Password confirmed";
    } else {
      this.match = "Password did not match";
    }
  }
  SubmitPassword() {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.ResetPassword(String(this.recovery.userid), this.slideOneForm.value.password)
      .subscribe(msg => {
        loading.dismiss().catch(() => { });
        if (msg[0] !== "200") {
          this.datalink.showToast('bottom', "Server error, try again");
        } else {
          this.datalink.showToast('bottom', "Password has been reset: login with your new password");
          this.navCtrl.setRoot(Login);
        }
      }, (err) => {
        loading.dismiss().catch(() => { });
        this.datalink.showToast('bottom', "Your internet connection appears to be offline, please try again");
        return false;
      });
  }


}
