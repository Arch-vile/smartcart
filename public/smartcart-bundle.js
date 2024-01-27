(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.smartcart = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderClient = void 0;
const models_1 = require("../core/domain/models");
const dateUtils_1 = require("../utils/dateUtils");
const createOrderClient = () => {
    return {
        orderById: fetchOrder,
        orderHistory: fetchOrderListing
    };
    /**
     * Return latest orders (about 20) in ascending order (by date) and the closest upcoming order.
     */
    async function fetchOrderListing() {
        console.log("fetching orders");
        const url = 'https://www.k-ruoka.fi/kr-api/shoppinghistory?offset=0&includeItems=true';
        return fetch(url)
            .then(resp => resp.json())
            .then(payload => {
            const orders = payload.data.map(orderJson => {
                const order = {
                    orderStatus: orderStatusFrom(orderJson),
                    id: orderJson.orderId,
                    deliveryAt: (0, dateUtils_1.dateFrom)(orderJson.deliveryTime.deliveryStart)
                };
                return order;
            })
                .sort((a, b) => a.deliveryAt.getTime() -
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
    async function fetchOrder(orderId) {
        const url = `https://www.k-ruoka.fi/kr-api/shoppinghistory/${orderId}?updatePricing=0`;
        return fetch(url)
            .then(data => data.json())
            .then(json => {
            return {
                info: {
                    id: json.orderId,
                    orderStatus: orderStatusFrom(json.orderStatus),
                    deliveryAt: (0, dateUtils_1.dateFrom)(json.deliveryTime.deliveryEnd),
                },
                items: json.items.map(jsonItem => {
                    const item = {
                        name: jsonItem.name
                    };
                    return item;
                })
            };
        });
    }
    function orderStatusFrom(orderJson) {
        if ((0, models_1.isKnownOrderStatus)(orderJson.orderStatus)) {
            return orderJson.orderStatus;
        }
        else {
            return 'UNKNOWN';
        }
    }
};
exports.createOrderClient = createOrderClient;

},{"../core/domain/models":3,"../utils/dateUtils":6}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBookmarklet = void 0;
// Called from the bookmarklet bookmark, the entry point
const ordersHttpClient_1 = require("./adapters/ordersHttpClient");
const suggestionService_1 = require("./core/ports/in/suggestionService");
function runBookmarklet() {
    console.log('starting bookmarklet');
    let dao = (0, ordersHttpClient_1.createOrderClient)();
    const suggestionService = (0, suggestionService_1.createSuggestionService)(dao);
    const suggestions = suggestionService.suggestions();
    suggestions.then(proposals => {
        // Start the UI update loop
        setInterval(() => {
            updateUI(proposals);
        }, 500);
    });
}
exports.runBookmarklet = runBookmarklet;
function updateUI(itemsForNextOrder) {
    // Remove the previously created html
    const previousHtml = document.getElementById("smartCart");
    if (previousHtml) {
        previousHtml.remove();
    }
    const currentShoppingItems = Array.from(document.querySelectorAll(".shopping-list-item .product-result-name-content .product-name SPAN"))
        .map(it => it.innerHTML);
    const itemsToPropose = itemsForNextOrder.filter(it => currentShoppingItems.indexOf(it.item.name) === -1);
    const newProposalsHtml = proposalsHTML(proposalItemsHtml(itemsToPropose));
    shoppingListDepartmentsContainer().prepend(htmlToElement(newProposalsHtml));
    //
    // Private functions
    //
    function htmlToElement(html) {
        let template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }
    function shoppingListDepartmentsContainer() {
        return document.querySelector('#shopping-basket-element > section > div > div.shopping-list-shopping-content > ul');
    }
    function proposalItemsHtml(suggestions) {
        return suggestions.map(suggestion => `<li>${suggestion.item.name}</li>`).join('');
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

},{"./adapters/ordersHttpClient":1,"./core/ports/in/suggestionService":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isKnownOrderStatus = exports.asOrderId = void 0;
const knownStatusTypes = ['ORDER_RECEIVED', 'ORDER_PROCESSED'];
function asOrderId(id) {
    return id;
}
exports.asOrderId = asOrderId;
function isKnownOrderStatus(maybe) {
    return typeof maybe === 'string' && knownStatusTypes.includes(maybe);
}
exports.isKnownOrderStatus = isKnownOrderStatus;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldPropose = exports.createSuggestionService = void 0;
const collections_1 = require("../../../utils/collections");
const math_1 = require("../../../utils/math");
const dateUtils_1 = require("../../../utils/dateUtils");
function createSuggestionService(orderDao) {
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
        return suggestedItems(currentOrderDelivery, itemHistories, itemFrequencies, orderDates);
    }
    /**
     *
     * @param deliveryDate Delivery date for current order
     * @param itemsOrderHistory Order history for each item
     * @param itemFrequencies Calculated frequency for each item
     * @param previousOrderDates Dates of previous orders
     * @returns Suggested items
     */
    function suggestedItems(deliveryDate, itemsOrderHistory, itemFrequencies, previousOrderDates) {
        const results = (0, collections_1.mapMap)(itemsOrderHistory, (name, dates) => {
            return shouldPropose(deliveryDate, dates[dates.length - 1], itemFrequencies.get(name), previousOrderDates);
        });
        return (0, collections_1.mapToEntries)(results)
            .filter(([itemName, shouldPropose]) => shouldPropose === true)
            .map(([key, value]) => key)
            .map(itemName => ({ item: { name: itemName } }));
    }
    function collectOrderDates(orderHistory) {
        return orderHistory.map(it => it.info.deliveryAt);
    }
    async function fetchOrders(orderInfos) {
        const orders = orderInfos.map(async (info) => {
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
    function calculateItemFrequencies(itemHistory) {
        const frequences = (0, collections_1.mapMap)(itemHistory, (name, dates) => {
            dates.sort((a, b) => a.getTime() - b.getTime());
            const orderFrequences = (0, collections_1.windowed)(2, dates).map(pair => (pair[1].getTime() - pair[0].getTime()));
            return (0, dateUtils_1.millisToDays)((0, math_1.weightedAverage)(orderFrequences));
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
    function buildItemHistory(orderHistory) {
        const productOrderHistory = new Map();
        orderHistory.forEach(order => {
            order.items.forEach(item => {
                if (!productOrderHistory.get(item.name)) {
                    productOrderHistory.set(item.name, []);
                }
                productOrderHistory.get(item.name).push(order.info.deliveryAt);
            });
        });
        const daysSorted = (0, collections_1.mapMap)(productOrderHistory, (key, value) => {
            return value.sort((a, b) => a.getTime() - b.getTime());
        });
        // Only include products ordered more than once
        return new Map([...daysSorted].filter(([k, v]) => v.length > 1));
    }
}
exports.createSuggestionService = createSuggestionService;
/**
 *
 * @param deliveryDate  Delivery date for the current order
 * @param itemLastOrderDate  Date when the item was last ordered
 * @param itemFrequency  In days what is the item order frequency
 * @param previousOrderDates  Dates of previous orders
 */
function shouldPropose(deliveryDate, itemLastOrderDate, itemFrequency, previousOrderDates) {
    // How much earlier than frequency we propose the item
    const F_LEEWAY = 0.8;
    // We should not propose if time since last item order is less than frequency
    if ((0, dateUtils_1.dateAsMillis)(deliveryDate) - (0, dateUtils_1.dateAsMillis)(itemLastOrderDate) < F_LEEWAY
        * (0, dateUtils_1.daysAsMillis)(itemFrequency)) {
        return false;
    }
    let span = (0, dateUtils_1.daysAsMillis)(itemFrequency);
    const timeRange = {
        start: (0, dateUtils_1.dateAsMillis)(itemLastOrderDate),
        end: (0, dateUtils_1.dateAsMillis)(itemLastOrderDate) + span
    };
    // TODO: We can calculate this instead of iterate
    // Find the time range during which we should propose
    while ((0, dateUtils_1.dateAsMillis)(deliveryDate) > timeRange.end) {
        span = span * 1.5;
        timeRange.start = timeRange.end;
        timeRange.end = timeRange.end + span;
    }
    // Orders done during the time range
    const overlappingOrders = previousOrderDates
        .map(it => (0, dateUtils_1.dateAsMillis)(it))
        .filter(it => it > timeRange.start && it <= timeRange.end);
    // But let's not consider orders that are too close to when we last ordered the item
    const foo = overlappingOrders.filter(it => it - (0, dateUtils_1.dateAsMillis)(itemLastOrderDate) > span);
    // If no orders yet done during the time span, we should propose item for this order
    // If there already has been an order, we have proposed the item on that one already
    return foo.length === 0;
}
exports.shouldPropose = shouldPropose;

},{"../../../utils/collections":5,"../../../utils/dateUtils":6,"../../../utils/math":7}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.windowed = exports.entriesToMap = exports.mapToEntries = exports.mapMap = void 0;
function mapMap(map, fn) {
    return new Map(Array.from(map, ([key, value]) => [key, fn(key, value)]));
}
exports.mapMap = mapMap;
function mapToEntries(map) {
    return Array.from(map.entries());
}
exports.mapToEntries = mapToEntries;
function entriesToMap(entries) {
    return entries.reduce((acc, next) => acc.set(next[0], next[1]), new Map());
}
exports.entriesToMap = entriesToMap;
function windowed(size, from) {
    return from.flatMap((_, i) => i <= from.length - size
        ? [from.slice(i, i + size)]
        : []);
}
exports.windowed = windowed;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.daysAsMillis = exports.dateAsMillis = exports.dateFrom = exports.millisToDays = void 0;
function millisToDays(millis) {
    return Math.floor(millis / 1000 / 86400);
}
exports.millisToDays = millisToDays;
function dateFrom(asString) {
    return new Date(Date.parse(asString));
}
exports.dateFrom = dateFrom;
function dateAsMillis(date) {
    return date.getTime();
}
exports.dateAsMillis = dateAsMillis;
function daysAsMillis(days) {
    return days * 86400 * 1000;
}
exports.daysAsMillis = daysAsMillis;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weightedAverage = void 0;
function weightedAverage(from) {
    const result = from.reduce((acc, curr, index) => {
        acc.sum += curr * (index + 1);
        acc.count += (index + 1);
        return acc;
    }, { sum: 0, count: 0 });
    return result.sum / result.count;
}
exports.weightedAverage = weightedAverage;

},{}]},{},[2])(2)
});
