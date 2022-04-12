import {dateFrom} from "../dateUtils"

const knownStatusTypes = ['ORDER_RECEIVED', 'ORDER_PROCESSED'] as const;
type KnownStatusTypes = typeof knownStatusTypes[number];
type OrderStatus = KnownStatusTypes | 'UNKNOWN';

interface OrderInfo {
  id: string
  orderStatus: OrderStatus
  deliveryAt: Date
}

export interface Order {
  info: OrderInfo
  items: Item[]
}

export interface Item {
  name: string,
}

interface OrderListing {
  next: OrderInfo,
  processed: OrderInfo[]
}

/**
 * Return latest orders (about 20) in ascending order (by date) and the closest upcoming order.
 */
export async function fetchOrderListing(): Promise<OrderListing> {
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

    const processed = orders
    .filter(order => order.orderStatus === 'ORDER_PROCESSED');

    return {
      processed,
      next: nextOrders.length !== 0 ? nextOrders[0] : null
    };
  });
}

export async function fetchOrder(orderId: string): Promise<Order> {
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
      items: json.items.map(jsonItem => {
        const item: Item = {
          name: jsonItem.name
        }
        return item;
      })
    };
  });
}

export async function fetchOrders(orderInfos: OrderInfo[]): Promise<Order[]> {
  const orders = orderInfos.map(async info => {
    return await fetchOrder(info.id);
  });
  return await Promise.all(orders);
}

function isKnownOrderStatus(maybe: unknown): maybe is KnownStatusTypes {
  return typeof maybe === 'string' && knownStatusTypes.includes(maybe as any);
}

function orderStatusFrom(orderJson): OrderStatus {
  if (isKnownOrderStatus(orderJson.orderStatus)) {
    return orderJson.orderStatus;
  } else {
    return 'UNKNOWN';
  }
}
