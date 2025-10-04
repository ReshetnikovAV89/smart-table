export function initSearching(searchField) {
  return (query, state, _action) => {
    const value = state[searchField];
    return value ? { ...query, search: value } : query;
  };
}
