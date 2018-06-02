import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore'
import { DinerProfileEditPage } from '../diner-profile-edit/diner-profile-edit'
import { DinerDetails } from '../../models/dinerdetails.interface'
import { Geolocation } from '@ionic-native/geolocation'

declare var google

@IonicPage()
@Component({
  selector: 'page-diner-profile',
  templateUrl: 'diner-profile.html',
})
export class DinerProfilePage {

  @ViewChild('map') mapElement: ElementRef
  map: any

  name: string; owner_name: string; username: string; email: string; weblink: string; number: string; address: string; location: any
  dinerDocRef: AngularFirestoreDocument<DinerDetails>

  constructor(public navCtrl: NavController, private fire: AngularFireAuth, private firestore: AngularFirestore) { 
    this.dinerDocRef = this.firestore.collection('diners').doc(this.fire.auth.currentUser.uid)
  }

  ionViewDidLoad() {
    this.fetchData()
  }

  fetchData() {
    let that = this
    this.dinerDocRef.ref.get()
    .then(doc => {
      console.log(doc.data())
      that.address = doc.data().dine_address,
      that.email = doc.data().dine_email,
      that.name = doc.data().dine_name,
      that.number = doc.data().dine_number,
      that.owner_name = doc.data().dine_owner_name,
      that.username = doc.data().dine_username,
      that.weblink = doc.data().dine_weblink,
      that.location = doc.data().dine_location

      that.loadMap()
    })
  }

  openEditProfile(){
    this.navCtrl.push(DinerProfileEditPage)
  }

  loadMap(){
    var latLng = new google.maps.LatLng(this.location.latitude, this.location.longitude)

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)

    let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng
    })

    marker.setMap(this.map)
  }

}