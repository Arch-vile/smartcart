import {millisToDays} from "./dateUtils";
import {fetchOrder, fetchOrders} from "./kruoka/api";

function windowed(size, from) {
  return from.flatMap((_, i) =>
      i <= from.length - size
          ? [from.slice(i, i + size)]
          : []);
}


/**
 *
 * @param from Array of numbers
 */
function weightedAverage(from) {
  const result = from.reduce((acc, curr, index) => {
    acc.sum += curr * (index + 1);
    acc.count += (index + 1);
    return acc;
  }, {sum: 0, count: 0});
  return result.sum / result.count;
}

/**
 * @param forOrders {string[]} Order IDs for which to fetch items and build history
 * @returns {Promise<{deliveryAt: string, items: string[]}[]>}
 */
async function buildOrderHistory(orderIds) {
  const orders = orderIds.map(async id => {
    return await fetchOrder(id);
  });
  return await Promise.all(orders);
}

/**
 *
 * Dates of the orders on which item was included. Dates are in ascending order.
 *
 * Will only include products ordered more than once
 *
 * @param orderHistory {{deliveryAt: string, items: string[]}[]}
 * @returns {Map<string, Date[]>} Key is item name, and dates when the item was ordered. Dates in ascending order.
 */
function buildItemHistory(orderHistory) {
  const productOrderHistory = new Map();
  orderHistory.forEach(order => {
    const date = new Date(order.deliveryAt);
    order.items.forEach(item => {
      if (!productOrderHistory.get(item)) {
        productOrderHistory.set(item, []);
      }
      productOrderHistory.get(item).push(date);
    });
  });

  const daysSorted = mapMap(productOrderHistory, (key, value) => {
    return value.sort((a, b) => a - b)
  });

  // Only include products ordered more than once
  return new Map([...daysSorted].filter(([k, v]) => v.length > 1));
}

/**
 * Calculates the weighted order frequency for items. e.g.
 * { 'Pirkka appelsiini' => 55 }, ordered on average on 55 day cycle
 *
 * @param itemHistory {Map<string, [Date]>}
 * @returns {Map<string, number>} Frequency for item in days
 */
function calculateItemFrequencies(itemHistory: Map<string, Date[]>) {
  const frequences = mapMap(itemHistory, (name, dates) => {
    const itemDays = dates.sort((a, b) => a.getTime() - b.getTime());
    const orderFrequences = windowed(2, itemDays).map(
        pair => (pair[1] - pair[0]));
    return millisToDays(weightedAverage(orderFrequences));
  });
  return new Map(frequences);
}

/**
 *
 * @param date {Date}
 * @returns {number}
 */
function dateAsMillis(date) {
  return date.getTime();
}

/**
 *
 * @param days {number}
 * @returns {number}
 */
function daysAsMillis(days) {
  return days * 86400 * 1000;
}

/**
 *
 * @param arrayOfMs {number[]}
 * @return {Date[]}
 */
function toDates(arrayOfMs) {
  return arrayOfMs.map(it => new Date(it));
}

/**
 *
 * @param deliveryDate {Date} Delivery date for the current order
 * @param itemLastOrderDate {Date} Date when the item was last ordered
 * @param itemFrequency {number} In days what is the item order frequency
 * @param previousOrderDates {Date[]} Dates of previous orders
 */
function shouldPropose(deliveryDate, itemLastOrderDate, itemFrequency,
    previousOrderDates) {
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
  .filter(it => it > timeRange.start && it <= timeRange.end)

  // But let's not consider orders that are too close to when we last ordered the item
  const foo = overlappingOrders.filter(
      it => it - dateAsMillis(itemLastOrderDate) > span);

  // If no orders yet done during the time span, we should propose item for this order
  // If there already has been an order, we have proposed the item on that one already
  return foo.length === 0;
}


/**
 *
 *
 * @param deliveryDate {Date} Delivery date for current order
 * @param itemsOrderHistory {Map<string,Date[]>} Order history for each item
 * @param itemFrequencies {Map<string,number>} Calculated frequency for each item
 * @param previousOrderDates {Date[]} Dates of previous orders
 * @returns {string[]>}
 */
