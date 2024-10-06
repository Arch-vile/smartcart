import {Order, OrderId, OrderListing} from "../../domain/models";

export interface OrderDao {
  orderById: (id: OrderId) => Promise<Order>,
  orderHistory: () => Promise<OrderListing>
}
