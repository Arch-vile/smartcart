import {shouldPropose} from "./core/ports/in/suggestionService";

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
    () => shouldPropose(
        thursday31,
        thursday24,
        7,
        [thursday24, thursday17]
    ), 'weekly milk');

// The Milk: morning order
// Delivery date: 31 Thursday morning already
// Item last ordered: 24 Thursday
// Item frequency: 7 days
// Previous orders: [24 Thursday, 17 Thursday]
// The morning order is less then frequency from last order, but milk should
// be proposed still.
assertTrue(
    () => shouldPropose(
        new Date(Date.parse('31 Mar 2022 08:00:00 GMT')),
        thursday24,
        7,
        [thursday24, thursday17]
    ),'morning milk');

// The Milk: evening order
// Delivery date: 31 Thursday late evening
// Item last ordered: 24 Thursday
// Item frequency: 7 days
// Previous orders: [24 Thursday, 17 Thursday]
assertTrue(
    () => shouldPropose(
        // Goes to the next time span and triggers there
        new Date(Date.parse('31 Mar 2022 22:00:00 GMT')),
        thursday24,
        7,
        [thursday24, thursday17]
    ), 'evening order');

// The Milk: frequent shopper
// Delivery date: 31.3.
// Item last ordered: 24.3.
// Item frequency: 7 days
// Previous orders: [24.3., 17.3., 26.3.]
// As it was last ordered on 24.3. and was not on the 26.3. order
// we should now include it on 31.3. order
assertTrue(
    () => shouldPropose(
        date(2022,3,31),
        date(2022,3,24),
        7,
        [thursday24,
          thursday17,
          // There is already order without milk during time span
          date(2022,3,26)
        ]
    ), 'Frequent shopper');

// The Banoffee: Not yet again
// Delivery date: 31 Thursday
// Item last ordered: Almost year ago
// Item frequency: 7 days
// Previous orders: [24 Thursday, 17 Thursday]
// Determined span is 4.3-30.8 so there already are orders during that time
// on which we would have proposed, so not proposing yet
assertFalse(
    () => shouldPropose(
        date(2022, 3, 31),
        date(2021, 3, 24),
        7,
        [date(2022, 3, 24), date(2022, 3, 17)]
    ),'should not propose multiple times' );

// The Banoffee: strikes back
// Delivery date: 31 Thursday
// Item last ordered: A long time ago
// Item frequency: 7 days
// Previous orders: [24 Thursday, 17 Thursday]
// Determined span is 4.3-30.8 on which there are orders, but for 31.8. order
// we should propose it.
assertTrue(
    () => shouldPropose(
        date(2022, 8, 31),
        date(2021, 3, 24),
        7,
        [date(2022, 3, 24), date(2022, 3, 17)]
    ), 'rare item proposed');

// Case: Shampoo
// Delivery date: 4.4.2022
// Item last ordered: 30.3.2022
// Item frequency: 126 days
// Previous orders: [30.3.2022]
// Regression: This was falsely proposed because we did not consider that proposal should not be closer than frequency to the last item order
assertFalse(
    () => shouldPropose(
        date(2022, 4, 4),
        date(2022, 3, 30),
        126,
        [date(2022, 3, 30)]
    ),'shampoo');

function date(year: number, month: number, day: number): Date {
  const dayPad = day < 10 ? '0' : '';
  const monthPad = month < 10 ? '0' : '';
  return new Date(`${year}-${monthPad}${month}-${dayPad}${day}T14:00:00.000+00:00`);
}

function assertTrue(provider: () => boolean, testName: string) {
  console.log(`Running ${testName}`);
  if (!provider()) {
    throw Error(`${testName}: Not true`);
  }
  console.log(`Done ${testName}`);
}

function assertFalse(provider: () => boolean, testName: string) {
  console.log(`Running ${testName}`);
  if (provider()) {
    throw Error(`${testName}: Not false`);
  }
  console.log(`Done ${testName}`);
}
