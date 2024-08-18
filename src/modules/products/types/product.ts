import { IFeedstock } from "../../feedstocks/types/feedstocks"
import { IBrand } from "../../brands/types/brand"
import { IFamily } from "../../families/types/family"

export interface ProductDescriptionPromptParams {
  oldProductDescription?: string;
  productName?: string;
  productFamily?: string;
  brandName?: string;
  brandDescription?: string;
}

export namespace IProduct {
  export interface Filters {
    familyId?: string
    brandId?: string
    onlyFeedstockEnabled?: boolean
    withFamily?: boolean
  }

  export interface Root {
    _id?: string
    name: string
    code: string
    UnitOfMeasurement: string
    pack: Pack
    packWeight?: number
    unit: Unit
    family?: IFamily
    marketing: Marketing
    brand?: IBrand
    taxes: Taxes
    createdAt?: string
    updatedAt?: string
    production: Production
    productionCost?: ProductionCost
  }

  export interface Marketing {
    description?: string
    color?: string
    isPublic: boolean
    photos?: string[]
  }

  export interface Taxes {
    ncm?: string
    cest?: string
  }

  export interface Pack {
    numberOfUnitsInPack?: number
    barcodeDun14?: string
    numberOfPacksInPallet?: number
  }

  export interface Unit {
    weight?: number
    barcodeEan13?: string
  }

  export interface Production {
    formulation: {
      products: (Formulation & { product: IProduct.Root })[]
      feedstocks: (Formulation & { feedstock: IFeedstock })[]
    }
    lost?: number
    useCustomPackCostMultiplier: number
    canBeFeedstock: boolean
  }

  export interface Formulation {
    value?: number
    considerInWeightCalculation: boolean
    considerInVolumeProduced: boolean
  }

  export interface ProductionCost {
    unitCost: number
    packCost: number
    weightPerFormulation: number
    isWeightPerFormulationValid: boolean
    weightFormulationDifference: number
  }
}
