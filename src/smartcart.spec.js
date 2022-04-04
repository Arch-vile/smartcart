const {shouldPropose} = require('./smartcart')

console.log('testing');

const thursday31 = new Date(Date.parse('31 Mar 2022 14:00:00 GMT'));
const thursday24 = new Date(Date.parse('24 Mar 2022 14:00:00 GMT'));
const thursday17 = new Date(Date.parse('17 Mar 2022 14:00:00 GMT'));

// The Milk
// Delivery date: 31 Thursday
// Item last ordered: 24 Thursday
// Item frequency: 7 days
// Previous orders: [24 Thursday, 17 Thursday]
assertTrue(
    shouldPropose(
        thursday31,
        thursday24,
        7,
        [thursday24, thursday17]
    ));

// The Milk: morning order
// Delivery date: 31 Thursday morning already
// Item last ordered: 24 Thursday
// Item frequency: 7 days
// Previous orders: [24 Thursday, 17 Thursday]
assertTrue(
    shouldPropose(
        new Date(Date.parse('31 Mar 2022 08:00:00 GMT')),
        thursday24,
        7,
        [thursday24, thursday17]
    ));

// The Milk: evening order
// Delivery date: 31 Thursday late evening
// Item last ordered: 24 Thursday
// Item frequency: 7 days
// Previous orders: [24 Thursday, 17 Thursday]
assertTrue(
    shouldPropose(
        // Goes to the next time span and triggers there
        new Date(Date.parse('31 Mar 2022 22:00:00 GMT')),
        thursday24,
        7,
        [thursday24, thursday17]
    ));

// The Milk: frequent shopper
// Delivery date: 31 Thursday late evening
// Item last ordered: 24 Thursday
// Item frequency: 7 days
// Previous orders: [24 Thursday, 17 Thursday, 26 Saturday]
assertFalse(
    shouldPropose(
        new Date(Date.parse('31 Mar 2022 14:00:00 GMT')),
        thursday24,
        7,
        [thursday24,
          thursday17,
          // There is already order without milk during time span
          new Date(Date.parse('26 Mar 2022 24:00:00 GMT')),
        ]
    ));

// The Banoffee: Not yet again
// Delivery date: 31 Thursday
// Item last ordered: A long time ago
// Item frequency: 7 days
// Previous orders: [24 Thursday, 17 Thursday]
// Determined span is 4.3-30.8 so there already are orders during that time
// on which we would have proposed, so not proposing yet
assertFalse(
    shouldPropose(
        date(2022, 3, 31),
        date(2021, 3, 24),
        7,
        [date(2022, 3, 24), date(2022, 3, 17)]
    ));

// The Banoffee: strikes back
// Delivery date: 31 Thursday
// Item last ordered: A long time ago
// Item frequency: 7 days
// Previous orders: [24 Thursday, 17 Thursday]
// Determined span is 4.3-30.8 on which there are orders, but for 31.8. order
// we should propose it.
assertTrue(
    shouldPropose(
        date(2022, 8, 31),
        date(2021, 3, 24),
        7,
        [date(2022, 3, 24), date(2022, 3, 17)]
    ));

function date(year, month, day) {
  const dayPad = day < 10 ? '0' : '';
  const monthPad = month < 10 ? '0' : '';
  return new Date(`${year}-${monthPad}${month}-${dayPad}${day}T14:00:00.000+00:00`);
}

function assertTrue(value) {
  if (!value) {
    throw Error('Not true');
  }
}

function assertFalse(value) {
  if (value) {
    throw Error('Not false');
  }
}
