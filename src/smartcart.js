function test() {
    console.log('it works');
}

// var currentShoppingItems = Array.from(document.querySelectorAll(".shopping-list-item .product-result-name-content .product-name SPAN"));
//
// https://www.k-ruoka.fi/kr-api/shoppinghistory?offset=0&includeItems=true
//
// {"limit":20,"offset":0,"data":[{"orderId":"6937010","s
//
// orderStatus: "ORDER_PROCESSED" << old order
//

// Returns order IDs (last 20 order I think is returned)
async function fetchOrders() {
    var url = 'https://www.k-ruoka.fi/kr-api/shoppinghistory?offset=0&includeItems=true';
    return fetch(url)
        .then(resp => resp.json())
        .then(payload => {
            return payload.data
                .filter(order => order.orderStatus === 'ORDER_PROCESSED')
                .map(order => order.orderId);
        });
}

async function fetchOrder(orderId) {
    var url = `https://www.k-ruoka.fi/kr-api/shoppinghistory/${orderId}?updatePricing=0`;
    return fetch(url)
        .then(data => data.json())
        .then(data => {
            const delivered = data.deliveryTime.deliveryEnd;
            const itemNames = data.items.map(item => item.name);
            return {
                deliveredAt: delivered,
                items: itemNames
            }
        });
}

// [ {deliveredAt: "2022-03-30T11:00:00+00:00", items: [ "roiskelappa" ]}, ... ]
async function buildHistory() {
	const orderIds = await fetchOrders();
	const orders = orderIds.map(async id => {
		return await fetchOrder(id);
	});
	return await Promise.all(orders);
}

buildHistory().then(console.log);

