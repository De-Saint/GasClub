import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Datalink } from '../../providers/datalink';
import { IMessage } from '../../models/interface';
import { MessageDetails } from '../message-details/message-details';
import { NewMessage } from '../new-message/new-message';

@Component({
  selector: 'page-admin-messages',
  templateUrl: 'admin-messages.html',
})
export class AdminMessages {
  userid: any;
  UDetails: any;
  msg: string;
  msgSegment: any;
  noinboxmsg: any;
  nosentmsg: any;
  nooutboxmsg: any;
  inboxmsgs: IMessage[];
  originalinboxmsgs: IMessage[];
  sentmsgs: IMessage[];
  originalsentmsgs: IMessage[];
  inboxsearchTerm: string = '';
  sentsearchTerm: string = '';
  constructor(public loadingCtrl: LoadingController, public datalink: Datalink, public modalCtrl: ModalController,
    public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {
    this.msgSegment = this.navParams.get("msg");

    if (this.msgSegment == undefined || this.msgSegment == null) {
      this.msg = 'inbox';
      this.getInboxMsg();
    } else if (this.msgSegment == "inbox") {
      this.msg = 'inbox';
      this.getInboxMsg();
    } else if (this.msgSegment == "sent") {
      this.msg = 'sent';
      this.getSentMsg();
    }
  }
  goToInboxDetails(messageid) {
    this.MarkAsRead(messageid);
    let pagefrom = "Admin"
    let messagetype = 'Inbox';
    this.navCtrl.push(MessageDetails, { messageid, pagefrom, messagetype });
  }
  goToSentDetails(messageid) {
    let pagefrom = "Admin"
    let messagetype = 'Sent';
    this.navCtrl.push(MessageDetails, { messageid, pagefrom, messagetype });
  }


  getInboxMsg() {
    let loading = this.loadingCtrl.create({
    });
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          loading.present();
          this.datalink.getInboxMessages(this.userid).subscribe(inboxmsgs => {
            loading.dismiss().catch(() => { });
            if (inboxmsgs[0] === "400") {
              this.noinboxmsg = "noinboxmsg";
              this.inboxmsgs = [];
            } else {
              this.noinboxmsg = "inboxmsg";
              this.inboxmsgs = inboxmsgs[1];
              this.originalinboxmsgs = inboxmsgs[1];
            }
          }, (err) => {
            loading.dismiss().catch(() => { });
            this.datalink.showToast('bottom', "Your internet connection appears to be offline.");
            return false;
          });
        }
      });
    });
  }

  NewMessage() {
    let MessageModal = this.modalCtrl.create(NewMessage);
    MessageModal.present();
  }
  searchInboxMessages() {
    let term = this.inboxsearchTerm;
    if (term.trim() === '' || term.trim().length < 0) {
      if (this.inboxmsgs.length === 0) {
        this.noinboxmsg = "noinboxmsg";
      } else {
        this.noinboxmsg = "full";
        this.inboxmsgs = this.originalinboxmsgs;
      }
    } else {
      //to search an already popolated arraylist
      this.inboxmsgs = [];
      if (this.originalinboxmsgs) {
        this.inboxmsgs = this.originalinboxmsgs.filter((v) => {
          if (v.subject.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1 || v.body.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1) {
            this.noinboxmsg = "full";
            return true;
          } else {
            if (this.inboxmsgs.length === 0) {
              this.inboxmsgs = [];
              this.noinboxmsg = "noinboxmsg";
            }
            return false;
          }
        });
      }
    }
  }

  onInboxClear(ev) {
    this.inboxsearchTerm = "";
    this.inboxmsgs = this.originalinboxmsgs;
  }
  onInboxCancel(ev) {
    this.inboxsearchTerm = "";
    this.inboxmsgs = this.originalinboxmsgs;
  }

  getSentMsg() {
    let loading = this.loadingCtrl.create({
    });
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          loading.present();
          this.datalink.getSentMessages(this.userid).subscribe(sentmsgs => {
            loading.dismiss().catch(() => { });
            if (sentmsgs[0] === "400") {
              this.nosentmsg = "nosentmsg";
              this.sentmsgs = [];
            } else {
              this.nosentmsg = "sentmsg";
              this.sentmsgs = sentmsgs[1];
              this.originalsentmsgs = sentmsgs[1];
            }
          }, (err) => {
            loading.dismiss().catch(() => { });
            return false;
          });
        }
      });
    });
  }

  searchSentMessages() {
    let term = this.sentsearchTerm;
    if (term.trim() === '' || term.trim().length < 0) {
      if (this.sentmsgs.length === 0) {
        this.nosentmsg = "nosentmsg";
      } else {
        this.sentmsgs = this.originalsentmsgs;
        this.nosentmsg = "full";
      }
    } else {
      //to search an already popolated arraylist
      this.sentmsgs = [];
      if (this.originalsentmsgs) {
        this.sentmsgs = this.originalsentmsgs.filter((v) => {
          if (v.subject.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1 || v.body.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1) {
            this.nosentmsg = "full";
            return true;
          } else {
            if (this.sentmsgs.length === 0) {
              this.sentmsgs = [];
              this.nosentmsg = "nosentmsg";
            }
            return false;
          }
        });
      }
    }
  }
  onSentClear(ev) {
    this.sentsearchTerm = "";
    this.sentmsgs = this.originalsentmsgs;
  }
  onSentCancel(ev) {
    this.sentsearchTerm = "";
    this.sentmsgs = this.originalsentmsgs;
  }
  MarkAsRead(inboxid) {
    this.datalink.MarkAsRead(inboxid).subscribe(result => {
    }, err => {
      return false;
    });
  }
}