function proposedItems(deliveryDate, itemsOrderHistory: Map<string, Date[]>, itemFrequencies,
    previousOrderDates) {
  const results = mapMap(itemsOrderHistory, (name, dates) => {
    return shouldPropose(deliveryDate, dates[dates.length - 1],
        itemFrequencies.get(name), previousOrderDates)
  })
  return [...results].filter(([key, value]) => value === true).map(
      ([key, value]) => key);
}

// const itemHistory = buildItemHistory(orderHistoryX);
// console.log(itemHistory);
// const itemFrequencies = calculateItemFrequencies(itemHistory);
// console.log(itemFrequencies);
// const previousOrderDates = orderHistoryX
// .map(it => it.deliveryAt)
// .map(it => new Date(it));
// const toBeProposed = proposedItems(new Date(Date.parse('2022-04-08T10:00:00+00:00')), itemHistory, itemFrequencies,
//     previousOrderDates);
// console.log(toBeProposed.keys());

// Just for testing
// module.exports.shouldPropose = shouldPropose;

// const itemHistory = buildItemHistory(orderHistoryX);
// const itemFrequency = calculateItemFrequency(itemHistory);
// const itemLastOrders = latestItemOrders(itemHistory);
// const nextCart = toBeOrdered(itemFrequency, itemLastOrders);
//
//
// console.log(nextCart);

function mapMap<K,V,T>(map: Map<K,V>, fn: (k:K, v:V) => T) {
  return new Map(Array.from(map, ([key, value]) => [key, fn(key, value)]));
}

function mapToEntries<K,V>(map: Map<K,V>): [K,V][] {
 return Array.from(map.entries());
}

function entriesToMap<K,V>(entries: [K, V][]): Map<K,V> {
 return entries.reduce((acc,next) => acc.set(next[0], next[1]), new Map())
}

/**
 *
 * @param orderHistory
 * @return {Date[]}
 */
function collectOrderDates(orderHistory) {
  return orderHistory
  .map(it => it.deliveryAt)
  .map(it => new Date(it));
}

async function buildProposals() {
  const orderIds = await fetchOrders();
  const orderHistory = await buildOrderHistory(orderIds.processed);
  const nextOrderDateString = (await fetchOrder(orderIds.next)).deliveryAt;
  const nextOrderDate = nextOrderDateString ? new Date(
      Date.parse(nextOrderDateString)) : new Date();
  const itemHistories = buildItemHistory(orderHistory);
  const itemFrequencies = calculateItemFrequencies(itemHistories);
  const orderDates = collectOrderDates(orderHistory);

  return proposedItems(
      nextOrderDate,
      itemHistories,
      itemFrequencies,
      orderDates);

}

// Called from the bookmarklet bookmark, the entry point
export function runBookmarklet() {
  buildProposals().then(proposals => {
    // Start the UI update loop
    setInterval(() => {
      updateUI(proposals);
    }, 500);
  });
}

/**
 *
 * @param itemsForNextOrder {string[]}
 */
function updateUI(itemsForNextOrder) {

  // Remove the previously created html
  const previousHtml = document.getElementById("smartCart");
  if (previousHtml) {
    previousHtml.remove();
  }

  const currentShoppingItems = Array.from(document.querySelectorAll(
      ".shopping-list-item .product-result-name-content .product-name SPAN"))
  .map(it => it.innerHTML);

  const itemsToPropose = itemsForNextOrder.filter(
      it => currentShoppingItems.indexOf(it) === -1);

  const newProposalsHtml = proposalsHTML(proposalItemsHtml(itemsToPropose));
  shoppingListDepartmentsContainer().prepend(htmlToElement(newProposalsHtml));

  //
  // Private functions
  //
  function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
  }

  function shoppingListDepartmentsContainer() {
    return document.querySelector(
        '#shopping-basket-element > section > div > div.shopping-list-shopping-content > ul');
  }

  /**
   *
   * @param items {string[]}
   */
  function proposalItemsHtml(items) {
    return items.map(item => `<li>${item}</li>`).join('');
  }

  function proposalsHTML(itemsHtml) {
    return `
<li id="smartCart" class="shopping-list-department">
  <h3 class="department-heading">
    <span>Muista myös nämä</span>
  </h3>
  <ul class="shopping-list-items department-item-listing">
    <li><ul style="padding-left: 1em; list-style-type:circle; list-style-position: inside;">${itemsHtml}</ul></li>
  </ul>
</li>
`;
  }

}

