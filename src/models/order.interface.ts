export interface Order {
    customer_id: string,
    customer_name: string,
    order_type: string,
    order_cost: number,
    items: any[],
    cleared: boolean
}