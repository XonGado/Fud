export interface Customer{
	cust_name: string,
	cust_email: string,
	cust_username: string
}

export class Customer{

	constructor(public name: string, 
				public username: string, 
				public email: string){
	}

	setName(name){
		this.name = name
	}

	setUsername(username){
		this.username = username
	}

	setEmail(email){
		this.email = email
	}

	changeName(name){
		this.name = name
		// Query to firebase.
	}

	changeUsername(username){
		this.username = username
		//Query to firebase.
	}

	changeEmail(email){
		this.email = email
		//Query to firebase.
	}

	getFavorites(){
		// Queries from the database of the user's favorite diners.
	}

}