export interface Order {
    customer_id: string,
    customer_name: string,
    order_cost: number,
    items: any[],
    cleared: boolean,
    order_type: any
}