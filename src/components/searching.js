import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  // #5.1 — настраиваем компаратор:
  //  - пропускаем пустой запрос (skipEmptyTargetValues)
  //  - ищем одну строку сразу по нескольким полям
  const compare = createComparison(
    ['skipEmptyTargetValues'],
    [rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)]
  );

  return (data, state, action) => {
    // #5.2 — применяем компаратор к коллекции
    const query = state[searchField];
    return data.filter(row => compare(row, { [searchField]: query }));
  };
}
