import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, NavParams } from 'ionic-angular';

import { Shop } from '../shop/shop';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class Welcome {
  @ViewChild('slides') slides: Slides;
  showSkip = true;
  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {

  }
  getStarted() {
    this.navCtrl.setRoot(Shop).then(() => {
      this.storage.ready().then(() => {
        this.storage.set('hasSeenWelcome', true);
      });
    });

  }
  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

	ionViewWillEnter() {
		this.slides.update();
	}
}
