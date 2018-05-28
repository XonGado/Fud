export interface Notification{
	id: string,
	from: string,
	type: number,
	new: boolean,
	seen: boolean,
	cleared: boolean,
	timestamp: string
}