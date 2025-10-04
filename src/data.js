const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

export function initData() {  
  let sellers;
  let customers;
  let lastResult;
  let lastQuery;
  
  const mapRecords = (data) =>
    data.map((item) => ({
      id: item.receipt_id,
      date: item.date,
      seller: sellers[item.seller_id],
      customer: customers[item.customer_id],
      total: item.total_amount,
    }));
  
  const getIndexes = async () => {
    if (!sellers || !customers) {
      [sellers, customers] = await Promise.all([
        fetch(`${BASE_URL}/sellers`).then((r) => r.json()),
        fetch(`${BASE_URL}/customers`).then((r) => r.json()),
      ]);
    }
    return { sellers, customers };
  };
  
  const getRecords = async (query = {}, isUpdated = false) => {
    const qs = new URLSearchParams(query).toString();

    if (lastQuery === qs && !isUpdated) {
      return lastResult;
    }

    const res = await fetch(`${BASE_URL}/records?${qs}`);
    const json = await res.json();

    lastQuery = qs;
    lastResult = {
      total: json.total,
      items: mapRecords(json.items),
    };
    return lastResult;
  };

  return { getIndexes, getRecords };
}
