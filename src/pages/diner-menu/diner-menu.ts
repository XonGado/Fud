import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { ItemEditPage } from "../item-edit/item-edit";
import { ItemAddPage } from "../item-add/item-add";

/**
 * Generated class for the DinerMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-diner-menu',
  templateUrl: 'diner-menu.html',
})
export class DinerMenuPage {

	searchQuery: string = '';
  	itemList: Item[];

	constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
		this.initializeItems();
	}

	// testCreateItem(id, imageurl, name, description, price, type){
	// 	this.itemList.push({ 
	// 		id: id, 
	// 		name: name, 
	// 		image: imageurl, 
	// 		description: description, 
	// 		price: price, 	
	// 		type: type
	// 	});

	// 	console.log("Created " + name + ".");
	// }

	ionViewDidLoad() {
		console.log('ionViewDidLoad DinerMenuPage');
		// this.testCreateItem("10", "samplePP.jpg", "Item", "This description", "100", "Nothing");
	}

	initializeItems(){
		this.itemList = [
			{ id:'0', name:'Green Salad', 					image:'samplePP.jpg', description: '', price:'75', 	type:'Appetizers'},
			{ id:'1', name:'Potato Mojos', 					image:'samplePP.jpg', description: '', price:'65', 	type:'Appetizers'},
			{ id:'2', name:'French Fries', 					image:'samplePP.jpg', description: '', price:'55', 	type:'Appetizers'},
			{ id:'2', name:'Tacoys Special Maki' , 			image:'samplePP.jpg', description: '', price:'115', type:'Sushi Rolls'},
			{ id:'2', name:'California Maki', 				image:'samplePP.jpg', description: '', price:'105', type:'Sushi Rolls'},
			{ id:'2', name:'Crazy Maki', 					image:'samplePP.jpg', description: '', price:'98', 	type:'Sushi Rolls'},
			{ id:'2', name:'Kani Maki', 					image:'samplePP.jpg', description: '', price:'90', 	type:'Sushi Rolls'},
			{ id:'2', name:'Tuna Maki', 					image:'samplePP.jpg', description: '', price:'95', 	type:'Sushi Rolls'},
			{ id:'2', name:'Philly', 						image:'samplePP.jpg', description: '', price:'85', 	type:'Sushi Rolls'},
			{ id:'2', name:'Chili Beef Ramen', 				image:'samplePP.jpg', description: '', price:'120', type:'Ramen'},
			{ id:'2', name:'Tempura Ramen', 				image:'samplePP.jpg', description: '', price:'130', type:'Ramen'},
			{ id:'2', name:'Vegetable Ramen', 				image:'samplePP.jpg', description: '', price:'95', 	type:'Ramen'},
			{ id:'2', name:'Chicken Ramen', 				image:'samplePP.jpg', description: '', price:'95', 	type:'Ramen'},
			{ id:'2', name:'Seafood Ramen', 				image:'samplePP.jpg', description: '', price:'105', type:'Ramen'},
			{ id:'2', name:'Lomi for Two', 					image:'samplePP.jpg', description: '', price:'60', 	type:'Ramen'},
			{ id:'2', name:'Lomi for Family', 				image:'samplePP.jpg', description: '', price:'90', 	type:'Ramen'},
			{ id:'2', name:'Lomi for Single', 				image:'samplePP.jpg', description: '', price:'35', 	type:'Ramen'},
			{ id:'2', name:'Pasta Marinara', 				image:'samplePP.jpg', description: '', price:'75', 	type:'Pasta'},
			{ id:'2', name:'Yakisoba', 						image:'samplePP.jpg', description: '', price:'85', 	type:'Pasta'},
			{ id:'2', name:'Beef Gyudon', 					image:'samplePP.jpg', description: '', price:'115', type:'Rice Toppings'},
			{ id:'3', name:'Squid Katsudon', 				image:'samplePP.jpg', description: '', price:'85', 	type:'Rice Toppings'},
			{ id:'3', name:'Fish Katsudon', 				image:'samplePP.jpg', description: '', price:'95', 	type:'Rice Toppings'},
			{ id:'3', name:'Chicken Oyakudon', 				image:'samplePP.jpg', description: '', price:'95', 	type:'Rice Toppings'},
			{ id:'3', name:'Pork Katsudon', 				image:'samplePP.jpg', description: '', price:'98', 	type:'Rice Toppings'},
			{ id:'3', name:'Beef Teriyaki', 				image:'samplePP.jpg', description: '', price:'85', 	type:'Rice Toppings'},
			{ id:'3', name:'Fish Teriyaki', 				image:'samplePP.jpg', description: '', price:'75', 	type:'Rice Toppings'},
			{ id:'3', name:'Squid Teriyaki', 				image:'samplePP.jpg', description: '', price:'70', 	type:'Rice Toppings'},
			{ id:'3', name:'Chicken Teriyaki', 				image:'samplePP.jpg', description: '', price:'80', 	type:'Rice Toppings'},
			{ id:'3', name:'Pork Teriyaki', 				image:'samplePP.jpg', description: '', price:'80', 	type:'Rice Toppings'},
			{ id:'3', name:'Stir Fried Vegetables', 		image:'samplePP.jpg', description: '', price:'55', 	type:'Rice Toppings'},
			{ id:'3', name:'Stir Fried Noodles', 			image:'samplePP.jpg', description: '', price:'75', 	type:'Rice Toppings'},
			{ id:'3', name:'Sweet & Sour Pork', 			image:'samplePP.jpg', description: '', price:'85', 	type:'Rice Toppings'},
			{ id:'3', name:'Shrimp Tempura Teriyaki', 		image:'samplePP.jpg', description: '', price:'90', 	type:'Rice Toppings'},
			{ id:'3', name:'Kani (Crab) Tempura Teriyaki', 	image:'samplePP.jpg', description: '', price:'95', 	type:'Rice Toppings'},
			{ id:'3', name:'Tocilog', 						image:'samplePP.jpg', description: '', price:'40', 	type:'All Day Breakfast'},
			{ id:'3', name:'Longsilog', 					image:'samplePP.jpg', description: '', price:'35', 	type:'All Day Breakfast'},
			{ id:'3', name:'Tapsilog', 						image:'samplePP.jpg', description: '', price:'45', 	type:'All Day Breakfast'},
			{ id:'3', name:'Hotsilog', 						image:'samplePP.jpg', description: '', price:'35', 	type:'All Day Breakfast'},
			{ id:'3', name:'Ube Cake', 						image:'samplePP.jpg', description: '', price:'55', 	type:'Dessert'},
			{ id:'3', name:'Whole Buttered Chicken', 		image:'samplePP.jpg', description: '', price:'260', type:'All Time Fillipino Favorites'},
			{ id:'3', name:'Half Buttered Chicken', 		image:'samplePP.jpg', description: '', price:'140', type:'All Time Fillipino Favorites'},
			{ id:'3', name:'Spicy Chicken Wings', 			image:'samplePP.jpg', description: '', price:'125', type:'All Time Fillipino Favorites'},
			{ id:'3', name:'Calamares', 					image:'samplePP.jpg', description: '', price:'85', 	type:'All Time Fillipino Favorites'},
			{ id:'3', name:'Fish Fillet', 					image:'samplePP.jpg', description: '', price:'75', 	type:'All Time Fillipino Favorites'},
			{ id:'3', name:'Vegetable Mix (Guisado)', 		image:'samplePP.jpg', description: '', price:'55', 	type:'All Time Fillipino Favorites'},
			{ id:'3', name:'Bihon Guisado', 				image:'samplePP.jpg', description: '', price:'85', 	type:'All Time Fillipino Favorites'},
			{ id:'3', name:'Spicy Chickenkatsu Burger', 	image:'samplePP.jpg', description: '', price:'75', 	type:'Burgers'},
			{ id:'3', name:'Spicy Tunakatsu Burger', 		image:'samplePP.jpg', description: '', price:'70', 	type:'Burgers'},
			{ id:'3', name:'Spicy Porkkatsu Burger', 		image:'samplePP.jpg', description: '', price:'80', 	type:'Burgers'},
			{ id:'3', name:'Cheese Burger', 				image:'samplePP.jpg', description: '', price:'35', 	type:'Burgers'},
			{ id:'3', name:'Regular Burger', 				image:'samplePP.jpg', description: '', price:'30', 	type:'Burgers'},
			{ id:'3', name:'Ham & Cheese Burger', 			image:'samplePP.jpg', description: '', price:'25', 	type:'Burgers'},
			{ id:'3', name:'Cheese & Egg Burger', 			image:'samplePP.jpg', description: '', price:'25', 	type:'Burgers'},
			{ id:'3', name:'Ham & Egg Burger', 				image:'samplePP.jpg', description: '', price:'25', 	type:'Burgers'},
			{ id:'3', name:'Coke', 							image:'samplePP.jpg', description: '', price:'18', 	type:'Drinks'},
			{ id:'3', name:'Sprite', 						image:'samplePP.jpg', description: '', price:'18', 	type:'Drinks'},
			{ id:'3', name:'Royal', 						image:'samplePP.jpg', description: '', price:'18', 	type:'Drinks'},
			{ id:'3', name:'Iced Tea', 						image:'samplePP.jpg', description: '', price:'15', 	type:'Drinks'},
			{ id:'3', name:'Pinneaple Juice', 				image:'samplePP.jpg', description: '', price:'15', 	type:'Drinks'}
		];
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

	addItem(){
		this.navCtrl.push(ItemAddPage);
	}

	editItem(id, name){
		console.log("Editing item.");
		this.navCtrl.push(ItemEditPage, {
			data: id
		});
	}

	deleteItem(id, name){
		console.log("Tried to delete " + name + ".");
		console.log("The id of the item is " + id + ".");

		let confirm = this.alertCtrl.create({
	      title: 'Farewell delicious food',
	      message: 'Do you want to remove ' + name + ' from the menu?',
	      buttons: [
	        {
	          text: 'Remove',
	          handler: () => {
	            console.log('Disagree clicked');
	            // Insert database queries here.
	          }
	        },
	        {
	          text: 'No!',
	          handler: () => {
	            console.log('Agree clicked');
	            // Insert database queries here.
	          }
	        }
	      ]
	    });

	    confirm.present();
	}

	closePage(){
		this.navCtrl.pop();
	}
}

interface Diner{
	id: string,
	name: string,
	phone: string
	address: string, 
	description: string,
}

interface Item{
	id: string,
	image: string,
	name: string,
	description: string,
	price: string,
	type: string
}

interface Menu{
	id: string,
}