import { createComparison, defaultRules } from "../lib/compare.js";

// settings: elements = sampleTable.filter.elements
// indexes: объект с наборами для селектов, напр. { searchBySeller: indexes.sellers }
export function initFiltering(elements, indexes) {
  // #4.1 — заполнить выпадающие списки опциями
  if (indexes && typeof indexes === "object") {
    Object.keys(indexes).forEach((elementName) => {
      const el = elements[elementName];
      if (!el) return;
      const names = Object.values(indexes[elementName]); // массив строк
      const options = names.map((name) => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        return opt;
      });
      el.append(...options);
    });
  }

  // #4.3 — настроить компаратор (набор стандартных правил)
  const compare = createComparison(defaultRules);

  return (data, state, action) => {
    // #4.2 — обработать очистку поля (кнопки name="clear")
    if (action && action.name === "clear") {
      const field = action.dataset.field; // например: date | customer | seller | total
      const host =
        action.closest(".filter-wrapper") ||
        action.closest(".dropdown-select") ||
        action.parentElement;
      if (host) {
        const input = host.querySelector("input, select");
        if (input) input.value = "";
      }
      if (field in state) state[field] = "";
      // для диапазона total могут быть totalFrom/totalTo — их тоже можно обнулить
      if (field === "total") {
        if ("totalFrom" in state) state.totalFrom = "";
        if ("totalTo" in state) state.totalTo = "";
      }
    }

    // #4.5 — отфильтровать данные используя компаратор
    // подготовим "target" под правила (arrayAsRange ждёт массив [from, to] у total)
    const totalFrom = parseFloat(state.totalFrom);
    const totalTo = parseFloat(state.totalTo);

    const target = {
      date: state.date,
      customer: state.customer,
      seller: state.seller,
      total: [totalFrom, totalTo],
    };

    return data.filter((row) => compare(row, target));
  };
}
