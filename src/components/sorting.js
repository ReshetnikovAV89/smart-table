import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (data, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === 'sort') {
      // #3.1 — ротируем состояние нажатой кнопки
      action.dataset.value = sortMap[action.dataset.value]; // none → up → down → none
      field = action.dataset.field;
      order = action.dataset.value;

      // #3.2 — сбрасываем остальные кнопки
      columns.forEach(col => {
        if (col.dataset.field !== action.dataset.field) {
          col.dataset.value = 'none';
        }
      });
    } else {
      // #3.3 — восстановление выбранного режима при последующих перерисовках
      columns.forEach(col => {
        if (col.dataset.value !== 'none') {
          field = col.dataset.field;
          order = col.dataset.value;
        }
      });
    }

    return sortCollection(data, field, order);
  };
}
