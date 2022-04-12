import {dateFrom} from "../dateUtils"

const knownStatusTypes = ['ORDER_RECEIVED', 'ORDER_PROCESSED'] as const;
type KnownStatusTypes = typeof knownStatusTypes[number];
type OrderStatus = KnownStatusTypes | 'UNKNOWN';

interface Order {
  orderId: string,
  orderStatus: OrderStatus
  deliveryTime: {
    deliveryStart: Date
  }
}

function isKnownOrderStatus(maybe: unknown): maybe is KnownStatusTypes {
  return typeof maybe === 'string' && knownStatusTypes.includes(maybe as any);
}

function orderStatusFrom(orderJson): OrderStatus {
  if(isKnownOrderStatus(orderJson.orderStatus)) {
    return orderJson.orderStatus;
  } else {
    return 'UNKNOWN';
  }
}

// Returns order IDs (last 20 order I think is returned)
export async function fetchOrders() {
  var url = 'https://www.k-ruoka.fi/kr-api/shoppinghistory?offset=0&includeItems=true';
  return fetch(url)
  .then(resp => resp.json())
  .then(payload => {
    const orders = (payload.data as any[]).map(orderJson => {
      const order: Order = {
        orderStatus: orderStatusFrom(orderJson),
        orderId: orderJson.orderId,
        deliveryTime: {
          deliveryStart: dateFrom(orderJson.deliveryTime.deliveryStart)
        }
      };
      return order;
    });

    const nextOrders = orders
    .filter(order => order.orderStatus === 'ORDER_RECEIVED')
    .sort((a, b) =>
        b.deliveryTime.deliveryStart.getTime() -
        a.deliveryTime.deliveryStart.getTime())
    .map(order => order.orderId);

    return {
      processed: payload.data
      .filter(order => order.orderStatus === 'ORDER_PROCESSED')
      .map(order => order.orderId),
      next: nextOrders.length !== 0 ? nextOrders[0] : null
    };
  });
}

export async function fetchOrder(orderId) {
  var url = `https://www.k-ruoka.fi/kr-api/shoppinghistory/${orderId}?updatePricing=0`;
  return fetch(url)
  .then(data => data.json())
  .then(data => {
    const delivered = data.deliveryTime.deliveryEnd;
    const itemNames = data.items.map(item => item.name);
    return {
      deliveryAt: delivered,
      items: itemNames
    }
  });
}
