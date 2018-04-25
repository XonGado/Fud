import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, ModalController } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreModule, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { DinerDetails } from '../../models/dinerdetails.interface'

import { BasketPage } from '../basket/basket';

/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

	searchQuery: string = '';
	itemList: Item[];
	categoryList: Category[] = [];
	orderedItemsList: any[] = [];
	diner: AngularFirestoreDocument<DinerDetails>;
	items: Observable<Item[]>;
	itemsCollectionRef: AngularFirestoreCollection<Item>

	constructor(public navCtrl: NavController,
			  public navParams: NavParams, 
			  public alertCtrl: AlertController, 
			  public events: Events,
			  public modalCtrl: ModalController,
			  private fire: AngularFireAuth, 
			  private firestore: AngularFirestore) {
		this.initializeItems();
	}

	initializeItems(){
		this.itemList = [
			{ id:'0', name:'Green Salad',           image:'samplePP.jpg', description: '', price:'75',  count:0, ordered:0, type:'Appetizers'},
			{ id:'1', name:'Potato Mojos',           image:'samplePP.jpg', description: '', price:'65',  count:0, ordered:0, type:'Appetizers'},
			{ id:'2', name:'French Fries',           image:'samplePP.jpg', description: '', price:'55',  count:0, ordered:0, type:'Appetizers'},
			{ id:'2', name:'Tacoys Special Maki' ,       image:'samplePP.jpg', description: '', price:'115',count:0, ordered:0, type:'Sushi Rolls'},
			{ id:'2', name:'California Maki',         image:'samplePP.jpg', description: '', price:'105',count:0, ordered:0, type:'Sushi Rolls'},
			{ id:'2', name:'Crazy Maki',           image:'samplePP.jpg', description: '', price:'98',  count:0, ordered:0, type:'Sushi Rolls'},
			{ id:'2', name:'Kani Maki',           image:'samplePP.jpg', description: '', price:'90',  count:0, ordered:0, type:'Sushi Rolls'},
			{ id:'2', name:'Tuna Maki',           image:'samplePP.jpg', description: '', price:'95',  count:0, ordered:0, type:'Sushi Rolls'},
			{ id:'2', name:'Philly',             image:'samplePP.jpg', description: '', price:'85',  count:0, ordered:0, type:'Sushi Rolls'},
			{ id:'2', name:'Chili Beef Ramen',         image:'samplePP.jpg', description: '', price:'120',count:0, ordered:0, type:'Ramen'},
			{ id:'2', name:'Tempura Ramen',         image:'samplePP.jpg', description: '', price:'130',count:0, ordered:0, type:'Ramen'},
			{ id:'2', name:'Vegetable Ramen',         image:'samplePP.jpg', description: '', price:'95',  count:0, ordered:0, type:'Ramen'},
			{ id:'2', name:'Chicken Ramen',         image:'samplePP.jpg', description: '', price:'95',  count:0, ordered:0, type:'Ramen'},
			{ id:'2', name:'Seafood Ramen',         image:'samplePP.jpg', description: '', price:'105',count:0, ordered:0, type:'Ramen'},
			{ id:'2', name:'Lomi for Two',           image:'samplePP.jpg', description: '', price:'60',  count:0, ordered:0, type:'Ramen'},
			{ id:'2', name:'Lomi for Family',         image:'samplePP.jpg', description: '', price:'90',  count:0, ordered:0, type:'Ramen'},
			{ id:'2', name:'Lomi for Single',         image:'samplePP.jpg', description: '', price:'35',  count:0, ordered:0, type:'Ramen'},
			{ id:'2', name:'Pasta Marinara',         image:'samplePP.jpg', description: '', price:'75',  count:0, ordered:0, type:'Pasta'},
			{ id:'2', name:'Yakisoba',             image:'samplePP.jpg', description: '', price:'85',  count:0, ordered:0, type:'Pasta'},
			{ id:'2', name:'Beef Gyudon',           image:'samplePP.jpg', description: '', price:'115',count:0, ordered:0, type:'Rice Toppings'},
			{ id:'3', name:'Squid Katsudon',         image:'samplePP.jpg', description: '', price:'85',  count:0, ordered:0, type:'Rice Toppings'},
			{ id:'3', name:'Fish Katsudon',         image:'samplePP.jpg', description: '', price:'95',  count:0, ordered:0, type:'Rice Toppings'},
			{ id:'3', name:'Chicken Oyakudon',         image:'samplePP.jpg', description: '', price:'95',  count:0, ordered:0, type:'Rice Toppings'},
			{ id:'3', name:'Pork Katsudon',         image:'samplePP.jpg', description: '', price:'98',  count:0, ordered:0, type:'Rice Toppings'},
			{ id:'3', name:'Beef Teriyaki',         image:'samplePP.jpg', description: '', price:'85',  count:0, ordered:0, type:'Rice Toppings'},
			{ id:'3', name:'Fish Teriyaki',         image:'samplePP.jpg', description: '', price:'75',  count:0, ordered:0, type:'Rice Toppings'},
			{ id:'3', name:'Squid Teriyaki',         image:'samplePP.jpg', description: '', price:'70',  count:0, ordered:0, type:'Rice Toppings'},
			{ id:'3', name:'Chicken Teriyaki',         image:'samplePP.jpg', description: '', price:'80',  count:0, ordered:0, type:'Rice Toppings'},
			{ id:'3', name:'Pork Teriyaki',         image:'samplePP.jpg', description: '', price:'80',  count:0, ordered:0, type:'Rice Toppings'},
			{ id:'3', name:'Stir Fried Vegetables',     image:'samplePP.jpg', description: '', price:'55',  count:0, ordered:0, type:'Rice Toppings'},
			{ id:'3', name:'Stir Fried Noodles',       image:'samplePP.jpg', description: '', price:'75',  count:0, ordered:0, type:'Rice Toppings'},
			{ id:'3', name:'Sweet & Sour Pork',       image:'samplePP.jpg', description: '', price:'85',  count:0, ordered:0, type:'Rice Toppings'},
			{ id:'3', name:'Shrimp Tempura Teriyaki',     image:'samplePP.jpg', description: '', price:'90',  count:0, ordered:0, type:'Rice Toppings'},
			{ id:'3', name:'Kani (Crab) Tempura Teriyaki',   image:'samplePP.jpg', description: '', price:'95',  count:0, ordered:0, type:'Rice Toppings'},
			{ id:'3', name:'Tocilog',             image:'samplePP.jpg', description: '', price:'40',  count:0, ordered:0, type:'All Day Breakfast'},
			{ id:'3', name:'Longsilog',           image:'samplePP.jpg', description: '', price:'35',  count:0, ordered:0, type:'All Day Breakfast'},
			{ id:'3', name:'Tapsilog',             image:'samplePP.jpg', description: '', price:'45',  count:0, ordered:0, type:'All Day Breakfast'},
			{ id:'3', name:'Hotsilog',             image:'samplePP.jpg', description: '', price:'35',  count:0, ordered:0, type:'All Day Breakfast'},
			{ id:'3', name:'Ube Cake',             image:'samplePP.jpg', description: '', price:'55',  count:0, ordered:0, type:'Dessert'},
			{ id:'3', name:'Whole Buttered Chicken',     image:'samplePP.jpg', description: '', price:'260',count:0, ordered:0, type:'All Time Fillipino Favorites'},
			{ id:'3', name:'Half Buttered Chicken',     image:'samplePP.jpg', description: '', price:'140',count:0, ordered:0, type:'All Time Fillipino Favorites'},
			{ id:'3', name:'Spicy Chicken Wings',       image:'samplePP.jpg', description: '', price:'125',count:0, ordered:0, type:'All Time Fillipino Favorites'},
			{ id:'3', name:'Calamares',           image:'samplePP.jpg', description: '', price:'85',  count:0, ordered:0, type:'All Time Fillipino Favorites'},
			{ id:'3', name:'Fish Fillet',           image:'samplePP.jpg', description: '', price:'75',  count:0, ordered:0, type:'All Time Fillipino Favorites'},
			{ id:'3', name:'Vegetable Mix (Guisado)',     image:'samplePP.jpg', description: '', price:'55',  count:0, ordered:0, type:'All Time Fillipino Favorites'},
			{ id:'3', name:'Bihon Guisado',         image:'samplePP.jpg', description: '', price:'85',  count:0, ordered:0, type:'All Time Fillipino Favorites'},
			{ id:'3', name:'Spicy Chickenkatsu Burger',   image:'samplePP.jpg', description: '', price:'75',  count:0, ordered:0, type:'Burgers'},
			{ id:'3', name:'Spicy Tunakatsu Burger',     image:'samplePP.jpg', description: '', price:'70',  count:0, ordered:0, type:'Burgers'},
			{ id:'3', name:'Spicy Porkkatsu Burger',     image:'samplePP.jpg', description: '', price:'80',  count:0, ordered:0, type:'Burgers'},
			{ id:'3', name:'Cheese Burger',         image:'samplePP.jpg', description: '', price:'35',  count:0, ordered:0, type:'Burgers'},
			{ id:'3', name:'Regular Burger',         image:'samplePP.jpg', description: '', price:'30',  count:0, ordered:0, type:'Burgers'},
			{ id:'3', name:'Ham & Cheese Burger',       image:'samplePP.jpg', description: '', price:'25',  count:0, ordered:0, type:'Burgers'},
			{ id:'3', name:'Cheese & Egg Burger',       image:'samplePP.jpg', description: '', price:'25',  count:0, ordered:0, type:'Burgers'},
			{ id:'3', name:'Ham & Egg Burger',         image:'samplePP.jpg', description: '', price:'25',  count:0, ordered:0, type:'Burgers'},
			{ id:'3', name:'Coke',               image:'samplePP.jpg', description: '', price:'18',  count:0, ordered:0, type:'Drinks'},
			{ id:'3', name:'Sprite',             image:'samplePP.jpg', description: '', price:'18',  count:0, ordered:0, type:'Drinks'},
			{ id:'3', name:'Royal',             image:'samplePP.jpg', description: '', price:'18',  count:0, ordered:0, type:'Drinks'},
			{ id:'3', name:'Iced Tea',             image:'samplePP.jpg', description: '', price:'15',  count:0, ordered:0, type:'Drinks'},
			{ id:'3', name:'Pinneaple Juice',         image:'samplePP.jpg', description: '', price:'15',  count:0, ordered:0, type:'Drinks'}
		];
	}

	initalizeCategories(){
		var list = this.getCategoryList();

		console.log("Got category list");

		for (var i = list.length - 1; i >= 0; i--) {
			this.createCategory(list[i], this.getItemsUnderCategory(list[i]));
		}
	}

	getItems(ev: any) {
		this.initializeItems();

		let val = ev.target.value;

		if (val && val.trim() != '') {
			this.itemList = this.itemList.filter((item) => {
				return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
			})
		}
	}

	getCategoryList(){
		var categories: any[] = [];

		for (var i = this.itemList.length - 1; i >= 0; i--) {
			if(!(categories.includes(this.itemList[i].type))){
				console.log(this.itemList[i].type)
				categories.push(this.itemList[i].type)
			}
		}

		return categories;
	}

	getItemsUnderCategory(category){
		this.initializeItems();

		var content: any[] = [];

		if (category && category.trim() != '') {
			this.itemList = this.itemList.filter((item) => {
			if(item.type.toLowerCase().indexOf(category.toLowerCase()) > -1){
			  	content.push(item);
			}
			})
		}

		return content;
	}

	createCategory(title, items){

		this.categoryList.push({
			title: title,
			items: items
		});

		console.log("Created category: " + title);
		console.log("has the following items: ");
		console.log(items);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad OrderPage');
	this.initalizeCategories();
	}

	confirmQR(){
		console.log("Open confirm modal.");
	}

	addItemToOrder(){
		console.log("Added item to order.");
	}

	subtractItemFromOrder(){
		console.log("Subtract item from order.");
	}

	placeOrder(){

	}

	viewItems(){
		// Create a modal and pass values.
		this.gatherOrder();
		console.log("Create modal to view items.");
		console.log("Customer ordered the following.");
		console.log(this.orderedItemsList);


		let basket = this.modalCtrl.create(BasketPage, { orderedItems: this.orderedItemsList });
		basket.present();
	}

	itemPanned(e, item){
		console.log(e);
		console.log(item.name + ": " + item.count);

		if (e.additionalEvent == "panright"){
			item.count++;
			console.log("Counting for add");
			console.log("Adding " + item.name + "to items.");
		} else if (e.additionalEvent == "panleft"){
			item.count--;
			console.log("Counting for remove");
			console.log("Removing " + item.name + "to items.");
		}

		if (item.count < 0) {
			item.count = 0;
		}

		item.ordered = Math.floor(item.count/5);
	}

	itemTapped(e, item){
		console.log(e.center);

		if (e.center.x >= 150) {
		  	item.ordered++;
		} else if (e.center.x < 150 && item.ordered > 0) {
		  	item.ordered--;
		}
	}

	gatherOrder(){
		for (var category of this.categoryList) {
			console.log(category.items);

			for (var item of category.items) {
				if (item.ordered > 0) {
				  	this.orderedItemsList.push(item);
				}
			}
		}
	}

	clearItem(){

	}

}

interface Item{
  id: string,
  count: number,
  ordered: number,
  image: string,
  name: string,
  description: string,
  price: string,
}

interface Category{
  title: string,
  items: any[]
}

