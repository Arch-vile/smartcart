(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _smartcart = require("./smartcart");

// Attach to the window to make available on page from the Browserified bundle
window.runSmartcartBookmarklet = _smartcart.runBookmarklet;

},{"./smartcart":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dateFrom = dateFrom;
exports.millisToDays = millisToDays;

function millisToDays(millis) {
  return Math.floor(millis / 1000 / 86400);
}

function dateFrom(asString) {
  return new Date(Date.parse(asString));
}

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchOrder = fetchOrder;
exports.fetchOrderListing = fetchOrderListing;
exports.fetchOrders = fetchOrders;

var _dateUtils = require("../dateUtils");

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var knownStatusTypes = ['ORDER_RECEIVED', 'ORDER_PROCESSED'];
/**
 * Return latest orders (about 20) in ascending order (by date) and the closest upcoming order.
 */

function fetchOrderListing() {
  return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var url;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = 'https://www.k-ruoka.fi/kr-api/shoppinghistory?offset=0&includeItems=true';
            return _context.abrupt("return", fetch(url).then(function (resp) {
              return resp.json();
            }).then(function (payload) {
              var orders = payload.data.map(function (orderJson) {
                var order = {
                  orderStatus: orderStatusFrom(orderJson),
                  id: orderJson.orderId,
                  deliveryAt: (0, _dateUtils.dateFrom)(orderJson.deliveryTime.deliveryStart)
                };
                return order;
              }).sort(function (a, b) {
                return a.deliveryAt.getTime() - b.deliveryAt.getTime();
              });
              var nextOrders = orders.filter(function (order) {
                return order.orderStatus === 'ORDER_RECEIVED';
              });
              var processed = orders.filter(function (order) {
                return order.orderStatus === 'ORDER_PROCESSED';
              });
              return {
                processed: processed,
                next: nextOrders.length !== 0 ? nextOrders[0] : null
              };
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
}

function fetchOrder(orderId) {
  return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var url;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            url = "https://www.k-ruoka.fi/kr-api/shoppinghistory/".concat(orderId, "?updatePricing=0");
            return _context2.abrupt("return", fetch(url).then(function (data) {
              return data.json();
            }).then(function (json) {
              return {
                info: {
                  id: json.orderId,
                  orderStatus: orderStatusFrom(json.orderStatus),
                  deliveryAt: (0, _dateUtils.dateFrom)(json.deliveryTime.deliveryEnd)
                },
                items: json.items.map(function (jsonItem) {
                  var item = {
                    name: jsonItem.name
                  };
                  return item;
                })
              };
            }));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
}

function fetchOrders(orderInfos) {
  return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var _this = this;

    var orders;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            orders = orderInfos.map(function (info) {
              return __awaiter(_this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return fetchOrder(info.id);

                      case 2:
                        return _context3.abrupt("return", _context3.sent);

                      case 3:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));
            });
            _context4.next = 3;
            return Promise.all(orders);

          case 3:
            return _context4.abrupt("return", _context4.sent);

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
}

function isKnownOrderStatus(maybe) {
  return typeof maybe === 'string' && knownStatusTypes.includes(maybe);
}

function orderStatusFrom(orderJson) {
  if (isKnownOrderStatus(orderJson.orderStatus)) {
    return orderJson.orderStatus;
  } else {
    return 'UNKNOWN';
  }
}

},{"../dateUtils":2}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runBookmarklet = runBookmarklet;

var _dateUtils = require("./dateUtils");

var _api = require("./kruoka/api");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

function windowed(size, from) {
  return from.flatMap(function (_, i) {
    return i <= from.length - size ? [from.slice(i, i + size)] : [];
  });
}
/**
 *
 * @param from Array of numbers
 */


function weightedAverage(from) {
  var result = from.reduce(function (acc, curr, index) {
    acc.sum += curr * (index + 1);
    acc.count += index + 1;
    return acc;
  }, {
    sum: 0,
    count: 0
  });
  return result.sum / result.count;
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
  var productOrderHistory = new Map();
  orderHistory.forEach(function (order) {
    order.items.forEach(function (item) {
      if (!productOrderHistory.get(item.name)) {
        productOrderHistory.set(item.name, []);
      }

      productOrderHistory.get(item.name).push(order.info.deliveryAt);
    });
  });
  var daysSorted = mapMap(productOrderHistory, function (key, value) {
    return value.sort(function (a, b) {
      return a.getTime() - b.getTime();
    });
  }); // Only include products ordered more than once

  return new Map(_toConsumableArray(daysSorted).filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];

    return v.length > 1;
  }));
}
/**
 * Calculates the weighted order frequency for items. e.g.
 * { 'Pirkka appelsiini' => 55 }, ordered on average on 55 day cycle
 *
 * @param itemHistory {Map<string, [Date]>}
 * @returns {Map<string, number>} Frequency for item in days
 */


