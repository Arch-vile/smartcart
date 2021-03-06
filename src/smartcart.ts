function windowed(size, from) {
  return from.flatMap((_, i) =>
      i <= from.length - size
          ? [from.slice(i, i + size)]
          : []);
}

function millisToDays(millis) {
  return Math.floor(millis / 1000 / 86400);
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
    const nextOrders = payload.data
    .filter(order => order.orderStatus === 'ORDER_RECEIVED')
    .sort((a, b) =>
        Date.parse(b.deliveryTime.deliveryStart) -
        Date.parse(a.deliveryTime.deliveryStart))
    .map(order => order.orderId);

    return {
      processed: payload.data
      .filter(order => order.orderStatus === 'ORDER_PROCESSED')
      .map(order => order.orderId),
      next: nextOrders.length !== 0 ? nextOrders[0] : null
    };
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
      deliveryAt: delivered,
      items: itemNames
    }
  });
}

// [ {deliveryAt: "2022-03-30T11:00:00+00:00", items: [ "roiskelappa" ]}, ... ]
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

const orderHistoryX =
    [
      {
        "deliveryAt": "2022-03-30T11:00:00+00:00",
        "items": [
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "Sevan hummus 275g original",
          "Bonduelle Eritt??in hienoja herneit?? 400g/280g",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Pirkka sitruunanmakuinen kivenn??isvesi 1,5l",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Kurkku Suomi",
          "Pirkka Vichy 1,5l",
          "Flora margariini 600g 60% normaalisuolainen",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "P??gen H??n?? saaristolaisrieska 630g",
          "Oatly kaurajuoma 1l UHT",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "K-Menu cashewp??hkin?? 500g",
          "Pirkka peanut butter crunchy 350g",
          "Pirkka luomu Reilun kaupan banaani",
          "Valio vapaan lehm??n kevytmaito 1l",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Arla Keso raejuusto 200g vanilja",
          "M?? kaurajogu 400g mets??mansikka",
          "Pirkka suomalainen kuohukerma 2dl",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Paul??ns 450g hasselp??hkin?? ja taateli granola muromysli",
          "Apetit laktoositon lohikeitto 400g pakaste",
          "Barilla Genovese pestokastike 190g",
          "Tyrkisk Peber Liquorice 120g",
          "Ullan Pakari Ullan ruis 300g",
          "Pirkka kermajuusto 1 kg laktoositon",
          "Apetina juustokuutiot 200g",
          "Valio Eila kevytmaitojuoma 2,5dl laktoositon UHT",
          "Sofine 250g Maustamaton Luomutofu",
          "Snickers Creamy Peanut Butter suklaapatukka 36,5g",
          "Pirkka Royal Gala omena 1kg 1lk, ulkomainen",
          "Elmex Junior hammastahna 75ml 6-12 vuotiaille",
          "Sensodyne Original hammastahna 75ml",
          "J????salaatti 100g pussi Suomi 1lk",
          "K-Menu merisuola 1kg",
          "Maple Joe vaahterasiirappi 250g",
          "Kikkoman sushi riisiviinietikka 300ml",
          "Pirkka basmatiriisi 1kg",
          "Maizena maissit??rkkelys jauho 400 g",
          "Pirkka leivinpaperi 38cmx15m valkaisematon",
          "Ben&Jerry's j????tel?? 465ml/405g Netflix&Chilll'd",
          "Ben&Jerry's pint 465ml Caramel Brownie Party",
          "Ben&Jerry's j????tel?? 465ml/406g half baked pa",
          "Ben&Jerry's j????tel?? 465ml/404g Cookie Dough",
          "Pirkka suolap??hkin??t 350g",
          "Pirkka bioj??tepussi paperinen 20 kpl",
          "head&shoulders shampoo 225ml Dry Scalp Care",
          "Rexona 50 ml Cotton roll on",
          "Felix tomaattipyree 300g",
          "Pirkka paprikajauhe 25g",
          "Pirkka savupaprika 25g jauhettu",
          "Boson SARS-COV-2-Antigeenipikatesti 1kpl",
          "Pirkka Parhaat riisinuudeli 180g"
        ]
      },
      {
        "deliveryAt": "2022-03-23T15:00:00+00:00",
        "items": [
          "Sevan hummus 275g original",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Kurkku Suomi",
          "K-Menu cashewp??hkin?? 500g",
          "Pirkka sitruunanmakuinen kivenn??isvesi 1,5l",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Arla Keso raejuusto 200g vanilja",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Flora margariini 600g 60% normaalisuolainen",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka peanut butter crunchy 350g",
          "Bonduelle Eritt??in hienoja herneit?? 400g/280g",
          "Oatly kaurajuoma 1l UHT",
          "Pirkka Vichy 1,5l",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Pirkka luomu Reilun kaupan banaani",
          "Valio vapaan lehm??n kevytmaito 1l",
          "Ullan Pakari Ullan ruis 300g",
          "P??gen H??n?? saaristolaisrieska 630g",
          "Tyrkisk Peber Liquorice 120g",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Paul??ns 450g hasselp??hkin?? ja taateli granola muromysli",
          "M?? kaurajogu 400g mets??mansikka",
          "Wasa n??kkileip?? 290g sesam&havssalt",
          "Pirkka lakkahillo 400 g",
          "Inkiv????ri",
          "Apetina juustokuutiot 200g",
          "Pirkka suomalainen kaurahiutale 1kg",
          "Pirkka kermajuusto 1 kg laktoositon",
          "Felix maustekurkkuviipale 560g/300g viipaloituja kurkkuja mausteliemess??",
          "Valio Eila kevytmaitojuoma 2,5dl laktoositon UHT",
          "Flowflex SARS-CoV-2 Antigeenipikatesti 1kpl",
          "Pirkka wc-paperi 6rl valkoinen",
          "J????salaatti 100g pussi Suomi 1lk",
          "Atria 300g Rotukarjan naudan jauheliha 12%",
          "Apetit laktoositon lohikeitto 400g pakaste",
          "K-Menu riisipiirakka 12kpl /1020g pakaste",
          "Pirkka esipaistettu valkosipulivoipatonki 175g pakaste",
          "Pirkka puolukkahillo 400g",
          "Atria Perhetilan Kanan fileesuikale Merisuola 800g",
          "Pirkka suomalainen Rosamunda pesty jauhoinen uuniperuna 1kg",
          "Pirkka porkkanaohukainen 400g",
          "Pirkka pinaattiohukainen 400 g",
          "Mama Kananmakuinen nuudeli 90g",
          "Pirkka suomalainen mustikka 200 g pakaste",
          "Pirkka maustetu ristikkoperunat 600 g pakaste",
          "Pirkka peruna-sipulisekoitus 500 g pakaste",
          "Sicilia sitruunat??ysmehu 200ml",
          "Sicilia limettimehu 200ml makeuttamaton",
          "Pirkka Luomu sitruuna",
          "Lime",
          "Valio Oddlygood Dream Fraiche 200g",
          "Pirkka kukkakaali pakattu ulkomainen",
          "Apetit sugar snaps pullea sokeriherne 300g pakaste",
          "Pirkka valkosipuli 100 g 2lk",
          "Pirkka Tiramisu italialainen j????tel?? 300g/0,5l",
          "Fazer j????tel?? Turkis Peber Hot&Sour 480ml"
        ]
      },
      {
        "deliveryAt": "2022-03-16T19:00:00+00:00",
        "items": [
          "Sevan hummus 275g original",
          "Bonduelle Eritt??in hienoja herneit?? 400g/280g",
          "Pirkka sitruunanmakuinen kivenn??isvesi 1,5l",
          "Pirkka peanut butter crunchy 350g",
          "Kurkku Suomi",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Planti Cooking kaura 2dl Original",
          "Paul??ns 450g hasselp??hkin?? ja taateli granola muromysli",
          "Flora margariini 600g 60% normaalisuolainen",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Oatly kaurajuoma 1l UHT",
          "K-Menu cashewp??hkin?? 500g",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka lakkahillo 400 g",
          "Pirkka Vichy 1,5l",
          "Ullan Pakari Ullan ruis 300g",
          "Valio vapaan lehm??n kevytmaito 1l",
          "Tyrkisk Peber Liquorice 120g",
          "P??gen H??n?? saaristolaisrieska 630g",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Apetit laktoositon lohikeitto 400g pakaste",
          "Wasa n??kkileip?? 290g sesam&havssalt",
          "Avokado 800g PE/CO/CL 1lk",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Pirkka kermajuusto 1 kg laktoositon",
          "M?? kaurajogu 400g mets??mansikka",
          "Pirkka vanupuikko 200kpl",
          "Oululainen hapankorppu 740g",
          "Tolu yleispuhdistusainespray K??ytt??valmis 500ml",
          "Pirkka nestesaippua 3L Cotton/Mandariini/Mustikka",
          "Go-Tan Sriracha Hot Chilli Sauce tulinen chilikastike 380 ml",
          "Classic papukahvi 500g Franskrost",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Pirkka Royal Gala omena 1kg 1lk, ulkomainen",
          "Pirkka valkosipuli 100 g 2lk",
          "J????salaatti 100g pussi Suomi 1lk",
          "Pirkka kes??kurpitsa ulkomainen",
          "Pirkka Luomu suomalainen yleisperuna 1kg",
          "Purjo ulkomainen",
          "Bimi?? makea varsiparsakaali 150g luomu Espanja 1lk",
          "Granaattiomena",
          "Pirkka Luomu porkkanasose 500 g",
          "Syd??nsalaatti 200g/2kpl luomu Espanja 1 lk",
          "Pirkka tonnikalapalat vedess?? 200g/150g",
          "Jalostaja perinteinen hernekeitto 520g",
          "Felix maustekurkkuviipale 560g/300g viipaloituja kurkkuja mausteliemess??",
          "Pirkka viipaloidut herkkusienet 320g/160g",
          "Pielisen Kalajaloste Villikala ??ljyss?? 150g/115g",
          "Pepsodent Super Fluor hammastahna 125ml",
          "Oboy Original 1 kg",
          "Pirkka mikropopcorn 3x100g",
          "Kivikyl??n kanafileepy??rykk?? 300g",
          "Kitchen Joy Green Cube savoury yakisoba - kasviksia ja nuudeleita 300g pakaste",
          "Kitchen Joy creamy tom yum - kanaa ja nuudeleita 320g pakaste",
          "GoGreen Punaiset Linssit 400 g",
          "Kenk??lusikka 42cm, v??rilajitelma"
        ]
      },
      {
        "deliveryAt": "2022-03-09T12:00:00+00:00",
        "items": [
          "Sevan hummus 275g original",
          "Bonduelle Eritt??in hienoja herneit?? 400g/280g",
          "Pirkka sitruunanmakuinen kivenn??isvesi 1,5l",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Kurkku Suomi",
          "Barilla Genovese pestokastike 190g",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Arla Keso raejuusto 200g vanilja",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Pirkka suomalainen kuohukerma 2dl",
          "Planti Cooking kaura 2dl Original",
          "Flora margariini 600g 60% normaalisuolainen",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Oatly kaurajuoma 1l UHT",
          "K-Menu cashewp??hkin?? 500g",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Pirkka lakkahillo 400 g",
          "Pirkka luomu Reilun kaupan banaani",
          "Pirkka Vichy 1,5l",
          "Ullan Pakari Ullan ruis 300g",
          "Valio vapaan lehm??n kevytmaito 1l",
          "Tyrkisk Peber Liquorice 120g",
          "P??gen H??n?? saaristolaisrieska 630g",
          "Heinz Ketchup 1kg",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Pirkka suomalainen kaurahiutale 1kg",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Pirkka kermajuusto 1 kg laktoositon",
          "Saarioinen Iso vaalea riisipiirakka 9 kpl 630 g",
          "Valio pehme?? maitorahka 250 g",
          "M?? kaurajogu 400g mets??mansikka",
          "Serla wc-paperi 8 rl keltainen",
          "Pirkka Parhaat siemenn??kkileip?? kaura-hampunsiemen 210g gluteeniton",
          "Ben & Jerry's j????tel?? Topped Salted Caramel Brownie 438ml/403g",
          "Ben & Jerry's Topped Chocolate Caramel & Cookie Dough 438ml/409g",
          "Apetit sugar snaps pullea sokeriherne 300g pakaste",
          "Pirkka espanjalainen parsakaali 400g 1lk",
          "Pirkka suomalainen viljelty herkkusieni 200g 1lk",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "J????salaatti 100g pussi Suomi 1lk",
          "Pirkka t??ysjyv??spagetti 500g",
          "Myllyn Paras Raketti Spagetti 350g",
          "Ehrmann Grand Dessert 190g vanilja",
          "Ehrmann Grand Dessert tuplatoffee 190g",
          "Ehrmann Grand Dessert 190g valkosuklaa-mansikka",
          "Saarioinen Maksalaatikko 400 g laktoositon/rusinaton",
          "Vataja lis??aineeton nakki 280g",
          "Gold&Green savu-BBQ-marinoitu Delikaura 120g",
          "Ehrmann Grand Dessert valkosuklaa 190g",
          "Saarioinen lasagne 600g",
          "Gatorade Cool Blue 0,5l",
          "Saarioinen Kanakeitto 300 g",
          "Pirkka curry 23g mausteseos",
          "Pirkka esipaistettu valkosipulivoipatonki 175g pakaste",
          "K-Menu riisipiirakka 12kpl /1020g pakaste",
          "Pirkka esipaistettu kiviuunisiemens??mpyl?? 4kpl/300g",
          "Apetina juustokuutiot 200g",
          "Pirkka suolap??hkin??t 350g",
          "Valio Eila kevytmaitojuoma 2,5dl laktoositon UHT",
          "Pirkka kuvioitu talouspaperi puoliarkki 4rl",
          "Dracula Piller Salmiakki 65 g"
        ]
      },
      {
        "deliveryAt": "2022-03-02T19:00:00+00:00",
        "items": [
          "Sevan hummus 275g original",
          "Pirkka sitruunanmakuinen kivenn??isvesi 1,5l",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Kurkku Suomi",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Bonduelle Eritt??in hienoja herneit?? 400g/280g",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Planti Cooking kaura 2dl Original",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Pirkka luomu Reilun kaupan banaani",
          "Arla Keso raejuusto 200g vanilja",
          "Valio vapaan lehm??n kevytmaito 1l",
          "Pirkka suomalainen kuohukerma 2dl",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka Vichy 1,5l",
          "Flora margariini 600g 60% normaalisuolainen",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Ullan Pakari Ullan ruis 300g",
          "K-Menu cashewp??hkin?? 500g",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Tyrkisk Peber Liquorice 120g",
          "Sofine 250g Maustamaton Luomutofu",
          "Inkiv????ri",
          "Pirkka proteiinijuoma 250ml vanilja laktoositon",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Valio pehme?? maitorahka 250 g",
          "P??gen Oivallus rukiinen vehn??palaleip?? 15kpl/530g",
          "Pirkka rapea kalaleike 400g MSC pakaste",
          "Pirkka Luomu kaurajuoma 1l UHT",
          "Spice Up Nuudeli 400g",
          "Naapurin maalaiskanapojan jauheliha 800 g",
          "Pirkka esipaistettu vehn??s??mpyl?? 6kpl/300g",
          "Jyv??shyv?? v??lipalakeksi 6x30g tumma suklaa",
          "Jyv??shyv?? v??lipalakeksi 6x30g mansikka",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "J????salaatti 100g pussi Suomi 1lk",
          "J??rvikyl?? korianteri rkk FI",
          "Jalotempe H??rk??papu 250g Luomu"
        ]
      },
      {
        "deliveryAt": "2022-02-24T15:00:00+00:00",
        "items": [
          "Sevan hummus 275g original",
          "Pirkka sitruunanmakuinen kivenn??isvesi 1,5l",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Barilla Genovese pestokastike 190g",
          "Kurkku Suomi",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Bonduelle Eritt??in hienoja herneit?? 400g/280g",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Planti Cooking kaura 2dl Original",
          "Pirkka peanut butter crunchy 350g",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Pirkka luomu Reilun kaupan banaani",
          "Arla Keso raejuusto 200g vanilja",
          "Pirkka suomalainen kuohukerma 2dl",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka Vichy 1,5l",
          "Oatly kaurajuoma 1l UHT",
          "Flora margariini 600g 60% normaalisuolainen",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "P??gen H??n?? saaristolaisrieska 630g",
          "Apetit laktoositon lohikeitto 400g pakaste",
          "Ullan Pakari Ullan ruis 300g",
          "K-Menu cashewp??hkin?? 500g",
          "Valio Hyv?? suomalainen Arki emmental e625g",
          "Paul??ns 450g hasselp??hkin?? ja taateli granola muromysli",
          "Heinz Ketchup 1kg",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Tyrkisk Peber Liquorice 120g",
          "Sofine 250g Maustamaton Luomutofu",
          "Inkiv????ri",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Pirkka suomalainen puolikarkea vehn??jauho 2kg",
          "Tuorehiiva 50 g leivinhiiva",
          "Valio kanelikreemi 200 g laktoositon",
          "Pirkka vadelmahillo 400g",
          "Prix lakulehm?? 275g",
          "Prix kermatoffee kermalehm?? 275g",
          "Pirkka suolap??hkin??t 350g",
          "Lotus Biscoff Spread karamellisoitu keksilevite 400g",
          "Ben&Jerry's j????tel?? 465ml/404g Cookie Dough",
          "Ben&Jerry's j????tel?? 465ml/425g peanut butter",
          "Pirkka valkosipuli 100 g 2lk",
          "Sallinen mantelimassa 150g",
          "Pirkka suomalainen kevytmaito 1l",
          "Felix maustekurkkuviipale 560g/300g viipaloituja kurkkuja mausteliemess??",
          "Pirkka kanelitanko??15g",
          "San Marcos chipotle pippureita Adobo kastikkeessa 230g",
          "Pirkka mustapavut suolaliemess?? 380g/230g",
          "Pirkka isot valkoiset pavut suolaliemess?? 380g/230g",
          "Pirkka Modenalainen balsamietikka 250ml",
          "Risella T??ysjyv??riisi 1kg",
          "Pirkka tomaattimurska 500 g",
          "Lime",
          "J??rvikyl?? korianteri rkk FI",
          "Apetit sugar snaps pullea sokeriherne 300g pakaste",
          "Pirkka emmental-mozzarella juustoraaste 150g v??h??laktoosinen",
          "Santa Maria 240g Tex Mex Tortilla Beetroot Medium  (6-pack)",
          "Santa Maria 240g Tex Mex Tortilla Carrot Medium",
          "Pirkka ananaspalat ananast??ysmehussa 227g/140g",
          "Pirkka oregano 6g",
          "Sipuli 1kg Suomi 2lk",
          "Findus ruusukaali 550g",
          "Oatly ruokaan fraiche 2dl",
          "Valio Oddlygood Barista kaurajuoma 0,75l korvapuusti gluteeniton",
          "M?? kaurajogu 400g mets??mansikka",
          "Avokado 800g PE/CO/CL 1lk"
        ]
      },
      {
        "deliveryAt": "2022-02-19T16:00:00+00:00",
        "items": [
          "Sensodyne Original hammastahna 75ml",
          "Elmex Junior hammastahna 75ml 6-12 vuotiaille",
          "Saarioinen Lihamakaronilaatikko 400 g",
          "Pirkka vehn??tortilla 8 kpl/320g",
          "Apetina juustokuutiot 200g",
          "Kurkku Suomi",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "GoGreen Bean Salsa Original 380g",
          "Atria Vuolu kanafilee mustapippuri 200g",
          "Atria Vuolu kanafilee pehme?? savu 200g",
          "Valio Hyv?? suomalainen Arkirae 500g",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "SM Tex MexTaco Sauce Mild 230g",
          "Valio emmental raaste 150g punaleima",
          "Fazer Alku ruis & taateli kaurapuuro 500g",
          "Pirkka peanut butter crunchy 350g",
          "Arla Keso raejuusto 200g vanilja",
          "Ullan Pakari palaRuis 3/300g",
          "Ullan Pakari porkkanas??mpyl?? 300g",
          "Vaasan Ruispalat 660 g 12 kpl t??ysjyv??ruisleip??",
          "HK Herkkumaksamakkara 300g",
          "Flora margariini 400g  60% normaalisuola",
          "Pirkka kermajuusto 1 kg laktoositon",
          "LU Belvita v??lipalakeksi 253g marja-jogurtti",
          "Pirkka proteiinijuoma 250ml vanilja laktoositon",
          "Saarioinen Iso vaalea riisipiirakka 9 kpl 630 g",
          "Karhu Laku Portteri 5,5% 0,5l",
          "Olvi I.P.A. 4,7% 0,5l",
          "Snellman pepperoni 130g",
          "Tomaatti Suomi",
          "Pr??sident Sainte Maure vuohenjuusto 200g",
          "Valkosipuli ulkomainen kg",
          "Ullan Pakari 100% kaura 300g",
          "Pirkka mansikka-banaanismoothie 1l",
          "Pirkka sitruunanmakuinen kivenn??isvesi 1,5l",
          "K-Menu Jaffa 0,33l 6-pack"
        ]
      },
      {
        "deliveryAt": "2022-02-15T15:00:00+00:00",
        "items": [
          "Sevan hummus 275g original",
          "Pirkka sitruunanmakuinen kivenn??isvesi 1,5l",
          "Barilla Genovese pestokastike 190g",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Bonduelle Eritt??in hienoja herneit?? 400g/280g",
          "Kurkku Suomi",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Planti Cooking kaura 2dl Original",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Pirkka luomu Reilun kaupan banaani",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka Vichy 1,5l",
          "Pirkka suomalainen kaurahiutale 1kg",
          "Flora margariini 600g 60% normaalisuolainen",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Valio vapaan lehm??n kevytmaito 1l",
          "Oatly kaurajuoma 1l UHT",
          "Pirkka peanut butter crunchy 350g",
          "P??gen H??n?? saaristolaisrieska 630g",
          "Paul??ns 450g hasselp??hkin?? ja taateli granola muromysli",
          "Arla Keso raejuusto 200g vanilja",
          "Pirkka kinuskikastike 2dl laktoositon",
          "Classic papukahvi 500g Franskrost",
          "K-Menu cashewp??hkin?? 500g",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Ullan Pakari Ullan ruis 300g",
          "Pirkka italialainen veriappelsiini 750g",
          "Wasa n??kkileip?? 290g sesam&havssalt",
          "Pirkka suomalainen kuohukerma 2dl",
          "Apetit laktoositon lohikeitto 400g pakaste",
          "M?? kaurajogu 400g mets??mansikka",
          "Tyrkisk Peber Liquorice 120g",
          "Pirkka lakkahillo 400 g",
          "Felix maustekurkkuviipale 560g/300g viipaloituja kurkkuja mausteliemess??",
          "Rexona 50 ml Sport Defence Gold roll on Ltd edition",
          "Dove Men+Care 50 ml Clean Comfort roll on",
          "Pirkka kermajuusto 1 kg laktoositon",
          "Pirkka astianpesuainetiiviste 500ml hajusteeton",
          "Best berry suomalainen mansikka 1 kg pakaste",
          "Pirkka Royal Gala omena 1kg 1lk, ulkomainen",
          "Pirkka suolap??hkin??t 350g",
          "Pirkka valkosuklaa cashew 150g UTZ",
          "Pirkka valkosuklaa banaanilastu 100g UTZ",
          "Pirkka kiivi 500g 1lk",
          "Pirkka espanjalainen parsakaali 400g 1lk",
          "Myskikurpitsa",
          "Valio Play Viilis 200g hedelm??pommi laktoositon",
          "Valio Play Viilis 200g mansikka laktoositon",
          "GoGreen Punaiset Linssit 400 g",
          "Pirkka esipaistettu valkosipulivoipatonki 175g pakaste",
          "Pirkka esipaistettu yrttivoipatonki 175g pakaste",
          "Kitchen Joy 320g green curry chicken pakaste",
          "Kitchen Joy Green Cube savoury yakisoba - kasviksia ja nuudeleita 300g pakaste",
          "Pirkka suomalainen naudan jauheliha 17% 400g",
          "Oululainen hapankorppu 740g",
          "Pirkka rakkolaastari 7 kpl",
          "Compeed rakkolaastari 5kpl medium",
          "Apetina juustokuutiot 200g",
          "Pirkka kuviopasta penne rigate 500 g",
          "Pirkka fusilli t??ysjyv?? kuviopasta 500g",
          "Go-Tan Sriracha Hot Chilli Sauce tulinen chilikastike 380 ml",
          "Avokado 800g PE/CO/CL 1lk"
        ]
      },
      {
        "deliveryAt": "2022-02-09T12:00:00+00:00",
        "items": [
          "Barilla Genovese pestokastike 190g",
          "Sevan hummus 275g original",
          "Pirkka sitruunanmakuinen kivenn??isvesi 1,5l",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Kurkku Suomi",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "Ullan Pakari Ullan ruis 300g",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Arla Keso raejuusto 200g vanilja",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Wasa n??kkileip?? 290g sesam&havssalt",
          "Pirkka peanut butter crunchy 350g",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka luomu Reilun kaupan banaani",
          "Pirkka lakkahillo 400 g",
          "Bonduelle Eritt??in hienoja herneit?? 400g/280g",
          "Pirkka Vichy 1,5l",
          "Oatly kaurajuoma 1l UHT",
          "Valio vapaan lehm??n kevytmaito 1l",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Flora margariini 600g 60% normaalisuolainen",
          "K-Menu cashewp??hkin?? 500g",
          "Planti Cooking kaura 2dl Original",
          "Pirkka kikherneet suolaliemess?? 380g/230g",
          "P??gen H??n?? saaristolaisrieska 630g",
          "Paul??ns 450g hasselp??hkin?? ja taateli granola muromysli",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Pirkka italialainen veriappelsiini 750g",
          "Apetit laktoositon lohikeitto 400g pakaste",
          "Heinz Ketchup 1kg",
          "Juustoportti Hyvin sokeroimaton marjainen keitto 1kg",
          "P??gen Oivallus rukiinen vehn??palaleip?? 15kpl/530g",
          "Valio pehme?? maitorahka 250 g",
          "Inkiv????ri",
          "LV Color pyykinpesuneste t??ytt??pss 1,5L",
          "Sipuli 1kg Suomi 2lk",
          "Pirkka Tiramisu italialainen j????tel?? 300g/0,5l",
          "Yutaka Japanilainen riisiviinietikka 150ml",
          "Malaco TV Mix Salmiakki 280g",
          "Maple Joe vaahterasiirappi 250g",
          "Findus Fish & Crisp paneroidut kalafileet MSC 240g",
          "Sofine 250g Maustamaton Luomutofu",
          "Spice Up Nuudeli 400g",
          "Pirkka Parhaat riisinuudeli 180g",
          "Yum Yum Kananmakuinen nuudeli 60g",
          "Urtekram punainen riisi 500g luomu",
          "Pirkka basmatiriisi 1kg",
          "K-Menu riisipiirakka 12kpl /1020g pakaste",
          "Saarioinen Iso vaalea riisipiirakka 9 kpl 630 g",
          "Mausteinen kaalisalaatti Kimchi 460g",
          "Bong Touch Of Taste Kasvisfondi 180 ml",
          "J??rvikyl?? korianteri rkk FI",
          "Findus korianteri 40g pa",
          "Oatly havregurt 0,5l turkkilainen",
          "Avokado 800g PE/CO/CL 1lk",
          "Granaattiomena",
          "Punakaali Suomi",
          "Pirkka Luomu suomalainen yleisperuna 1kg"
        ]
      },
      {
        "deliveryAt": "2022-02-02T12:00:00+00:00",
        "items": [
          "Kurkku Suomi",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Pirkka sitruunanmakuinen kivenn??isvesi 1,5l",
          "Barilla Genovese pestokastike 190g",
          "Sevan hummus 275g original",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Arla Keso raejuusto 200g vanilja",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Flora margariini 600g 60% normaalisuolainen",
          "Pirkka luomu Reilun kaupan banaani",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Valio vapaan lehm??n kevytmaito 1l",
          "Bonduelle Eritt??in hienoja herneit?? 400g/280g",
          "Pirkka Vichy 1,5l",
          "Planti Cooking kaura 2dl Original",
          "Oatly kaurajuoma 1l UHT",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Paul??ns 450g hasselp??hkin?? ja taateli granola muromysli",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Valio Hyv?? suomalainen Arki emmental e625g",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "P??gen H??n?? saaristolaisrieska 630g",
          "Ullan Pakari Ullan ruis 300g",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Heinz Ketchup 1kg",
          "K-Menu cashewp??hkin?? 500g",
          "Pirkka peanut butter crunchy 350g",
          "Wasa n??kkileip?? 290g sesam&havssalt",
          "Pirkka suomalainen kuohukerma 2dl",
          "Apetit laktoositon lohikeitto 400g pakaste",
          "Wettex Classic 3kpl sieniliina",
          "Pirkka falafelpy??ryk??t n.15kpl/300g pakaste",
          "Urtekram seesami??ljy 500ml luomu",
          "Sitruunaruoho 50g 1lk",
          "Spice Up! Sitruunaruohotahna 110g",
          "Sofine 250g Maustamaton Luomutofu",
          "Pirkka suomalainen kev??tsipuli 100g",
          "Lime 3kpl/220g Brasilia/MX 1lk",
          "Korianteri 20g",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Pirkka italialainen veriappelsiini 750g",
          "M?? kaurajogu 400g mets??mansikka",
          "Prix lakulehm?? 275g",
          "LU Belvita v??lipalakeksi 253g marja-jogurtti",
          "Jyv??shyv?? v??lipalakeksi 6x30g mansikka",
          "Jyv??shyv?? v??lipalakeksi 6x30g tumma suklaa",
          "Pirkka Vikkel??t kanan fileesuikale maustamaton 450g",
          "Atria Vuolu kanafilee pehme?? savu 200g"
        ]
      },
      {
        "deliveryAt": "2022-01-26T12:00:00+00:00",
        "items": [
          "Kurkku Suomi",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Sevan hummus 275g original",
          "Pirkka sitruunanmakuinen kivenn??isvesi 1,5l",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Flora margariini 600g 60% normaalisuolainen",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Bonduelle Eritt??in hienoja herneit?? 400g/280g",
          "Arla Keso raejuusto 200g vanilja",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Valio Hyv?? suomalainen Arki emmental e625g",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Planti Cooking kaura 2dl Original",
          "Pirkka Vichy 1,5l",
          "Pirkka luomu Reilun kaupan banaani",
          "Juustoportti Hyvin sokeroimaton marjainen keitto 1kg",
          "Valio vapaan lehm??n kevytmaito 1l",
          "Pirkka kikherneet suolaliemess?? 380g/230g",
          "Paul??ns 450g hasselp??hkin?? ja taateli granola muromysli",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Pirkka peanut butter crunchy 350g",
          "Wasa n??kkileip?? 290g sesam&havssalt",
          "Classic papukahvi 500g Franskrost",
          "P??gen H??n?? saaristolaisrieska 630g",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Pirkka suomalainen kaurahiutale 1kg",
          "Ullan Pakari Ullan ruis 300g",
          "Oatly kaurajuoma 1l UHT",
          "Pirkka lakkahillo 400 g",
          "Apetit laktoositon lohikeitto 400g pakaste",
          "Barilla Genovese pestokastike 190g",
          "Pirkka Royal Gala omena 1kg 1lk, ulkomainen",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "K-Menu cashewp??hkin?? 500g",
          "Lime",
          "Tyrkisk Peber Liquorice 120g",
          "Pirkka suomalainen pesty porkkana 500g 1 lk",
          "Felix maustekurkkuviipale 560g/300g viipaloituja kurkkuja mausteliemess??",
          "Sofine 250g Maustamaton Luomutofu",
          "Violife Greek White 230/200g",
          "Pirkka kookosmaito 400ml",
          "Pirkka wc-paperi 6rl valkoinen",
          "Pirkka kuvioitu talouspaperi puoliarkki 4rl",
          "Pirkka punaiset linssit suolaliemess?? 380g/230g",
          "Pirkka italialainen veriappelsiini 750g",
          "Pirkka lohikuutiot 300g ASC pakaste",
          "Pirkka tonnikalapalat vedess?? 185g/130g MSC",
          "Malaco TV Mix Salmiakki 280g",
          "Malaco Aakkoset Sirkus makeissekoitus 315g",
          "Malaco TV MIX Laku makeissekoitus 325g",
          "Tuorehiiva 50 g leivinhiiva",
          "Pirkka leivinpaperi 38cmx15m valkaisematon",
          "Pirkka Parhaat riisinuudeli 180g",
          "Oululainen Hapankorppu 200 g",
          "Hortiherttua Thaibasilika laatuluokka 1",
          "M?? kaurajogu 400g mets??mansikka",
          "Oatly kaurajuoma suklaa 2,5dl UHT"
        ]
      },
      {
        "deliveryAt": "2022-01-18T12:00:00+00:00",
        "items": [
          "Kurkku Suomi",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Sevan hummus 275g original",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Paul??ns 450g hasselp??hkin?? ja taateli granola muromysli",
          "Pirkka sitruunanmakuinen kivenn??isvesi 1,5l",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Bonduelle Eritt??in hienoja herneit?? 400g/280g",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Planti Cooking kaura 2dl Original",
          "Pirkka Vichy 1,5l",
          "Arla Keso raejuusto 200g vanilja",
          "P??gen H??n?? saaristolaisrieska 630g",
          "Valio vapaan lehm??n kevytmaito 1l",
          "Pirkka luomu Reilun kaupan banaani",
          "Oatly kaurajuoma 1l UHT",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Ullan Pakari Ullan ruis 300g",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Flora margariini 600g 60% normaalisuolainen",
          "Pirkka laktoositon kevytmaitojuoma 1l",
          "Pirkka peanut butter crunchy 350g",
          "Classic papukahvi 500g Franskrost",
          "Pirkka kikherneet suolaliemess?? 380g/230g",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Barilla Genovese pestokastike 190g",
          "Apetina juustokuutiot 200g",
          "Lime",
          "Leivon Boltsi py??rykk?? 230g original",
          "Pirkka suomalainen pesty porkkana 500g 1 lk",
          "Apetit laktoositon lohikeitto 400g pakaste",
          "Pirkka suomalainen kaurahiutale 1kg",
          "Pirkka lakkahillo 400 g",
          "Pirkka kookosmaito 400ml",
          "Pirkka paseerattu tomaatti 500 g",
          "Pirkka vaahterasiirappi 250 ml",
          "Heinz Ketchup 1kg",
          "Felix tomaattipyree 300g",
          "Pirkka rapea kalaleike 400g MSC pakaste",
          "Naapurin Maalaiskanan rapeat fileeviipaleet 300 g Mild-Crispy",
          "Lapin Liha poronk??ristys 240 g pakaste",
          "Pirkka appelsiini",
          "Punakaali Suomi",
          "Valio Eila kevytmaitojuoma 2,5dl laktoositon UHT",
          "Arla Luonto+ AB jogurtti 1kg p????ryn?? laktoositon",
          "Juustoportti Hyvin sokeroimaton jogurtti 1 kg mustikka-mansikka-vadelma laktoositon",
          "Pirkka kermajuusto 1 kg laktoositon",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "Go-Tan Sriracha Sauce tulinen chilikastike 215ml"
        ]
      },
      {
        "deliveryAt": "2022-01-05T19:00:00+00:00",
        "items": [
          "Kurkku Suomi",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Valio Hyv?? suomalainen Arki emmental e625g",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Sevan hummus 275g original",
          "Pirkka sitruunanmakuinen kivenn??isvesi 1,5l",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka Vichy 1,5l",
          "Barilla Genovese pestokastike 190g",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Bonduelle Eritt??in hienoja herneit?? 400g/280g",
          "Planti Cooking kaura 2dl Original",
          "Flora margariini 600g 60% normaalisuolainen",
          "Arla Keso raejuusto 200g vanilja",
          "P??gen H??n?? saaristolaisrieska 630g",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Juustoportti Hyvin sokeroimaton marjainen keitto 1kg",
          "Pirkka suomalainen kaurahiutale 1kg",
          "Classic papukahvi 500g Franskrost",
          "Pirkka kikherneet suolaliemess?? 380g/230g",
          "Pirkka peanut butter crunchy 350g",
          "Ullan Pakari Ullan ruis 300g",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "Oatly ruokaan fraiche 2dl",
          "K-Menu riisipiirakka 12kpl /1020g pakaste",
          "Apetit laktoositon lohikeitto 400g pakaste",
          "Felix maustekurkkuviipale 560g/300g viipaloituja kurkkuja mausteliemess??",
          "Kitchen Joy panang curry-kanaa ja jasminriisi?? 350g pakaste",
          "Kitchen Joy sweet & sour hapanimel??broileria ja jasminriisi?? 350g pakaste",
          "Kitchen Joy tikka masala broileria ja jasminriisi?? 350g pakaste",
          "Kitchen Joy punaista kasviscurrya ja riisi?? 350g pakaste",
          "Pirkka suomalainen mustikka 500g pakaste",
          "Pirkka Parhaat riisinuudeli 180g",
          "Pirkka Luomu kaurajuoma 1l UHT",
          "Pirkka luomu Reilun kaupan banaani",
          "Kokkikartano broileripasta 650g",
          "Valio vapaan lehm??n kevytmaito 1l",
          "K-Menu cashewp??hkin?? 500g",
          "Heinz Ketchup 1kg",
          "Pirkka kalapuikko MSC 10 kpl/250 g pakaste",
          "Pirkka Royal Gala omena 1kg 1lk, ulkomainen",
          "Lime",
          "Planti soygurt 2x150g vanilja",
          "Planti Soygurt 2x150g mustikka",
          "Lotus Biscoff Spread karamellisoitu keksilevite 400g",
          "Wasa n??kkileip?? 290g sesam&havssalt",
          "Pirkka Bioj??tepussi 20 kpl 30x22x12 cm",
          "Pirkka kuvioitu talouspaperi puoliarkki 4rl"
        ]
      },
      {
        "deliveryAt": "2021-12-30T15:00:00+00:00",
        "items": [
          "Dovgan kondensoitu maito 397g makeutettu",
          "Pirkka suomalainen kuohukerma 2dl",
          "Kouvolan Lakritsi Lakritsikastike 2dl",
          "Macu Vadelma kastike 300ml",
          "Pirkka kinuskikastike 2dl laktoositon",
          "HARIBO Chamallows Minis 150g vaahto",
          "Maku Brewing O??Maku Dry Stout 3,9% 0,33l",
          "Karhu Laku Portteri 5,5% 0,5l",
          "Maku Brewing Auervaara IPA 5,5% 0,33l",
          "Olvi I.P.A. 4,7% 0,5l",
          "Olvi Iisalmi Lakka-Pihlaja GIN lonkero 5,0% 0,33l",
          "Olvi Iisalmi Puolukka GIN lonkero 5,0% 0,33l",
          "Pirkka kikherneet suolaliemess?? 380g/230g",
          "Pirkka curry 23g mausteseos",
          "Pirkka kookosmaito 400ml",
          "Pirkka Luomu paseerattu tomaatti 500g",
          "Pirkka suomalainen keltasipuli 350g",
          "Valkosipuli ulkomainen kg",
          "Inkiv????ri",
          "Pirkka basmatiriisi 1kg",
          "Santa Maria India Mango Chutney Original 350g t??lkki",
          "Pirkka mantelilastu 100g",
          "Pirkka sitruunanmakuinen kivenn??isvesi 1,5l",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Pirkka kes??kurpitsa ulkomainen"
        ]
      },
      {
        "deliveryAt": "2021-12-23T10:00:00+00:00",
        "items": [
          "Pirkka suomalainen t??ysmaito 1l",
          "Pirkka suomalainen kevytmaito 1l",
          "Saarioinen Maksalaatikko 400 g laktoositon/rusinaton",
          "Pirkka pehme??t taatelit 200g",
          "Valio Keisarinna 300g",
          "Castello white valkohomejuusto 150g",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Pirkka suomalainen kuohukerma 2dl",
          "Myllyn Paras Torttutaikina 1 kg pakastetaikina margariini",
          "Dronningholm T??htitorttu Omena-kanelimarmeladi 300g",
          "Pirkka majoneesi 250g",
          "Vaasan Isopaahto vehn?? 500 g paahtoleip??",
          "Pirkka lakkahillo 400 g",
          "Pirkka smetana 35% 120g laktoositon",
          "Pirkka makea sipuli 350 g 2 lk",
          "Abba sinappisilli 230g MSC",
          "Abba valkosipulisilli 225g MSC",
          "Pirkka rypsi??ljy 900ml",
          "Flora margariini 600g 60% normaalisuolainen",
          "Pirkka leip??juusto 310g laktoositon",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Kurkku Suomi",
          "Sevan hummus 275g original",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Paul??ns 450g hasselp??hkin?? ja taateli granola muromysli",
          "Pirkka Vichy 1,5l",
          "Apetina juustokuutiot 200g",
          "Pirkka krutonki 120 g",
          "Pirkka sriracha kastike 240ml",
          "Omar pussi 220g",
          "Tyrkisk Peber Hot & Sour 150g pippurisia salmiakkihedelm??karamelleja",
          "Prix lakulehm?? 275g",
          "Valio AB piim?? 1 l",
          "Tuorehiiva 50 g leivinhiiva",
          "Dansukker tumma siirappi 750g",
          "J??rvikyl?? tilli ruukku Suomi",
          "WC-Kukka 2x50g m??nty wc-raikastin tuplapakkaus",
          "Dr.Oetker vaniljatanko gourmet 1kpl",
          "Bonne premium mustikkamehu 1l",
          "Pirkka Luomu appelsiini",
          "Annas Original piparkakku 300 g",
          "Valio Oddlygood Barista kaurajuoma 0,75l korvapuusti gluteeniton",
          "Dovgan kondensoitu maito 397g makeutettu",
          "Lanttu Suomi",
          "Pirkka pekaanip??hkin?? 125g",
          "Pirkka suomalainen pesty porkkana 500g 1 lk",
          "Pirkka sitruunanmakuinen kivenn??isvesi 1,5l",
          "Pirkka appelsiininmakuinen kivenn??isvesi 1,5l",
          "Pirkka mets??mansikanmakuinen kivenn??isvesi 1,5l",
          "Planti Cooking kaura 2dl Original",
          "Oatly kaurajuoma 1l UHT",
          "Fazer kaurajuoma Dumle 1l gluteeniton UHT",
          "Pirkka suomalainen pesty puikulaperuna 1 kg",
          "Pirkka suomalainen pesty punajuuri 1 kg 1lk",
          "Sitruuna kg",
          "Hartwall Jaffa Jouluomena 1,5l",
          "Oatly p??MACKAN 150g maustamaton",
          "Herkkumaa Makeita maustekurkkuja 670g/360g",
          "Porkkana 1kg Suomi 1lk",
          "Sevan Kikhernejauho 600g",
          "Myllyn Paras Korppujauho 300g",
          "Pirkka valkopippuri 20g jauhettu",
          "Santa Maria piparkakkumauste 18g",
          "Tolu yleispuhdistusainespray K??ytt??valmis 500ml",
          "Mama kananmakuinen nuudeli 6x55g",
          "Sipuli 500g luomu NL/EG 2 lk",
          "Pirkka Luomu suomalainen kauralese 500g",
          "Malaco TV Mix Salmiakki 280g",
          "Fredman paistovuoka 1 l kartonkia 3 kpl",
          "Pirkka ruisjauho 1kg",
          "Pirkka puolukkahillo 400g"
        ]
      },
      {
        "deliveryAt": "2021-12-14T19:00:00+00:00",
        "items": [
          "Paul??ns 450g hasselp??hkin?? ja taateli granola muromysli",
          "Kurkku Suomi",
          "Sevan hummus 275g original",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Pirkka peanut butter crunchy 350g",
          "Bonduelle Eritt??in hienoja herneit?? 400g/280g",
          "Pirkka sitruunanmakuinen kivenn??isvesi 1,5l",
          "Oatly kaurajuoma 1l UHT",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Planti Cooking kaura 2dl Original",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Pirkka suomalainen kaurahiutale 1kg",
          "Pirkka laktoositon kevytmaitojuoma 1l",
          "Pirkka Vichy 1,5l",
          "Arla Keso raejuusto 200g vanilja",
          "Barilla Genovese pestokastike 190g",
          "Valio vapaan lehm??n kevytmaito 1l",
          "P??gen H??n?? saaristolaisrieska 630g",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Pirkka luomu Reilun kaupan banaani",
          "Flora margariini 600g 60% normaalisuolainen",
          "Juustoportti Hyvin sokeroimaton marjainen keitto 1kg",
          "Saarioinen Maksalaatikko 400 g laktoositon/rusinaton",
          "Valio Hyv?? suomalainen Arki emmental e625g",
          "Pirkka kookosmaito 400ml",
          "Pirkka All in 1 konetiskitabletti 24kpl/432g",
          "Leivon Boltsi py??rykk?? 230g original",
          "Pirkka kikherneet suolaliemess?? 380g/230g",
          "Planti YogOat 750g vanilja",
          "Pirkka lakkahillo 400 g",
          "Go-Tan Sriracha Hot Chilli Sauce tulinen chilikastike 380 ml",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "Jalotofu Paahtopala maustettu 250g luomu",
          "Spice Up Nuudeli 400g",
          "Old El Paso vehn??tortilla 326g Medium size",
          "Pirkka Tiramisu italialainen j????tel?? 300g/0,5l",
          "Kitchen Joy creamy tom yum - kanaa ja nuudeleita 320g pakaste",
          "Kitchen Joy 320g green curry chicken pakaste",
          "Kitchen Joy Green Cube savoury yakisoba - kasviksia ja nuudeleita 300g pakaste",
          "Pirkka peruna-sipulisekoitus 500 g pakaste",
          "Pirkka suomalainen mustikka 200 g pakaste",
          "Pirkka kalapuikko MSC 10 kpl/250 g pakaste",
          "Pirkka maustetu ristikkoperunat 600 g pakaste",
          "Danerolles 240g Croissants 6kpl tuoretaikina",
          "Pirkka hienonnettua pinaattia paloina 150 g pakaste",
          "Pirkka pizzapohja 4kpl/360g pakaste",
          "Pirkka kukkakaali 450 g pakaste",
          "Findus Pommes Noisettes 350g",
          "Pirkka soijapapu 250g pakaste",
          "Quorn Kuutiot 300g",
          "Apetit sugar snaps pullea sokeriherne 300g pakaste",
          "Apetit laktoositon lohikeitto 400g pakaste",
          "Kokkikartano broileripasta 650g",
          "Atria perhetilan kana fileesuikale naturel 250g",
          "Pirkka suomalainen kiinte?? peruna 1kg",
          "Granaattiomena",
          "Pirkka suomalainen pesty porkkana 500g 1 lk",
          "K-Menu cashewp??hkin?? 500g",
          "K-Menu riisipiirakka 12kpl /1020g pakaste",
          "Heinz Ketchup 1kg",
          "Ekstr??ms sekamehutiiviste 0,5l vadelmainen"
        ]
      },
      {
        "deliveryAt": "2021-11-30T15:00:00+00:00",
        "items": [
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Bonduelle Eritt??in hienoja herneit?? 400g/280g",
          "Kurkku Suomi",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Paul??ns 450g hasselp??hkin?? ja taateli granola muromysli",
          "Pirkka peanut butter crunchy 350g",
          "Valio Hyv?? suomalainen Arki emmental e625g",
          "Planti Cooking kaura 2dl Original",
          "Sevan hummus 275g original",
          "Pirkka sitruunanmakuinen kivenn??isvesi 1,5l",
          "Oatly kaurajuoma 1l UHT",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka laktoositon kevytmaitojuoma 1l",
          "Pirkka Vichy 1,5l",
          "Valio vapaan lehm??n kevytmaito 1l",
          "Arla Keso raejuusto 200g vanilja",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Pirkka luomu Reilun kaupan banaani",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "P??gen H??n?? saaristolaisrieska 630g",
          "Classic papukahvi 500g Franskrost",
          "Ullan Pakari Ullan ruis 300g",
          "Flora margariini 600g 60% normaalisuolainen",
          "Juustoportti Hyvin sokeroimaton jogurtti 1kg mansikka-vadelma laktoositon",
          "Juustoportti Hyvin sokeroimaton marjainen keitto 1kg",
          "Pirkka suomalainen puolikarkea vehn??jauho 2kg",
          "Alpro soijavalmiste 400g vadelma-omena",
          "Alpro soijavalmiste 750g makeuttamaton luomu",
          "Planti YogOat 750g vanilja",
          "Apetina juustokuutiot 200g",
          "Pirkka vehn??tortilla 8 kpl/320g",
          "Pirkka Parhaat siemenn??kkileip?? kaura-hampunsiemen 210g gluteeniton",
          "Pirkka suomalainen yleisperuna 1kg",
          "Leivon Boltsi py??rykk?? 230g original",
          "Pirkka ananasmurska ananast??ysmehussa 227g/140g",
          "Wasa n??kkileip?? 290g sesam&havssalt",
          "Oululainen hapankorppu 740g"
        ]
      },
      {
        "deliveryAt": "2021-11-23T19:00:00+00:00",
        "items": [
          "Pirkka peanut butter crunchy 350g",
          "Sevan hummus 275g original",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Kurkku Suomi",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Pirkka sitruunanmakuinen kivenn??isvesi 1,5l",
          "Paul??ns 450g hasselp??hkin?? ja taateli granola muromysli",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Oatly kaurajuoma 1l UHT",
          "Pirkka suomalainen kaurahiutale 1kg",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Oatly ruokaan fraiche 2dl",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Pirkka laktoositon kevytmaitojuoma 1l",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Pirkka valkosipuli 100 g 2lk",
          "Pirkka Vichy 1,5l",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Flora margariini 600g 60% normaalisuolainen",
          "Saarioinen Maksalaatikko 400 g laktoositon/rusinaton",
          "Pirkka luomu Reilun kaupan banaani",
          "P??gen H??n?? saaristolaisrieska 630g",
          "Lime",
          "Juustoportti Hyvin sokeroimaton marjainen keitto 1kg",
          "Valio Oddlygood Barista kaurajuoma 0,75l korvapuusti gluteeniton",
          "Barilla Classico 400g pastakastike",
          "Sallinen Kivett??mi?? taateleita 250g",
          "Lapin Liha poronk??ristys 240 g pakaste",
          "Pirkka Korianteri 21g jauhettu",
          "Pirkka juustokumina 23g jauhettu",
          "Pirkka kikherneet suolaliemess?? 380g/230g",
          "Ben&Jerry's j????tel?? 465ml/406g cookie dough",
          "Ben & Jerry's j????tel?? Topped Salted Caramel Brownie 438ml/403g",
          "Ben&Jerry's j????tel?? 465ml/425g peanut butter",
          "Ben&Jerry's j????tel?? 465ml/406g half baked pa",
          "Ben&Jerry's j????tel?? 465ml/405g Netflix&Chilll'd",
          "Ben&Jerry's j????tel?? 465ml/404g Cookie Dough",
          "Pirkka mantelijauhe 100g",
          "Yutaka luomu misotahna 300g",
          "Pirkka appelsiini",
          "Pirkka Luomu mandariini",
          "Yutaka Panko 180g",
          "Pirkka soijapapu 250g pakaste",
          "Pirkka rypsi??ljy 900ml",
          "J????salaatti 100g pussi Suomi 1lk",
          "Arla Keso raejuusto 200g vanilja",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Pirkka munanuudeli 250g",
          "Bonduelle Eritt??in hienoja herneit?? 400g/280g",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "Planti Cooking kaura 2dl Original",
          "Valio vapaan lehm??n kevytmaito 1l",
          "Apetit sugar snaps pullea sokeriherne 300g pakaste",
          "Apetit laktoositon lohikeitto 400g pakaste",
          "Atria Perhetilan 400g Naturel Kanan Fileesuikale",
          "Retiisi 125g 1lk",
          "Pirkka basmatiriisi 1kg",
          "Ler??y kirjolohifilee rdton n1kg vac C trim",
          "Pirkka lakkahillo 400 g",
          "head&shoulders shampoo 225ml Dry Scalp Care",
          "Rummo Perunagnocchi 500g",
          "Beanit?? maustamaton h??rk??papumuru 250g"
        ]
      }
    ];

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
function runBookmarklet() {
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
    <span>Muista my??s n??m??</span>
  </h3>
  <ul class="shopping-list-items department-item-listing">
    <li><ul style="padding-left: 1em; list-style-type:circle; list-style-position: inside;">${itemsHtml}</ul></li>
  </ul>
</li>
`;
  }

}

