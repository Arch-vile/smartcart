import {OrderDao} from "../core/ports/out/orderDao";
import {Order, OrderId, OrderInfo, OrderListing, OrderStatus} from "../core/domain/models";

export interface OrderDaoMock extends OrderDao {
  setupOrder(deliveryDate: string, orderStatus: OrderStatus): Order;
}

export function orderDaoMock(): OrderDaoMock {

  const orderInfos: Map<OrderId, OrderInfo> = new Map();

  return {
    setupOrder: setupOrder,
    orderById,
    orderHistory
  }

  function setupOrder(deliveryDate: string, orderStatus: OrderStatus = "ORDER_PROCESSED"): Order {
    return undefined as any;
  }

  function orderById(id: OrderId): Promise<Order> {
    return null as any;
  }

  function orderHistory(): Promise<OrderListing>{
    return null as any;
  }

}
