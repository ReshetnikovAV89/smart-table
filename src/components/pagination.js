export function initPagination(elements, createPage) {
  let pageCount = 1;

  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page;

    if (action) {
      const name = action?.name || action?.dataset?.name;
      
      if (name && (/^filter/.test(name) || name === "search")) {
        page = 1;
      }

      if (name === "rowsPerPage") page = 1;
      if (name === "first") page = 1;
      if (name === "prev") page = Math.max(1, page - 1);
      if (name === "next") page = Math.min(pageCount, page + 1);
      if (name === "last") page = pageCount;
      if (name === "page" && action.value) page = Number(action.value);
    }

    return { ...query, limit, page };
  };

  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.max(1, Math.ceil(total / Math.max(1, limit)));
    
    if (elements.pages && typeof createPage === "function") {
      const frag = document.createDocumentFragment();
      const maxVisible = 5;
      const half = Math.floor(maxVisible / 2);
      let start = Math.max(1, page - half);
      let end = Math.min(pageCount, start + maxVisible - 1);
      start = Math.max(1, Math.min(start, Math.max(1, end - maxVisible + 1)));

      const makeBase = () => {
        if (elements.pageTemplate && elements.pageTemplate.content) {
          return elements.pageTemplate.content.firstElementChild.cloneNode(true);
        }
        
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "page";
        input.hidden = true;
        const span = document.createElement("span");
        label.appendChild(input);
        label.appendChild(span);
        return label;
      };

      for (let p = start; p <= end; p++) {
        const base = makeBase();
        const node = createPage(base, p, p === page);
        frag.appendChild(node);
      }
      elements.pages.replaceChildren(frag);
    }
    
    elements.first?.toggleAttribute("disabled", page <= 1);
    elements.prev?.toggleAttribute("disabled", page <= 1);
    elements.next?.toggleAttribute("disabled", page >= pageCount);
    elements.last?.toggleAttribute("disabled", page >= pageCount);
    
    if (
      elements.rowsPerPage &&
      String(elements.rowsPerPage.value) !== String(limit)
    ) {
      elements.rowsPerPage.value = String(limit);
    }
  };

  return { applyPagination, updatePagination };
}
