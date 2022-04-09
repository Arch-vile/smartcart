function test() {
  console.log('it works');
}

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
/**
 *
 * @returns {Promise<{deliveredAt: string, items: string[]}[]>}
 */
async function buildOrderHistory() {
  const orderIds = await fetchOrders();
  const orders = orderIds.map(async id => {
    return await fetchOrder(id);
  });
  return await Promise.all(orders);
}

// var theHistory;
// buildHistory().then(it => {
//     console.log(it);
//     theHistory = it;
// });
//

const orderHistoryX =
    [
      {
        "deliveredAt": "2022-03-30T11:00:00+00:00",
        "items": [
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "Sevan hummus 275g original",
          "Bonduelle Erittäin hienoja herneitä 400g/280g",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Pirkka sitruunanmakuinen kivennäisvesi 1,5l",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Kurkku Suomi",
          "Pirkka Vichy 1,5l",
          "Flora margariini 600g 60% normaalisuolainen",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pågen Hönö saaristolaisrieska 630g",
          "Oatly kaurajuoma 1l UHT",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "K-Menu cashewpähkinä 500g",
          "Pirkka peanut butter crunchy 350g",
          "Pirkka luomu Reilun kaupan banaani",
          "Valio vapaan lehmän kevytmaito 1l",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Arla Keso raejuusto 200g vanilja",
          "MÖ kaurajogu 400g metsämansikka",
          "Pirkka suomalainen kuohukerma 2dl",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Paulúns 450g hasselpähkinä ja taateli granola muromysli",
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
          "Jääsalaatti 100g pussi Suomi 1lk",
          "K-Menu merisuola 1kg",
          "Maple Joe vaahterasiirappi 250g",
          "Kikkoman sushi riisiviinietikka 300ml",
          "Pirkka basmatiriisi 1kg",
          "Maizena maissitärkkelys jauho 400 g",
          "Pirkka leivinpaperi 38cmx15m valkaisematon",
          "Ben&Jerry's jäätelö 465ml/405g Netflix&Chilll'd",
          "Ben&Jerry's pint 465ml Caramel Brownie Party",
          "Ben&Jerry's jäätelö 465ml/406g half baked pa",
          "Ben&Jerry's jäätelö 465ml/404g Cookie Dough",
          "Pirkka suolapähkinät 350g",
          "Pirkka biojätepussi paperinen 20 kpl",
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
        "deliveredAt": "2022-03-23T15:00:00+00:00",
        "items": [
          "Sevan hummus 275g original",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Kurkku Suomi",
          "K-Menu cashewpähkinä 500g",
          "Pirkka sitruunanmakuinen kivennäisvesi 1,5l",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Arla Keso raejuusto 200g vanilja",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Flora margariini 600g 60% normaalisuolainen",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka peanut butter crunchy 350g",
          "Bonduelle Erittäin hienoja herneitä 400g/280g",
          "Oatly kaurajuoma 1l UHT",
          "Pirkka Vichy 1,5l",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Pirkka luomu Reilun kaupan banaani",
          "Valio vapaan lehmän kevytmaito 1l",
          "Ullan Pakari Ullan ruis 300g",
          "Pågen Hönö saaristolaisrieska 630g",
          "Tyrkisk Peber Liquorice 120g",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Paulúns 450g hasselpähkinä ja taateli granola muromysli",
          "MÖ kaurajogu 400g metsämansikka",
          "Wasa näkkileipä 290g sesam&havssalt",
          "Pirkka lakkahillo 400 g",
          "Inkivääri",
          "Apetina juustokuutiot 200g",
          "Pirkka suomalainen kaurahiutale 1kg",
          "Pirkka kermajuusto 1 kg laktoositon",
          "Felix maustekurkkuviipale 560g/300g viipaloituja kurkkuja mausteliemessä",
          "Valio Eila kevytmaitojuoma 2,5dl laktoositon UHT",
          "Flowflex SARS-CoV-2 Antigeenipikatesti 1kpl",
          "Pirkka wc-paperi 6rl valkoinen",
          "Jääsalaatti 100g pussi Suomi 1lk",
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
          "Sicilia sitruunatäysmehu 200ml",
          "Sicilia limettimehu 200ml makeuttamaton",
          "Pirkka Luomu sitruuna",
          "Lime",
          "Valio Oddlygood Dream Fraiche 200g",
          "Pirkka kukkakaali pakattu ulkomainen",
          "Apetit sugar snaps pullea sokeriherne 300g pakaste",
          "Pirkka valkosipuli 100 g 2lk",
          "Pirkka Tiramisu italialainen jäätelö 300g/0,5l",
          "Fazer jäätelö Turkis Peber Hot&Sour 480ml"
        ]
      },
      {
        "deliveredAt": "2022-03-16T19:00:00+00:00",
        "items": [
          "Sevan hummus 275g original",
          "Bonduelle Erittäin hienoja herneitä 400g/280g",
          "Pirkka sitruunanmakuinen kivennäisvesi 1,5l",
          "Pirkka peanut butter crunchy 350g",
          "Kurkku Suomi",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Planti Cooking kaura 2dl Original",
          "Paulúns 450g hasselpähkinä ja taateli granola muromysli",
          "Flora margariini 600g 60% normaalisuolainen",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Oatly kaurajuoma 1l UHT",
          "K-Menu cashewpähkinä 500g",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka lakkahillo 400 g",
          "Pirkka Vichy 1,5l",
          "Ullan Pakari Ullan ruis 300g",
          "Valio vapaan lehmän kevytmaito 1l",
          "Tyrkisk Peber Liquorice 120g",
          "Pågen Hönö saaristolaisrieska 630g",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Apetit laktoositon lohikeitto 400g pakaste",
          "Wasa näkkileipä 290g sesam&havssalt",
          "Avokado 800g PE/CO/CL 1lk",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Pirkka kermajuusto 1 kg laktoositon",
          "MÖ kaurajogu 400g metsämansikka",
          "Pirkka vanupuikko 200kpl",
          "Oululainen hapankorppu 740g",
          "Tolu yleispuhdistusainespray Käyttövalmis 500ml",
          "Pirkka nestesaippua 3L Cotton/Mandariini/Mustikka",
          "Go-Tan Sriracha Hot Chilli Sauce tulinen chilikastike 380 ml",
          "Classic papukahvi 500g Franskrost",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Pirkka Royal Gala omena 1kg 1lk, ulkomainen",
          "Pirkka valkosipuli 100 g 2lk",
          "Jääsalaatti 100g pussi Suomi 1lk",
          "Pirkka kesäkurpitsa ulkomainen",
          "Pirkka Luomu suomalainen yleisperuna 1kg",
          "Purjo ulkomainen",
          "Bimi® makea varsiparsakaali 150g luomu Espanja 1lk",
          "Granaattiomena",
          "Pirkka Luomu porkkanasose 500 g",
          "Sydänsalaatti 200g/2kpl luomu Espanja 1 lk",
          "Pirkka tonnikalapalat vedessä 200g/150g",
          "Jalostaja perinteinen hernekeitto 520g",
          "Felix maustekurkkuviipale 560g/300g viipaloituja kurkkuja mausteliemessä",
          "Pirkka viipaloidut herkkusienet 320g/160g",
          "Pielisen Kalajaloste Villikala öljyssä 150g/115g",
          "Pepsodent Super Fluor hammastahna 125ml",
          "Oboy Original 1 kg",
          "Pirkka mikropopcorn 3x100g",
          "Kivikylän kanafileepyörykkä 300g",
          "Kitchen Joy Green Cube savoury yakisoba - kasviksia ja nuudeleita 300g pakaste",
          "Kitchen Joy creamy tom yum - kanaa ja nuudeleita 320g pakaste",
          "GoGreen Punaiset Linssit 400 g",
          "Kenkälusikka 42cm, värilajitelma"
        ]
      },
      {
        "deliveredAt": "2022-03-09T12:00:00+00:00",
        "items": [
          "Sevan hummus 275g original",
          "Bonduelle Erittäin hienoja herneitä 400g/280g",
          "Pirkka sitruunanmakuinen kivennäisvesi 1,5l",
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
          "K-Menu cashewpähkinä 500g",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Pirkka lakkahillo 400 g",
          "Pirkka luomu Reilun kaupan banaani",
          "Pirkka Vichy 1,5l",
          "Ullan Pakari Ullan ruis 300g",
          "Valio vapaan lehmän kevytmaito 1l",
          "Tyrkisk Peber Liquorice 120g",
          "Pågen Hönö saaristolaisrieska 630g",
          "Heinz Ketchup 1kg",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Pirkka suomalainen kaurahiutale 1kg",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Pirkka kermajuusto 1 kg laktoositon",
          "Saarioinen Iso vaalea riisipiirakka 9 kpl 630 g",
          "Valio pehmeä maitorahka 250 g",
          "MÖ kaurajogu 400g metsämansikka",
          "Serla wc-paperi 8 rl keltainen",
          "Pirkka Parhaat siemennäkkileipä kaura-hampunsiemen 210g gluteeniton",
          "Ben & Jerry's jäätelö Topped Salted Caramel Brownie 438ml/403g",
          "Ben & Jerry's Topped Chocolate Caramel & Cookie Dough 438ml/409g",
          "Apetit sugar snaps pullea sokeriherne 300g pakaste",
          "Pirkka espanjalainen parsakaali 400g 1lk",
          "Pirkka suomalainen viljelty herkkusieni 200g 1lk",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Jääsalaatti 100g pussi Suomi 1lk",
          "Pirkka täysjyväspagetti 500g",
          "Myllyn Paras Raketti Spagetti 350g",
          "Ehrmann Grand Dessert 190g vanilja",
          "Ehrmann Grand Dessert tuplatoffee 190g",
          "Ehrmann Grand Dessert 190g valkosuklaa-mansikka",
          "Saarioinen Maksalaatikko 400 g laktoositon/rusinaton",
          "Vataja lisäaineeton nakki 280g",
          "Gold&Green savu-BBQ-marinoitu Delikaura 120g",
          "Ehrmann Grand Dessert valkosuklaa 190g",
          "Saarioinen lasagne 600g",
          "Gatorade Cool Blue 0,5l",
          "Saarioinen Kanakeitto 300 g",
          "Pirkka curry 23g mausteseos",
          "Pirkka esipaistettu valkosipulivoipatonki 175g pakaste",
          "K-Menu riisipiirakka 12kpl /1020g pakaste",
          "Pirkka esipaistettu kiviuunisiemensämpylä 4kpl/300g",
          "Apetina juustokuutiot 200g",
          "Pirkka suolapähkinät 350g",
          "Valio Eila kevytmaitojuoma 2,5dl laktoositon UHT",
          "Pirkka kuvioitu talouspaperi puoliarkki 4rl",
          "Dracula Piller Salmiakki 65 g"
        ]
      },
      {
        "deliveredAt": "2022-03-02T19:00:00+00:00",
        "items": [
          "Sevan hummus 275g original",
          "Pirkka sitruunanmakuinen kivennäisvesi 1,5l",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Kurkku Suomi",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Bonduelle Erittäin hienoja herneitä 400g/280g",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Planti Cooking kaura 2dl Original",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Pirkka luomu Reilun kaupan banaani",
          "Arla Keso raejuusto 200g vanilja",
          "Valio vapaan lehmän kevytmaito 1l",
          "Pirkka suomalainen kuohukerma 2dl",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka Vichy 1,5l",
          "Flora margariini 600g 60% normaalisuolainen",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Ullan Pakari Ullan ruis 300g",
          "K-Menu cashewpähkinä 500g",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Tyrkisk Peber Liquorice 120g",
          "Sofine 250g Maustamaton Luomutofu",
          "Inkivääri",
          "Pirkka proteiinijuoma 250ml vanilja laktoositon",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Valio pehmeä maitorahka 250 g",
          "Pågen Oivallus rukiinen vehnäpalaleipä 15kpl/530g",
          "Pirkka rapea kalaleike 400g MSC pakaste",
          "Pirkka Luomu kaurajuoma 1l UHT",
          "Spice Up Nuudeli 400g",
          "Naapurin maalaiskanapojan jauheliha 800 g",
          "Pirkka esipaistettu vehnäsämpylä 6kpl/300g",
          "Jyväshyvä välipalakeksi 6x30g tumma suklaa",
          "Jyväshyvä välipalakeksi 6x30g mansikka",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Jääsalaatti 100g pussi Suomi 1lk",
          "Järvikylä korianteri rkk FI",
          "Jalotempe Härkäpapu 250g Luomu"
        ]
      },
      {
        "deliveredAt": "2022-02-24T15:00:00+00:00",
        "items": [
          "Sevan hummus 275g original",
          "Pirkka sitruunanmakuinen kivennäisvesi 1,5l",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Barilla Genovese pestokastike 190g",
          "Kurkku Suomi",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Bonduelle Erittäin hienoja herneitä 400g/280g",
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
          "Pågen Hönö saaristolaisrieska 630g",
          "Apetit laktoositon lohikeitto 400g pakaste",
          "Ullan Pakari Ullan ruis 300g",
          "K-Menu cashewpähkinä 500g",
          "Valio Hyvä suomalainen Arki emmental e625g",
          "Paulúns 450g hasselpähkinä ja taateli granola muromysli",
          "Heinz Ketchup 1kg",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Tyrkisk Peber Liquorice 120g",
          "Sofine 250g Maustamaton Luomutofu",
          "Inkivääri",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Pirkka suomalainen puolikarkea vehnäjauho 2kg",
          "Tuorehiiva 50 g leivinhiiva",
          "Valio kanelikreemi 200 g laktoositon",
          "Pirkka vadelmahillo 400g",
          "Prix lakulehmä 275g",
          "Prix kermatoffee kermalehmä 275g",
          "Pirkka suolapähkinät 350g",
          "Lotus Biscoff Spread karamellisoitu keksilevite 400g",
          "Ben&Jerry's jäätelö 465ml/404g Cookie Dough",
          "Ben&Jerry's jäätelö 465ml/425g peanut butter",
          "Pirkka valkosipuli 100 g 2lk",
          "Sallinen mantelimassa 150g",
          "Pirkka suomalainen kevytmaito 1l",
          "Felix maustekurkkuviipale 560g/300g viipaloituja kurkkuja mausteliemessä",
          "Pirkka kanelitanko 15g",
          "San Marcos chipotle pippureita Adobo kastikkeessa 230g",
          "Pirkka mustapavut suolaliemessä 380g/230g",
          "Pirkka isot valkoiset pavut suolaliemessä 380g/230g",
          "Pirkka Modenalainen balsamietikka 250ml",
          "Risella Täysjyväriisi 1kg",
          "Pirkka tomaattimurska 500 g",
          "Lime",
          "Järvikylä korianteri rkk FI",
          "Apetit sugar snaps pullea sokeriherne 300g pakaste",
          "Pirkka emmental-mozzarella juustoraaste 150g vähälaktoosinen",
          "Santa Maria 240g Tex Mex Tortilla Beetroot Medium  (6-pack)",
          "Santa Maria 240g Tex Mex Tortilla Carrot Medium",
          "Pirkka ananaspalat ananastäysmehussa 227g/140g",
          "Pirkka oregano 6g",
          "Sipuli 1kg Suomi 2lk",
          "Findus ruusukaali 550g",
          "Oatly ruokaan fraiche 2dl",
          "Valio Oddlygood Barista kaurajuoma 0,75l korvapuusti gluteeniton",
          "MÖ kaurajogu 400g metsämansikka",
          "Avokado 800g PE/CO/CL 1lk"
        ]
      },
      {
        "deliveredAt": "2022-02-19T16:00:00+00:00",
        "items": [
          "Sensodyne Original hammastahna 75ml",
          "Elmex Junior hammastahna 75ml 6-12 vuotiaille",
          "Saarioinen Lihamakaronilaatikko 400 g",
          "Pirkka vehnätortilla 8 kpl/320g",
          "Apetina juustokuutiot 200g",
          "Kurkku Suomi",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "GoGreen Bean Salsa Original 380g",
          "Atria Vuolu kanafilee mustapippuri 200g",
          "Atria Vuolu kanafilee pehmeä savu 200g",
          "Valio Hyvä suomalainen Arkirae 500g",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "SM Tex MexTaco Sauce Mild 230g",
          "Valio emmental raaste 150g punaleima",
          "Fazer Alku ruis & taateli kaurapuuro 500g",
          "Pirkka peanut butter crunchy 350g",
          "Arla Keso raejuusto 200g vanilja",
          "Ullan Pakari palaRuis 3/300g",
          "Ullan Pakari porkkanasämpylä 300g",
          "Vaasan Ruispalat 660 g 12 kpl täysjyväruisleipä",
          "HK Herkkumaksamakkara 300g",
          "Flora margariini 400g  60% normaalisuola",
          "Pirkka kermajuusto 1 kg laktoositon",
          "LU Belvita välipalakeksi 253g marja-jogurtti",
          "Pirkka proteiinijuoma 250ml vanilja laktoositon",
          "Saarioinen Iso vaalea riisipiirakka 9 kpl 630 g",
          "Karhu Laku Portteri 5,5% 0,5l",
          "Olvi I.P.A. 4,7% 0,5l",
          "Snellman pepperoni 130g",
          "Tomaatti Suomi",
          "Président Sainte Maure vuohenjuusto 200g",
          "Valkosipuli ulkomainen kg",
          "Ullan Pakari 100% kaura 300g",
          "Pirkka mansikka-banaanismoothie 1l",
          "Pirkka sitruunanmakuinen kivennäisvesi 1,5l",
          "K-Menu Jaffa 0,33l 6-pack"
        ]
      },
      {
        "deliveredAt": "2022-02-15T15:00:00+00:00",
        "items": [
          "Sevan hummus 275g original",
          "Pirkka sitruunanmakuinen kivennäisvesi 1,5l",
          "Barilla Genovese pestokastike 190g",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Bonduelle Erittäin hienoja herneitä 400g/280g",
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
          "Valio vapaan lehmän kevytmaito 1l",
          "Oatly kaurajuoma 1l UHT",
          "Pirkka peanut butter crunchy 350g",
          "Pågen Hönö saaristolaisrieska 630g",
          "Paulúns 450g hasselpähkinä ja taateli granola muromysli",
          "Arla Keso raejuusto 200g vanilja",
          "Pirkka kinuskikastike 2dl laktoositon",
          "Classic papukahvi 500g Franskrost",
          "K-Menu cashewpähkinä 500g",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Ullan Pakari Ullan ruis 300g",
          "Pirkka italialainen veriappelsiini 750g",
          "Wasa näkkileipä 290g sesam&havssalt",
          "Pirkka suomalainen kuohukerma 2dl",
          "Apetit laktoositon lohikeitto 400g pakaste",
          "MÖ kaurajogu 400g metsämansikka",
          "Tyrkisk Peber Liquorice 120g",
          "Pirkka lakkahillo 400 g",
          "Felix maustekurkkuviipale 560g/300g viipaloituja kurkkuja mausteliemessä",
          "Rexona 50 ml Sport Defence Gold roll on Ltd edition",
          "Dove Men+Care 50 ml Clean Comfort roll on",
          "Pirkka kermajuusto 1 kg laktoositon",
          "Pirkka astianpesuainetiiviste 500ml hajusteeton",
          "Best berry suomalainen mansikka 1 kg pakaste",
          "Pirkka Royal Gala omena 1kg 1lk, ulkomainen",
          "Pirkka suolapähkinät 350g",
          "Pirkka valkosuklaa cashew 150g UTZ",
          "Pirkka valkosuklaa banaanilastu 100g UTZ",
          "Pirkka kiivi 500g 1lk",
          "Pirkka espanjalainen parsakaali 400g 1lk",
          "Myskikurpitsa",
          "Valio Play Viilis 200g hedelmäpommi laktoositon",
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
          "Pirkka fusilli täysjyvä kuviopasta 500g",
          "Go-Tan Sriracha Hot Chilli Sauce tulinen chilikastike 380 ml",
          "Avokado 800g PE/CO/CL 1lk"
        ]
      },
      {
        "deliveredAt": "2022-02-09T12:00:00+00:00",
        "items": [
          "Barilla Genovese pestokastike 190g",
          "Sevan hummus 275g original",
          "Pirkka sitruunanmakuinen kivennäisvesi 1,5l",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Kurkku Suomi",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "Ullan Pakari Ullan ruis 300g",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Arla Keso raejuusto 200g vanilja",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Wasa näkkileipä 290g sesam&havssalt",
          "Pirkka peanut butter crunchy 350g",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka luomu Reilun kaupan banaani",
          "Pirkka lakkahillo 400 g",
          "Bonduelle Erittäin hienoja herneitä 400g/280g",
          "Pirkka Vichy 1,5l",
          "Oatly kaurajuoma 1l UHT",
          "Valio vapaan lehmän kevytmaito 1l",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Flora margariini 600g 60% normaalisuolainen",
          "K-Menu cashewpähkinä 500g",
          "Planti Cooking kaura 2dl Original",
          "Pirkka kikherneet suolaliemessä 380g/230g",
          "Pågen Hönö saaristolaisrieska 630g",
          "Paulúns 450g hasselpähkinä ja taateli granola muromysli",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Pirkka italialainen veriappelsiini 750g",
          "Apetit laktoositon lohikeitto 400g pakaste",
          "Heinz Ketchup 1kg",
          "Juustoportti Hyvin sokeroimaton marjainen keitto 1kg",
          "Pågen Oivallus rukiinen vehnäpalaleipä 15kpl/530g",
          "Valio pehmeä maitorahka 250 g",
          "Inkivääri",
          "LV Color pyykinpesuneste täyttöpss 1,5L",
          "Sipuli 1kg Suomi 2lk",
          "Pirkka Tiramisu italialainen jäätelö 300g/0,5l",
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
          "Järvikylä korianteri rkk FI",
          "Findus korianteri 40g pa",
          "Oatly havregurt 0,5l turkkilainen",
          "Avokado 800g PE/CO/CL 1lk",
          "Granaattiomena",
          "Punakaali Suomi",
          "Pirkka Luomu suomalainen yleisperuna 1kg"
        ]
      },
      {
        "deliveredAt": "2022-02-02T12:00:00+00:00",
        "items": [
          "Kurkku Suomi",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Pirkka sitruunanmakuinen kivennäisvesi 1,5l",
          "Barilla Genovese pestokastike 190g",
          "Sevan hummus 275g original",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Arla Keso raejuusto 200g vanilja",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Flora margariini 600g 60% normaalisuolainen",
          "Pirkka luomu Reilun kaupan banaani",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Valio vapaan lehmän kevytmaito 1l",
          "Bonduelle Erittäin hienoja herneitä 400g/280g",
          "Pirkka Vichy 1,5l",
          "Planti Cooking kaura 2dl Original",
          "Oatly kaurajuoma 1l UHT",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Paulúns 450g hasselpähkinä ja taateli granola muromysli",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Valio Hyvä suomalainen Arki emmental e625g",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "Pågen Hönö saaristolaisrieska 630g",
          "Ullan Pakari Ullan ruis 300g",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Heinz Ketchup 1kg",
          "K-Menu cashewpähkinä 500g",
          "Pirkka peanut butter crunchy 350g",
          "Wasa näkkileipä 290g sesam&havssalt",
          "Pirkka suomalainen kuohukerma 2dl",
          "Apetit laktoositon lohikeitto 400g pakaste",
          "Wettex Classic 3kpl sieniliina",
          "Pirkka falafelpyörykät n.15kpl/300g pakaste",
          "Urtekram seesamiöljy 500ml luomu",
          "Sitruunaruoho 50g 1lk",
          "Spice Up! Sitruunaruohotahna 110g",
          "Sofine 250g Maustamaton Luomutofu",
          "Pirkka suomalainen kevätsipuli 100g",
          "Lime 3kpl/220g Brasilia/MX 1lk",
          "Korianteri 20g",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Pirkka italialainen veriappelsiini 750g",
          "MÖ kaurajogu 400g metsämansikka",
          "Prix lakulehmä 275g",
          "LU Belvita välipalakeksi 253g marja-jogurtti",
          "Jyväshyvä välipalakeksi 6x30g mansikka",
          "Jyväshyvä välipalakeksi 6x30g tumma suklaa",
          "Pirkka Vikkelät kanan fileesuikale maustamaton 450g",
          "Atria Vuolu kanafilee pehmeä savu 200g"
        ]
      },
      {
        "deliveredAt": "2022-01-26T12:00:00+00:00",
        "items": [
          "Kurkku Suomi",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Sevan hummus 275g original",
          "Pirkka sitruunanmakuinen kivennäisvesi 1,5l",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Flora margariini 600g 60% normaalisuolainen",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Bonduelle Erittäin hienoja herneitä 400g/280g",
          "Arla Keso raejuusto 200g vanilja",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Valio Hyvä suomalainen Arki emmental e625g",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Planti Cooking kaura 2dl Original",
          "Pirkka Vichy 1,5l",
          "Pirkka luomu Reilun kaupan banaani",
          "Juustoportti Hyvin sokeroimaton marjainen keitto 1kg",
          "Valio vapaan lehmän kevytmaito 1l",
          "Pirkka kikherneet suolaliemessä 380g/230g",
          "Paulúns 450g hasselpähkinä ja taateli granola muromysli",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Pirkka peanut butter crunchy 350g",
          "Wasa näkkileipä 290g sesam&havssalt",
          "Classic papukahvi 500g Franskrost",
          "Pågen Hönö saaristolaisrieska 630g",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Pirkka suomalainen kaurahiutale 1kg",
          "Ullan Pakari Ullan ruis 300g",
          "Oatly kaurajuoma 1l UHT",
          "Pirkka lakkahillo 400 g",
          "Apetit laktoositon lohikeitto 400g pakaste",
          "Barilla Genovese pestokastike 190g",
          "Pirkka Royal Gala omena 1kg 1lk, ulkomainen",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "K-Menu cashewpähkinä 500g",
          "Lime",
          "Tyrkisk Peber Liquorice 120g",
          "Pirkka suomalainen pesty porkkana 500g 1 lk",
          "Felix maustekurkkuviipale 560g/300g viipaloituja kurkkuja mausteliemessä",
          "Sofine 250g Maustamaton Luomutofu",
          "Violife Greek White 230/200g",
          "Pirkka kookosmaito 400ml",
          "Pirkka wc-paperi 6rl valkoinen",
          "Pirkka kuvioitu talouspaperi puoliarkki 4rl",
          "Pirkka punaiset linssit suolaliemessä 380g/230g",
          "Pirkka italialainen veriappelsiini 750g",
          "Pirkka lohikuutiot 300g ASC pakaste",
          "Pirkka tonnikalapalat vedessä 185g/130g MSC",
          "Malaco TV Mix Salmiakki 280g",
          "Malaco Aakkoset Sirkus makeissekoitus 315g",
          "Malaco TV MIX Laku makeissekoitus 325g",
          "Tuorehiiva 50 g leivinhiiva",
          "Pirkka leivinpaperi 38cmx15m valkaisematon",
          "Pirkka Parhaat riisinuudeli 180g",
          "Oululainen Hapankorppu 200 g",
          "Hortiherttua Thaibasilika laatuluokka 1",
          "MÖ kaurajogu 400g metsämansikka",
          "Oatly kaurajuoma suklaa 2,5dl UHT"
        ]
      },
      {
        "deliveredAt": "2022-01-18T12:00:00+00:00",
        "items": [
          "Kurkku Suomi",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Sevan hummus 275g original",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Paulúns 450g hasselpähkinä ja taateli granola muromysli",
          "Pirkka sitruunanmakuinen kivennäisvesi 1,5l",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Bonduelle Erittäin hienoja herneitä 400g/280g",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Planti Cooking kaura 2dl Original",
          "Pirkka Vichy 1,5l",
          "Arla Keso raejuusto 200g vanilja",
          "Pågen Hönö saaristolaisrieska 630g",
          "Valio vapaan lehmän kevytmaito 1l",
          "Pirkka luomu Reilun kaupan banaani",
          "Oatly kaurajuoma 1l UHT",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Ullan Pakari Ullan ruis 300g",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Flora margariini 600g 60% normaalisuolainen",
          "Pirkka laktoositon kevytmaitojuoma 1l",
          "Pirkka peanut butter crunchy 350g",
          "Classic papukahvi 500g Franskrost",
          "Pirkka kikherneet suolaliemessä 380g/230g",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Barilla Genovese pestokastike 190g",
          "Apetina juustokuutiot 200g",
          "Lime",
          "Leivon Boltsi pyörykkä 230g original",
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
          "Lapin Liha poronkäristys 240 g pakaste",
          "Pirkka appelsiini",
          "Punakaali Suomi",
          "Valio Eila kevytmaitojuoma 2,5dl laktoositon UHT",
          "Arla Luonto+ AB jogurtti 1kg päärynä laktoositon",
          "Juustoportti Hyvin sokeroimaton jogurtti 1 kg mustikka-mansikka-vadelma laktoositon",
          "Pirkka kermajuusto 1 kg laktoositon",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "Go-Tan Sriracha Sauce tulinen chilikastike 215ml"
        ]
      },
      {
        "deliveredAt": "2022-01-05T19:00:00+00:00",
        "items": [
          "Kurkku Suomi",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Valio Hyvä suomalainen Arki emmental e625g",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Sevan hummus 275g original",
          "Pirkka sitruunanmakuinen kivennäisvesi 1,5l",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka Vichy 1,5l",
          "Barilla Genovese pestokastike 190g",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Bonduelle Erittäin hienoja herneitä 400g/280g",
          "Planti Cooking kaura 2dl Original",
          "Flora margariini 600g 60% normaalisuolainen",
          "Arla Keso raejuusto 200g vanilja",
          "Pågen Hönö saaristolaisrieska 630g",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Juustoportti Hyvin sokeroimaton marjainen keitto 1kg",
          "Pirkka suomalainen kaurahiutale 1kg",
          "Classic papukahvi 500g Franskrost",
          "Pirkka kikherneet suolaliemessä 380g/230g",
          "Pirkka peanut butter crunchy 350g",
          "Ullan Pakari Ullan ruis 300g",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "Oatly ruokaan fraiche 2dl",
          "K-Menu riisipiirakka 12kpl /1020g pakaste",
          "Apetit laktoositon lohikeitto 400g pakaste",
          "Felix maustekurkkuviipale 560g/300g viipaloituja kurkkuja mausteliemessä",
          "Kitchen Joy panang curry-kanaa ja jasminriisiä 350g pakaste",
          "Kitchen Joy sweet & sour hapanimeläbroileria ja jasminriisiä 350g pakaste",
          "Kitchen Joy tikka masala broileria ja jasminriisiä 350g pakaste",
          "Kitchen Joy punaista kasviscurrya ja riisiä 350g pakaste",
          "Pirkka suomalainen mustikka 500g pakaste",
          "Pirkka Parhaat riisinuudeli 180g",
          "Pirkka Luomu kaurajuoma 1l UHT",
          "Pirkka luomu Reilun kaupan banaani",
          "Kokkikartano broileripasta 650g",
          "Valio vapaan lehmän kevytmaito 1l",
          "K-Menu cashewpähkinä 500g",
          "Heinz Ketchup 1kg",
          "Pirkka kalapuikko MSC 10 kpl/250 g pakaste",
          "Pirkka Royal Gala omena 1kg 1lk, ulkomainen",
          "Lime",
          "Planti soygurt 2x150g vanilja",
          "Planti Soygurt 2x150g mustikka",
          "Lotus Biscoff Spread karamellisoitu keksilevite 400g",
          "Wasa näkkileipä 290g sesam&havssalt",
          "Pirkka Biojätepussi 20 kpl 30x22x12 cm",
          "Pirkka kuvioitu talouspaperi puoliarkki 4rl"
        ]
      },
      {
        "deliveredAt": "2021-12-30T15:00:00+00:00",
        "items": [
          "Dovgan kondensoitu maito 397g makeutettu",
          "Pirkka suomalainen kuohukerma 2dl",
          "Kouvolan Lakritsi Lakritsikastike 2dl",
          "Macu Vadelma kastike 300ml",
          "Pirkka kinuskikastike 2dl laktoositon",
          "HARIBO Chamallows Minis 150g vaahto",
          "Maku Brewing O´Maku Dry Stout 3,9% 0,33l",
          "Karhu Laku Portteri 5,5% 0,5l",
          "Maku Brewing Auervaara IPA 5,5% 0,33l",
          "Olvi I.P.A. 4,7% 0,5l",
          "Olvi Iisalmi Lakka-Pihlaja GIN lonkero 5,0% 0,33l",
          "Olvi Iisalmi Puolukka GIN lonkero 5,0% 0,33l",
          "Pirkka kikherneet suolaliemessä 380g/230g",
          "Pirkka curry 23g mausteseos",
          "Pirkka kookosmaito 400ml",
          "Pirkka Luomu paseerattu tomaatti 500g",
          "Pirkka suomalainen keltasipuli 350g",
          "Valkosipuli ulkomainen kg",
          "Inkivääri",
          "Pirkka basmatiriisi 1kg",
          "Santa Maria India Mango Chutney Original 350g tölkki",
          "Pirkka mantelilastu 100g",
          "Pirkka sitruunanmakuinen kivennäisvesi 1,5l",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Pirkka kesäkurpitsa ulkomainen"
        ]
      },
      {
        "deliveredAt": "2021-12-23T10:00:00+00:00",
        "items": [
          "Pirkka suomalainen täysmaito 1l",
          "Pirkka suomalainen kevytmaito 1l",
          "Saarioinen Maksalaatikko 400 g laktoositon/rusinaton",
          "Pirkka pehmeät taatelit 200g",
          "Valio Keisarinna 300g",
          "Castello white valkohomejuusto 150g",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Pirkka suomalainen kuohukerma 2dl",
          "Myllyn Paras Torttutaikina 1 kg pakastetaikina margariini",
          "Dronningholm Tähtitorttu Omena-kanelimarmeladi 300g",
          "Pirkka majoneesi 250g",
          "Vaasan Isopaahto vehnä 500 g paahtoleipä",
          "Pirkka lakkahillo 400 g",
          "Pirkka smetana 35% 120g laktoositon",
          "Pirkka makea sipuli 350 g 2 lk",
          "Abba sinappisilli 230g MSC",
          "Abba valkosipulisilli 225g MSC",
          "Pirkka rypsiöljy 900ml",
          "Flora margariini 600g 60% normaalisuolainen",
          "Pirkka leipäjuusto 310g laktoositon",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Kurkku Suomi",
          "Sevan hummus 275g original",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Paulúns 450g hasselpähkinä ja taateli granola muromysli",
          "Pirkka Vichy 1,5l",
          "Apetina juustokuutiot 200g",
          "Pirkka krutonki 120 g",
          "Pirkka sriracha kastike 240ml",
          "Omar pussi 220g",
          "Tyrkisk Peber Hot & Sour 150g pippurisia salmiakkihedelmäkaramelleja",
          "Prix lakulehmä 275g",
          "Valio AB piimä 1 l",
          "Tuorehiiva 50 g leivinhiiva",
          "Dansukker tumma siirappi 750g",
          "Järvikylä tilli ruukku Suomi",
          "WC-Kukka 2x50g mänty wc-raikastin tuplapakkaus",
          "Dr.Oetker vaniljatanko gourmet 1kpl",
          "Bonne premium mustikkamehu 1l",
          "Pirkka Luomu appelsiini",
          "Annas Original piparkakku 300 g",
          "Valio Oddlygood Barista kaurajuoma 0,75l korvapuusti gluteeniton",
          "Dovgan kondensoitu maito 397g makeutettu",
          "Lanttu Suomi",
          "Pirkka pekaanipähkinä 125g",
          "Pirkka suomalainen pesty porkkana 500g 1 lk",
          "Pirkka sitruunanmakuinen kivennäisvesi 1,5l",
          "Pirkka appelsiininmakuinen kivennäisvesi 1,5l",
          "Pirkka metsämansikanmakuinen kivennäisvesi 1,5l",
          "Planti Cooking kaura 2dl Original",
          "Oatly kaurajuoma 1l UHT",
          "Fazer kaurajuoma Dumle 1l gluteeniton UHT",
          "Pirkka suomalainen pesty puikulaperuna 1 kg",
          "Pirkka suomalainen pesty punajuuri 1 kg 1lk",
          "Sitruuna kg",
          "Hartwall Jaffa Jouluomena 1,5l",
          "Oatly påMACKAN 150g maustamaton",
          "Herkkumaa Makeita maustekurkkuja 670g/360g",
          "Porkkana 1kg Suomi 1lk",
          "Sevan Kikhernejauho 600g",
          "Myllyn Paras Korppujauho 300g",
          "Pirkka valkopippuri 20g jauhettu",
          "Santa Maria piparkakkumauste 18g",
          "Tolu yleispuhdistusainespray Käyttövalmis 500ml",
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
        "deliveredAt": "2021-12-14T19:00:00+00:00",
        "items": [
          "Paulúns 450g hasselpähkinä ja taateli granola muromysli",
          "Kurkku Suomi",
          "Sevan hummus 275g original",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Pirkka peanut butter crunchy 350g",
          "Bonduelle Erittäin hienoja herneitä 400g/280g",
          "Pirkka sitruunanmakuinen kivennäisvesi 1,5l",
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
          "Valio vapaan lehmän kevytmaito 1l",
          "Pågen Hönö saaristolaisrieska 630g",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Pirkka luomu Reilun kaupan banaani",
          "Flora margariini 600g 60% normaalisuolainen",
          "Juustoportti Hyvin sokeroimaton marjainen keitto 1kg",
          "Saarioinen Maksalaatikko 400 g laktoositon/rusinaton",
          "Valio Hyvä suomalainen Arki emmental e625g",
          "Pirkka kookosmaito 400ml",
          "Pirkka All in 1 konetiskitabletti 24kpl/432g",
          "Leivon Boltsi pyörykkä 230g original",
          "Pirkka kikherneet suolaliemessä 380g/230g",
          "Planti YogOat 750g vanilja",
          "Pirkka lakkahillo 400 g",
          "Go-Tan Sriracha Hot Chilli Sauce tulinen chilikastike 380 ml",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "Jalotofu Paahtopala maustettu 250g luomu",
          "Spice Up Nuudeli 400g",
          "Old El Paso vehnätortilla 326g Medium size",
          "Pirkka Tiramisu italialainen jäätelö 300g/0,5l",
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
          "Pirkka suomalainen kiinteä peruna 1kg",
          "Granaattiomena",
          "Pirkka suomalainen pesty porkkana 500g 1 lk",
          "K-Menu cashewpähkinä 500g",
          "K-Menu riisipiirakka 12kpl /1020g pakaste",
          "Heinz Ketchup 1kg",
          "Ekströms sekamehutiiviste 0,5l vadelmainen"
        ]
      },
      {
        "deliveredAt": "2021-11-30T15:00:00+00:00",
        "items": [
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Bonduelle Erittäin hienoja herneitä 400g/280g",
          "Kurkku Suomi",
          "Fazer Imatran Riisipiirakka 6 kpl / 420 g",
          "Paulúns 450g hasselpähkinä ja taateli granola muromysli",
          "Pirkka peanut butter crunchy 350g",
          "Valio Hyvä suomalainen Arki emmental e625g",
          "Planti Cooking kaura 2dl Original",
          "Sevan hummus 275g original",
          "Pirkka sitruunanmakuinen kivennäisvesi 1,5l",
          "Oatly kaurajuoma 1l UHT",
          "Pirkka suippopaprika 200 g / 2 kpl 1 lk",
          "Pirkka raejuusto 2% 200g laktoositon",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Pirkka miniluumutomaatti 250g ulkomainen 1lk",
          "Arla Luonto+ AB jogurtti 1kg mustikka laktoositon",
          "Pirkka laktoositon kevytmaitojuoma 1l",
          "Pirkka Vichy 1,5l",
          "Valio vapaan lehmän kevytmaito 1l",
          "Arla Keso raejuusto 200g vanilja",
          "Arla Luonto+ AB jogurtti 1kg vadelma laktoositon",
          "Pirkka luomu Reilun kaupan banaani",
          "Pirkka suomalainen punasipuli 350 g 2 lk",
          "Pågen Hönö saaristolaisrieska 630g",
          "Classic papukahvi 500g Franskrost",
          "Ullan Pakari Ullan ruis 300g",
          "Flora margariini 600g 60% normaalisuolainen",
          "Juustoportti Hyvin sokeroimaton jogurtti 1kg mansikka-vadelma laktoositon",
          "Juustoportti Hyvin sokeroimaton marjainen keitto 1kg",
          "Pirkka suomalainen puolikarkea vehnäjauho 2kg",
          "Alpro soijavalmiste 400g vadelma-omena",
          "Alpro soijavalmiste 750g makeuttamaton luomu",
          "Planti YogOat 750g vanilja",
          "Apetina juustokuutiot 200g",
          "Pirkka vehnätortilla 8 kpl/320g",
          "Pirkka Parhaat siemennäkkileipä kaura-hampunsiemen 210g gluteeniton",
          "Pirkka suomalainen yleisperuna 1kg",
          "Leivon Boltsi pyörykkä 230g original",
          "Pirkka ananasmurska ananastäysmehussa 227g/140g",
          "Wasa näkkileipä 290g sesam&havssalt",
          "Oululainen hapankorppu 740g"
        ]
      },
      {
        "deliveredAt": "2021-11-23T19:00:00+00:00",
        "items": [
          "Pirkka peanut butter crunchy 350g",
          "Sevan hummus 275g original",
          "Pirkka vapaan kanan munia 10 kpl / 580g",
          "Kurkku Suomi",
          "Pirkka suomalainen makea friseesalaatti 100g",
          "Pirkka sitruunanmakuinen kivennäisvesi 1,5l",
          "Paulúns 450g hasselpähkinä ja taateli granola muromysli",
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
          "Pågen Hönö saaristolaisrieska 630g",
          "Lime",
          "Juustoportti Hyvin sokeroimaton marjainen keitto 1kg",
          "Valio Oddlygood Barista kaurajuoma 0,75l korvapuusti gluteeniton",
          "Barilla Classico 400g pastakastike",
          "Sallinen Kivettömiä taateleita 250g",
          "Lapin Liha poronkäristys 240 g pakaste",
          "Pirkka Korianteri 21g jauhettu",
          "Pirkka juustokumina 23g jauhettu",
          "Pirkka kikherneet suolaliemessä 380g/230g",
          "Ben&Jerry's jäätelö 465ml/406g cookie dough",
          "Ben & Jerry's jäätelö Topped Salted Caramel Brownie 438ml/403g",
          "Ben&Jerry's jäätelö 465ml/425g peanut butter",
          "Ben&Jerry's jäätelö 465ml/406g half baked pa",
          "Ben&Jerry's jäätelö 465ml/405g Netflix&Chilll'd",
          "Ben&Jerry's jäätelö 465ml/404g Cookie Dough",
          "Pirkka mantelijauhe 100g",
          "Yutaka luomu misotahna 300g",
          "Pirkka appelsiini",
          "Pirkka Luomu mandariini",
          "Yutaka Panko 180g",
          "Pirkka soijapapu 250g pakaste",
          "Pirkka rypsiöljy 900ml",
          "Jääsalaatti 100g pussi Suomi 1lk",
          "Arla Keso raejuusto 200g vanilja",
          "Arla keso maustamaton raejuusto 1,5% 450g",
          "Pirkka munanuudeli 250g",
          "Bonduelle Erittäin hienoja herneitä 400g/280g",
          "Saarioinen Valkosipulisalaattikastike 345ml",
          "Planti Cooking kaura 2dl Original",
          "Valio vapaan lehmän kevytmaito 1l",
          "Apetit sugar snaps pullea sokeriherne 300g pakaste",
          "Apetit laktoositon lohikeitto 400g pakaste",
          "Atria Perhetilan 400g Naturel Kanan Fileesuikale",
          "Retiisi 125g 1lk",
          "Pirkka basmatiriisi 1kg",
          "Lerøy kirjolohifilee rdton n1kg vac C trim",
          "Pirkka lakkahillo 400 g",
          "head&shoulders shampoo 225ml Dry Scalp Care",
          "Rummo Perunagnocchi 500g",
          "Beanit® maustamaton härkäpapumuru 250g"
        ]
      }
    ];

/**
 *
 * Dates of the orders on which item was included. Dates are in ascending order.
 *
 * Will only include products ordered more than once
 *
 * @param orderHistory {{deliveredAt: string, items: string[]}[]}
 * @returns {Map<string, [Date]>} Key is item name, and dates when the item was ordered. Dates in ascending order.
 */
function buildItemHistory(orderHistory) {
  const productOrderHistory = new Map();
  orderHistory.forEach(order => {
    const date = new Date(order.deliveredAt);
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
function calculateItemFrequencies(itemHistory) {
  const frequences = [...itemHistory].map(([name, dates]) => {
    const itemDays = dates.sort((a, b) => a - b);
    const orderFrequences = windowed(2, itemDays).map(
        pair => (pair[1] - pair[0]));
    return [name, millisToDays(weightedAverage(orderFrequences))];
  });
  return new Map(frequences);
}

/**
 * For each item, how long ago (in days) was it last ordered
 *
 * @param itemHistory {Map<string, [Date]>} Key is item name, and dates when the item was ordered
 * @returns {Map<string, number>} Time in days when the item was last ordered
 */
function latestItemOrders(itemHistory) {
  const lastOrders = [...itemHistory]
  .map(([name, dates]) => {
    const lastOrder = dates.sort((a, b) => b - a)[0];
    return [name, lastOrder];
  });
  return new Map(lastOrders);
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
  if(dateAsMillis(deliveryDate) - dateAsMillis(itemLastOrderDate) < F_LEEWAY*daysAsMillis(itemFrequency)) {
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

  console.log(toDates(overlappingOrders));
  // But let's not consider orders that are too close to when we last ordered the item
    const foo = overlappingOrders.filter(it => it - dateAsMillis(itemLastOrderDate) > span);
  console.log(toDates(foo));

  // If no orders yet done during the time span, we should propose item for this order
  // If there already has been an order, we have proposed the item on that one already
  return foo.length === 0;
}

/**
 *
 *
 * @param itemFrequences {Map<string,number>}
 * @param itemLastOrders {Map<string, Date>]}
 */
function toBeOrdered(itemFrequences, itemLastOrders) {

  const now = new Date();

  const toBeOrdered = [...itemLastOrders]
  .filter(([name, lastOrder]) => {
    const sinceLastOrder = millisToDays(now - lastOrder);
    const orderFrequency = itemFrequences.get(name);

    // How many times we have missed the expected frequency
    const missed = sinceLastOrder / orderFrequency

    // It is due for ordering by frequency
    const isDue = sinceLastOrder > itemFrequences.get(name);

    // And this is a recently ordered item
    const isRelevant = sinceLastOrder < itemFrequences.get(name) * 3;

    console.log(
        `${name} since last order ${sinceLastOrder} and frequency ${itemFrequences.get(
            name)}`)

    return isDue && isRelevant;
  })
  .map(([name, lastOrder]) => {
    const sinceLastOrder = millisToDays(now - lastOrder);
    return [name, sinceLastOrder];
  });

  return new Map(toBeOrdered);

}

/**
 *
 *
 * @param deliveryDate {Date} Delivery date for current order
 * @param itemsOrderHistory {Map<string,Date[]>} Order history for each item
 * @param itemFrequencies {Map<string,number>} Calculated frequency for each item
 * @param previousOrderDates {Date[]} Dates of previous orders
 * @returns {Map<string,boolean>}
 */
function proposedItems(deliveryDate, itemsOrderHistory, itemFrequencies,
    previousOrderDates) {
  const results = mapMap(itemsOrderHistory, (name, dates) => {
    return shouldPropose(deliveryDate, dates[dates.length - 1],
        itemFrequencies.get(name), previousOrderDates)
  })
  return new Map([...results].filter(([key, value]) => value === true))
}



const itemHistory = buildItemHistory(orderHistoryX);
console.log(itemHistory);
const itemFrequencies = calculateItemFrequencies(itemHistory);
console.log(itemFrequencies);
const previousOrderDates = orderHistoryX
.map(it => it.deliveredAt)
.map(it => new Date(it));
const toBeProposed = proposedItems(new Date(Date.parse('2022-04-08T10:00:00+00:00')), itemHistory, itemFrequencies,
    previousOrderDates);
console.log(toBeProposed.keys());

// Just for testing
module.exports.shouldPropose = shouldPropose;

// const itemHistory = buildItemHistory(orderHistoryX);
// const itemFrequency = calculateItemFrequency(itemHistory);
// const itemLastOrders = latestItemOrders(itemHistory);
// const nextCart = toBeOrdered(itemFrequency, itemLastOrders);
//
//
// console.log(nextCart);

function mapMap(map, fn) {
  return new Map(Array.from(map, ([key, value]) => [key, fn(key, value, map)]));
}