function calculateItemFrequencies(itemHistory) {
  var frequences = mapMap(itemHistory, function (name, dates) {
    var itemDays = dates.sort(function (a, b) {
      return a.getTime() - b.getTime();
    });
    var orderFrequences = windowed(2, itemDays).map(function (pair) {
      return pair[1] - pair[0];
    });
    return (0, _dateUtils.millisToDays)(weightedAverage(orderFrequences));
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
  return arrayOfMs.map(function (it) {
    return new Date(it);
  });
}
/**
 *
 * @param deliveryDate {Date} Delivery date for the current order
 * @param itemLastOrderDate {Date} Date when the item was last ordered
 * @param itemFrequency {number} In days what is the item order frequency
 * @param previousOrderDates {Date[]} Dates of previous orders
 */


function shouldPropose(deliveryDate, itemLastOrderDate, itemFrequency, previousOrderDates) {
  // How much earlier than frequency we propose the item
  var F_LEEWAY = 0.8; // We should not propose if time since last item order is less than frequency

  if (dateAsMillis(deliveryDate) - dateAsMillis(itemLastOrderDate) < F_LEEWAY * daysAsMillis(itemFrequency)) {
    return false;
  }

  var span = daysAsMillis(itemFrequency);
  var timeRange = {
    start: dateAsMillis(itemLastOrderDate),
    end: dateAsMillis(itemLastOrderDate) + span
  }; // TODO: We can calculate this instead of iterate
  // Find the time range during which we should propose

  while (dateAsMillis(deliveryDate) > timeRange.end) {
    span = span * 1.5;
    timeRange.start = timeRange.end;
    timeRange.end = timeRange.end + span;
  } // Orders done during the time range


  var overlappingOrders = previousOrderDates.map(function (it) {
    return dateAsMillis(it);
  }).filter(function (it) {
    return it > timeRange.start && it <= timeRange.end;
  }); // But let's not consider orders that are too close to when we last ordered the item

  var foo = overlappingOrders.filter(function (it) {
    return it - dateAsMillis(itemLastOrderDate) > span;
  }); // If no orders yet done during the time span, we should propose item for this order
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


function proposedItems(deliveryDate, itemsOrderHistory, itemFrequencies, previousOrderDates) {
  var results = mapMap(itemsOrderHistory, function (name, dates) {
    return shouldPropose(deliveryDate, dates[dates.length - 1], itemFrequencies.get(name), previousOrderDates);
  });
  return mapToEntries(results).filter(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        itemName = _ref4[0],
        shouldPropose = _ref4[1];

    return shouldPropose === true;
  }).map(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        key = _ref6[0],
        value = _ref6[1];

    return key;
  });
} // const itemHistory = buildItemHistory(orderHistoryX);
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


function mapMap(map, fn) {
  return new Map(Array.from(map, function (_ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        key = _ref8[0],
        value = _ref8[1];

    return [key, fn(key, value)];
  }));
}

function mapToEntries(map) {
  return Array.from(map.entries());
}

function entriesToMap(entries) {
  return entries.reduce(function (acc, next) {
    return acc.set(next[0], next[1]);
  }, new Map());
}

function collectOrderDates(orderHistory) {
  return orderHistory.map(function (it) {
    return it.info.deliveryAt;
  });
}

function buildProposals() {
  return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var listing, orders, itemHistories, itemFrequencies, orderDates, currentOrderDelivery;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _api.fetchOrderListing)();

          case 2:
            listing = _context.sent;
            _context.next = 5;
            return (0, _api.fetchOrders)(listing.processed);

          case 5:
            orders = _context.sent;
            itemHistories = buildItemHistory(orders);
            itemFrequencies = calculateItemFrequencies(itemHistories);
            orderDates = collectOrderDates(orders);
            currentOrderDelivery = listing.next ? listing.next.deliveryAt : new Date();
            return _context.abrupt("return", proposedItems(currentOrderDelivery, itemHistories, itemFrequencies, orderDates));

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
} // Called from the bookmarklet bookmark, the entry point


function runBookmarklet() {
  buildProposals().then(function (proposals) {
    // Start the UI update loop
    setInterval(function () {
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
  var previousHtml = document.getElementById("smartCart");

  if (previousHtml) {
    previousHtml.remove();
  }

  var currentShoppingItems = Array.from(document.querySelectorAll(".shopping-list-item .product-result-name-content .product-name SPAN")).map(function (it) {
    return it.innerHTML;
  });
  var itemsToPropose = itemsForNextOrder.filter(function (it) {
    return currentShoppingItems.indexOf(it) === -1;
  });
  var newProposalsHtml = proposalsHTML(proposalItemsHtml(itemsToPropose));
  shoppingListDepartmentsContainer().prepend(htmlToElement(newProposalsHtml)); //
  // Private functions
  //

  function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result

    template.innerHTML = html;
    return template.content.firstChild;
  }

  function shoppingListDepartmentsContainer() {
    return document.querySelector('#shopping-basket-element > section > div > div.shopping-list-shopping-content > ul');
  }
  /**
   *
   * @param items {string[]}
   */


  function proposalItemsHtml(items) {
    return items.map(function (item) {
      return "<li>".concat(item, "</li>");
    }).join('');
  }

  function proposalsHTML(itemsHtml) {
    return "\n<li id=\"smartCart\" class=\"shopping-list-department\">\n  <h3 class=\"department-heading\">\n    <span>Muista my\xF6s n\xE4m\xE4</span>\n  </h3>\n  <ul class=\"shopping-list-items department-item-listing\">\n    <li><ul style=\"padding-left: 1em; list-style-type:circle; list-style-position: inside;\">".concat(itemsHtml, "</ul></li>\n  </ul>\n</li>\n");
  }
}

},{"./dateUtils":2,"./kruoka/api":3}]},{},[1]);
