import { IFeedstock } from "../../feedstocks/types/feedstocks"
import { IBrand } from "../../brands/types/brand"
import { IFamily } from "../../families/types/family"

export namespace IProduct {
  export interface Root {
    _id?: string
    name: string
    code: string
    UnitOfMeasurement: string
    pack: Pack
    unit: Unit
    family?: IFamily
    marketing: Marketing
    brand?: IBrand
    taxes: Taxes
    createdAt?: string
    updatedAt?: string
    production: Production
  }

  export interface Marketing {
    description?: string
    color?: string
    isPublic: boolean
    photo?: string
  }

  export interface Taxes {
    ncm?: string
    cest?: string
  }

  export interface Pack {
    numberOfUnitsInPack?: number
    barcodeDun14?: string
    numberOfPacksInPallet?: number
    weight?: number
  }

  export interface Unit {
    weight?: number
    barcodeEan13?: string
  }

  export interface Production {
    formulation: Formulation[]
    cost?: ProductionCost
    lost?: number
  }

  export interface Formulation {
    feedstock: IFeedstock
    value: number
    considerInWeightCalculation: boolean
  }

  export interface ProductionCost {
    unitCost: number
    packCost: number
    weightPerFormulation: number
  }
}
