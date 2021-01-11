import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ActionSheetController, AlertController } from 'ionic-angular';
import { ILocation } from '../../models/interface';
import { Datalink } from '../../providers/datalink';
import { NewLocation } from '../new-location/new-location';

@Component({
  selector: 'page-locations',
  templateUrl: 'locations.html',
})
export class Locations {
  locations: ILocation[];
  originallocations: ILocation[];
  searchTerm: string = '';
  error: any;
  nolocation: any;
  constructor(public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    public datalink: Datalink, public navCtrl: NavController, public navParams: NavParams) {

    this.getLocations();
  }

  getLocations() {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.getLocation().subscribe(locations => {
      loading.dismiss().catch(() => { });
      if (locations[0] === "400") {
        this.error = locations[1];
        this.locations = [];
        this.nolocation = "nolocation";
      } else {
        this.nolocation = "full";
        this.locations = locations[1];
        this.originallocations = locations[1];
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Server error");
      return false;
    });
  }

  addLocation() {
    this.navCtrl.push(NewLocation);
  }
  Location(locationname, locationid, locationfees) {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete Location',
          handler: () => {
            this.deletelocation(locationid, locationname);
          }
        },
        {
          text: 'Edit Location',
          handler: () => {
            this.Editlocation(locationid, locationname, locationfees);
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

  deletelocation(locationid, locationname) {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Are you sure you want to delete ' + locationname + '?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.getLocations();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            this.datalink.DeleteLocation(locationid)
              .subscribe(result => {
                loading.dismiss().catch(() => { });
                if (result == "successful") {
                  loading.dismiss().catch(() => { });
                  this.datalink.showToast('bottom', "Location Deleted");
                  this.getLocations();
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
    confirm.present();
  }


  Editlocation(locationid, locationname, locationfees) {
    this.navCtrl.push(NewLocation, { locationid, locationname, locationfees });
  }


  searchLocation() {
    let term = this.searchTerm;
    if (term.trim() === '' || term.trim().length < 0) {
      if (this.locations.length === 0) {
        this.nolocation = "nolocation";
      } else {
        this.nolocation = "full";
        this.locations = this.originallocations;
      }
    } else {
      //to search an already popolated arraylist
      this.locations = [];
      if (this.originallocations) {
        this.locations = this.originallocations.filter((v) => {
          if (v.name.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1 || v.fees.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1) {
            this.nolocation = "full";
            return true;
          } else {
            if (this.locations.length === 0) {
              this.locations = [];
              this.nolocation = "nolocation";
            }
            return false;
          }
        });
      }
    }
  }
  onClear(ev) {
    this.searchTerm = "";
    this.getLocations();
  }
  onCancel(ev) {
    this.searchTerm = "";
    this.getLocations();
  }
}
