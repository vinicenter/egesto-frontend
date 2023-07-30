import { IFamily } from "../../families/types/family"
import { IProduct } from "../../products/types/product"

export namespace ICostsTable {
  export interface Root {
    _id?: string
    name: string
    taxes: Taxes[]
    shipments: Shipments
    createdAt: string
    updatedAt: string
  }

  export interface Taxes {
    name: string
    cost: number
  }

  export interface Shipments {
    products: {
      product: IProduct.Root
      cost: number
    }[]
    families: {
      family: IFamily
      cost: number
    }[]
  }  
}
