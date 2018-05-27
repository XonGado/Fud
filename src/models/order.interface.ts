export interface Order {
	id: string,
    customer: string,
    cost: number,
    cleared: boolean,
    type: any,
    totalItems: number,
    orderNumber: number
}