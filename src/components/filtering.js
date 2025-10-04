export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      const el = elements[elementName];
      if (!el) return;

      const names = Object.values(indexes[elementName]);
      const opts = names.map((name) => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        return opt;
      });
      el.append(...opts);
    });
  };

  const applyFiltering = (query) => {
    const filter = {};
    let extraSearch = null;

    Object.keys(elements).forEach((key) => {
      const el = elements[key];
      if (!el) return;
      if (!["INPUT", "SELECT"].includes(el.tagName)) return;

      const value = (el.value ?? "").trim();
      if (!value) return;

      if (el.name === "date") {
        const isFullDate = /^\d{4}-\d{2}-\d{2}$/.test(value);
        if (isFullDate) {
          filter[`filter[${el.name}]`] = value;
        } else if (!query.search) {
          extraSearch = value;
        }
      } else {
        filter[`filter[${el.name}]`] = value;
      }
    });

    let next = Object.keys(filter).length ? { ...query, ...filter } : { ...query };
    if (extraSearch) {
      const combined = [next.search, extraSearch].filter(Boolean).join(" ").trim();
      next = { ...next, search: combined };
    }
    return next;
  };

  return { updateIndexes, applyFiltering };
}
