import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initSearching } from "./components/searching.js";
import { initFiltering } from "./components/filtering.js";

import "./fonts/ys-display/fonts.css";
import "./style.css";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";
import { initTable } from "./components/table.js";

const api = initData();

function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);
  return { ...state, rowsPerPage, page };
}

async function render(action) {
  const state = collectState();
  let query = {};

  query = applySearching(query, state, action);
  query = applyFiltering(query, state, action);
  query = applySorting(query, state, action);
  query = applyPagination(query, state, action);

  const { total, items } = await api.getRecords(query);

  updatePagination(total, query);
  sampleTable.render(items);
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render
);

function createPage(el, page, isCurrent) {
  const input = el.querySelector("input");
  const span = el.querySelector("span");
  input.value = page;
  input.checked = isCurrent;
  span.textContent = page;
  return el;
}
const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements,
  createPage
);

const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

const applySearching = initSearching("search");

const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements
);

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

function debounce(fn, ms = 400) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

function enableLiveFilter() {
  const fields = sampleTable.filter.container.querySelectorAll(
    'input[type="text"], input[type="search"], input[type="date"], select'
  );
  fields.forEach((el) => {
    const evt = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(evt, debounce(() => render({ name: "filter-live" }), 400));
  });
}
enableLiveFilter();

async function init() {
  const indexes = await api.getIndexes();  
  updateIndexes(sampleTable.filter.elements, {
    seller: indexes.sellers,
    searchBySeller: indexes.sellers,
  });
}
init().then(render);
