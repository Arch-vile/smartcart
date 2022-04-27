import {Order, OrderInfo, Suggestion} from "core/domain/models";
import {OrderDao} from "core/ports/out/orderDao";
import {dateAsMillis, daysAsMillis, millisToDays} from "utils/dateUtils";
import {weightedAverage} from "utils/math";
import {mapMap, mapToEntries, windowed} from "utils/collections";


export interface SuggestionService {
  suggestions: () => Promise<Suggestion[]>
}

export function createSuggestionService(orderDao: OrderDao): SuggestionService {

  return {
    suggestions: () => calculateSuggestions()
  };

  async function calculateSuggestions() {
    const listing = await orderDao.orderHistory();
    const previousOrders = await fetchOrders(listing.previous);
    const itemHistories = buildItemHistory(previousOrders);
    const itemFrequencies = calculateItemFrequencies(itemHistories);
    const orderDates = collectOrderDates(previousOrders);

    const currentOrderDelivery = listing.current ? listing.current.deliveryAt : new Date();
    return suggestedItems(
        currentOrderDelivery,
        itemHistories,
        itemFrequencies,
        orderDates);
  }

  /**
   *
   *
   * @param deliveryDate Delivery date for current order
   * @param itemsOrderHistory Order history for each item
   * @param itemFrequencies Calculated frequency for each item
   * @param previousOrderDates Dates of previous orders
   * @returns Suggested items
   */
  function suggestedItems(deliveryDate: Date,
                         itemsOrderHistory: Map<string, Date[]>,
                         itemFrequencies: Map<string, number>,
                         previousOrderDates: Date[]): Suggestion[] {
    const results = mapMap(itemsOrderHistory, (name, dates) => {
      return shouldPropose(deliveryDate, dates[dates.length - 1], itemFrequencies.get(name)!, previousOrderDates);
    });
    return mapToEntries(results)
    .filter(([itemName, shouldPropose]) => shouldPropose === true)
    .map(([key, value]) => key)
    .map(itemName => ({item: {name: itemName}}))
  }

  function collectOrderDates(orderHistory: Order[]): Date[] {
    return orderHistory.map(it => it.info.deliveryAt);
  }

  async function fetchOrders(orderInfos: OrderInfo[]): Promise<Order[]> {
    const orders = orderInfos.map(async info => {
      return await orderDao.orderById(info.id);
    });
    return await Promise.all(orders);
  }

  /**
   * Calculates the weighted order frequency for items. e.g.
   * { 'Pirkka appelsiini' => 55 }, ordered on average on 55 day cycle
   *
   * @returns Frequency for item in days
   */
  function calculateItemFrequencies(itemHistory: Map<string, Date[]>): Map<string, number> {
    const frequences = mapMap(itemHistory, (name, dates) => {
      dates.sort((a, b) => a.getTime() - b.getTime());
      const orderFrequences = windowed(2, dates).map(pair => (pair[1].getTime() - pair[0].getTime()));
      return millisToDays(weightedAverage(orderFrequences));
    });
    return new Map(frequences);
  }

  /**
   *
   * Dates of the orders on which item was included. Dates are in ascending order.
   * Item name used as key.
   *
   * Will only include products ordered more than once
   *
   */
  function buildItemHistory(orderHistory: Order[]): Map<string, Date[]> {
    const productOrderHistory = new Map<string, Date[]>();
    orderHistory.forEach(order => {
      order.items.forEach(item => {
        if (!productOrderHistory.get(item.name)) {
          productOrderHistory.set(item.name, []);
        }
        productOrderHistory.get(item.name)!.push(order.info.deliveryAt);
      });
    });

    const daysSorted = mapMap(productOrderHistory, (key, value) => {
      return value.sort((a, b) => a.getTime() - b.getTime())
    });

    // Only include products ordered more than once
    return new Map([...daysSorted].filter(([k, v]) => v.length > 1));
  }

}

/**
 *
 * @param deliveryDate  Delivery date for the current order
 * @param itemLastOrderDate  Date when the item was last ordered
 * @param itemFrequency  In days what is the item order frequency
 * @param previousOrderDates  Dates of previous orders
 */
export function shouldPropose(deliveryDate: Date,
                              itemLastOrderDate: Date,
                              itemFrequency: number,
                              previousOrderDates: Date[]): boolean  {
  // How much earlier than frequency we propose the item
  const F_LEEWAY = 0.8;
  // We should not propose if time since last item order is less than frequency
  if (dateAsMillis(deliveryDate) - dateAsMillis(itemLastOrderDate) < F_LEEWAY
      * daysAsMillis(itemFrequency)) {
    return false;
  }
  let span = daysAsMillis(itemFrequency);
  const timeRange = {
    start: dateAsMillis(itemLastOrderDate),
    end: dateAsMillis(itemLastOrderDate) + span
  };
  // TODO: We can calculate this instead of iterate
  // Find the time range during which we should propose
  while (dateAsMillis(deliveryDate) > timeRange.end) {
    span = span * 1.5;
    timeRange.start = timeRange.end;
    timeRange.end = timeRange.end + span;
  }
  // Orders done during the time range
  const overlappingOrders = previousOrderDates
  .map(it => dateAsMillis(it))
  .filter(it => it > timeRange.start && it <= timeRange.end);
  // But let's not consider orders that are too close to when we last ordered the item
  const foo = overlappingOrders.filter(it => it - dateAsMillis(itemLastOrderDate) > span);
  // If no orders yet done during the time span, we should propose item for this order
  // If there already has been an order, we have proposed the item on that one already
  return foo.length === 0;
}
