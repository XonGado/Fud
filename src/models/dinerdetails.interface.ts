export interface DinerDetails {
	dine_name: string
	dine_owner_name: string
	dine_username: string
	dine_email: string
	dine_weblink: string
	dine_number: string
	dine_address: string
	dine_location: {
		latitude: number
		longitude: number
	}
}