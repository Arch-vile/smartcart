import {asOrderId, OrderId, OrderInfo, OrderStatus} from "../core/domain/models";
import {dateFrom} from "../utils/dateUtils";
import {createSuggestionService} from "../core/ports/in/suggestionService";
import {OrderDao} from "../core/ports/out/orderDao";
import {promiseOf} from "../utils/promises";
import {orderDaoMock} from "./orderDaoMock";


let counter = 0;


type row = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'
type column = 1 | 2 | 3 | 4
type chessCoords = `${row}${column}`

const queenPos: chessCoords = 'd4'







function orderId(): OrderId {
  counter++;
  return asOrderId("" + counter);
}

function createOrderInfo(date: string, orderStatus: OrderStatus = "ORDER_PROCESSED"): OrderInfo {
  return {
    orderStatus,
    id: orderId(),
    deliveryAt: dateFrom(date)
  }
}

async function thisistehetest() {
// test('suggestions', async () => {

    const orderDaoMocked = orderDaoMock();
    orderDaoMocked.setupOrder("2022-04-29", "ORDER_RECEIVED");

    const currentOrder: OrderInfo = createOrderInfo("2022-04-29", "ORDER_RECEIVED");
    const previousOrder1: OrderInfo = createOrderInfo("2022-04-22",);
    const previousOrder2: OrderInfo = createOrderInfo("2022-04-15",);

    const dao = {
        orderById: (id: string) => promiseOf(null as any),
        orderHistory: () => promiseOf(
            {
                current: currentOrder,
                previous: [previousOrder1, previousOrder2]
            }
        )
    } as OrderDao

    const service = createSuggestionService(dao)

    const result = await service.suggestions();

    // expect(result).toStrictEqual([]);
// })
}
