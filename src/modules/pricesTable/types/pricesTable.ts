import { ICostsTable } from "../../costsTable/types/costsTable"
import { IProduct } from "../../products/types/product"
import { IPeople } from "../../people/types/people"

export namespace IPricesTable {
  export interface Root {
    _id: string;
    archived: boolean;
    costTable?: ICostsTable.Root;
    customer?: IPeople;
    name: string;
    prices: Price[];
  }

  export interface Price {
    product: IProduct.Root;
    productCost: number;
    price: number;
    volume: number;
    netSales: number;
    grossRevenue: number;
    shipment: number;
    expense: number;
    tax: number;
    productionLost: number;
    margin: number;
  }
}
