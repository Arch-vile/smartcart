import {dateFrom} from "utils/dateUtils"
import {OrderDao} from "core/ports/imported/orderDao";
import {
  isKnownOrderStatus,
  Item,
  Order,
  OrderInfo,
  OrderListing,
  OrderStatus
} from "core/models/models";

export const createOrderClient = (): OrderDao => {
  return {
    orderById:  fetchOrder,
    orderHistory: fetchOrderListing
  };

  /**
   * Return latest orders (about 20) in ascending order (by date) and the closest upcoming order.
   */
  async function fetchOrderListing(): Promise<OrderListing> {
    const url = 'https://www.k-ruoka.fi/kr-api/shoppinghistory?offset=0&includeItems=true';
    return fetch(url)
    .then(resp => resp.json())
    .then(payload => {
      const orders = (payload.data as any[]).map(orderJson => {
        const order: OrderInfo = {
          orderStatus: orderStatusFrom(orderJson),
          id: orderJson.orderId,
          deliveryAt: dateFrom(orderJson.deliveryTime.deliveryStart)
        };
        return order;
      })
      .sort((a, b) =>
          a.deliveryAt.getTime() -
          b.deliveryAt.getTime());

      const nextOrders = orders
      .filter(order => order.orderStatus === 'ORDER_RECEIVED');

      const previous = orders
      .filter(order => order.orderStatus === 'ORDER_PROCESSED');

      return {
        previous,
        current: nextOrders.length !== 0 ? nextOrders[0] : null
      };
    });
  }

  async function fetchOrder(orderId: string): Promise<Order> {
    const url = `https://www.k-ruoka.fi/kr-api/shoppinghistory/${orderId}?updatePricing=0`;
    return fetch(url)
    .then(data => data.json())
    .then(json => {
      return {
        info: {
          id: json.orderId,
          orderStatus: orderStatusFrom(json.orderStatus),
          deliveryAt: dateFrom(json.deliveryTime.deliveryEnd),
        },
        items: (json.items as any[]).map(jsonItem  => {
          const item: Item = {
            name: jsonItem.name
          }
          return item;
        })
      };
    });
  }

  function orderStatusFrom(orderJson: any): OrderStatus {
    if (isKnownOrderStatus(orderJson.orderStatus)) {
      return orderJson.orderStatus;
    } else {
      return 'UNKNOWN';
    }
  }
}

