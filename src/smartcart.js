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


fetchOrder(6900204).then(console.log);



