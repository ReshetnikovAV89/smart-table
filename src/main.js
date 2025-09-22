import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initSearching } from "./components/searching.js";
import { initFiltering } from "./components/filtering.js";

import './fonts/ys-display/fonts.css';
import './style.css';

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";
import { initTable } from "./components/table.js";

// Исходные данные (индексы пригодятся для фильтров)
const { data, ...indexes } = initData(sourceData);

/**
 * Сбор значений полей формы-таблицы
 * Важно: приводим к числам то, что нужно для пагинации
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));

  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);

  return {
    ...state,
    rowsPerPage,
    page
  };
}

/**
 * Главный рендер: применяем модули по порядку
 * @param {HTMLButtonElement?} action
 */
function render(action) {
  let state = collectState();
  let result = [...data];

  // 1) ПОИСК (Шаг 5) — по date/customer/seller
  result = applySearching(result, state, action);

  // 2) ФИЛЬТРАЦИЯ (Шаг 4)
  result = applyFiltering(result, state, action);

  // 3) СОРТИРОВКА (Шаг 3)
  result = applySorting(result, state, action);

  // 4) ПАГИНАЦИЯ (Шаг 2)
  result = applyPagination(result, state, action);

  // Вывод строк
  sampleTable.render(result);
}

// Таблица + шаблоны до/после
const sampleTable = initTable({
  tableTemplate: 'table',
  rowTemplate: 'row',
  before: ['search', 'header', 'filter'], // сверху: поиск, заголовок, фильтры
  after: ['pagination']                   // снизу: пагинация
}, render);

// --- ИНИЦИАЛИЗАЦИЯ МОДУЛЕЙ ---

// Пагинация: фабрика кнопки страницы
function createPage(el, page, isCurrent) {
  const input = el.querySelector('input');
  const span = el.querySelector('span');
  input.value = page;
  input.checked = isCurrent;
  span.textContent = page;
  return el;
}
const applyPagination = initPagination(
  sampleTable.pagination.elements,
  createPage
);

// Сортировка (иконки в header)
const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal
]);

// Поиск (поле с name="search" в верхнем баре)
const applySearching = initSearching('search');

// Фильтрация (select продавцов и поля дат/клиента/диапазона total)
const applyFiltering = initFiltering(
  sampleTable.filter.elements,
  {
    // наполняем селект продавцов
    searchBySeller: indexes.sellers
    // при желании можно добавить и другие индексы под свои элементы
  }
);

// Монтируем и первый рендер
const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();
