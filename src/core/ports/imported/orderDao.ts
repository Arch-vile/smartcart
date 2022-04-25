import {Order, OrderInfo, OrderListing} from "core/models/models";

export interface OrderDao {
  orderById: (id: string) => Promise<Order>,
  orderHistory: () => Promise<OrderListing>
}
