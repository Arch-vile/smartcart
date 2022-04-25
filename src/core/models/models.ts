export interface Suggestion {
  item: Item;
}

const knownStatusTypes = ['ORDER_RECEIVED', 'ORDER_PROCESSED'] as const;
export type KnownStatusTypes = typeof knownStatusTypes[number];
export type OrderStatus = KnownStatusTypes | 'UNKNOWN';

export interface OrderInfo {
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

export interface OrderListing {
  current: OrderInfo,
  previous: OrderInfo[]
}

export function isKnownOrderStatus(maybe: unknown): maybe is KnownStatusTypes {
  return typeof maybe === 'string' && knownStatusTypes.includes(maybe as any);
}

