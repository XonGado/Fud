export interface Diner{
	address: string,
	email: string,
	name: string,
	number: string,
	owner_name: string,
	username: string,
	weblink: string,
	location: {
		latitude: number
		longitude: number
	}
}