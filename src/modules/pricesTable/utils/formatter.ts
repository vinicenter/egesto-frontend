import { IProduct } from "../../products/types/product";

export const getProductUnitPrice = (price: number, product: IProduct.Root) => {
  return price / (product?.production?.useCustomPackCostMultiplier || product?.pack?.numberOfUnitsInPack || 0)
}
