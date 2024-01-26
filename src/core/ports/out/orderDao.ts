import {Order, OrderId, OrderInfo, OrderListing} from "core/domain/models";

export interface OrderDao {
  orderById: (id: OrderId) => Promise<Order>,
  orderHistory: () => Promise<OrderListing>
}
