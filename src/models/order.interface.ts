export interface Order {
    customer_id: string,
    customer_name: string,
    order_cost: number,
    cleared: boolean,
    order_type: any,
    totalItems: number,
    orderNumber: number,
    address: string
}