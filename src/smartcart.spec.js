const {shouldPropose} = require('./smartcart')

console.log('test');

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

function assertTrue(value) {
  if (!value) {
    throw Error('Not true');
  }
}
