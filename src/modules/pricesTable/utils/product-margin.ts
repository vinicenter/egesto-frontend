import { IPricesTable } from "../types/pricesTable";

export const getProductMargin = (row: IPricesTable.Price) => {
  const volume = row.volume;
  const price = Number(row.price);
  const shipment = row.shipment / 100;
  const tax = row.tax / 100;
  const expense = row.expense / 100;
  const productionLost = row.productionLost / 100;
  const productCost = row.productCost * volume;

  const totalRevenue = volume * price;
  const shipmentValue = shipment * totalRevenue;
  const unitTotal = totalRevenue - shipmentValue;
  const taxes = tax * totalRevenue;

  const netRevenue = unitTotal - taxes;
  const expensesVariables = expense * totalRevenue;
  const lost = productionLost * totalRevenue;

  const margin = Number((((netRevenue - expensesVariables - productCost - lost) / totalRevenue) * 100).toPrecision(5));
  const netSales = netRevenue;
  const grossRevenue = totalRevenue;

  return {
    margin,
    netSales,
    grossRevenue
  }
}

export const getProductPriceByMargin = (row: IPricesTable.Price) => {
  const desireMargin = row.margin

  if(desireMargin > 50) {
    throw new Error('Para calcular o preço de venda, a margem deve ser menor ou igual a 50%')
  }

  let price = 0;

  const result = {
    grossRevenue: 0,
    margin: 0,
    netSales: 0,
  };

  while (result.margin <= desireMargin) {
    price += 0.02;

    const data = getProductMargin({ ...row, price });
    Object.assign(result, data);
  }

  return {
    price,
    ...result
  }
}
