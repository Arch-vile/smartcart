import {Order, OrderInfo, OrderListing} from "core/domain/models";

export interface OrderDao {
  orderById: (id: string) => Promise<Order>,
  orderHistory: () => Promise<OrderListing>
}
