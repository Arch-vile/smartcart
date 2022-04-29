import {createSuggestionService} from "core/ports/in/suggestionService";
import {OrderDao} from "core/ports/out/orderDao";
import {promiseOf} from "utils/promises";

test('suggestions', async () => {

  const dao = {
    orderById: (id: string) => promiseOf(null as any),
    orderHistory: () => promiseOf(
        {
          current: null,
          previous: []
        }
    )
  } as OrderDao

  const service = createSuggestionService(dao)

  const result = await service.suggestions();

  expect(result).toStrictEqual([]);
})
