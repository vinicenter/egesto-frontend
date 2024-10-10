import { IFamily } from "../../families/types/family"
import { ProductSize } from "../types/productSize"

export const formatProductNameWithCode = (name?: string, code?: string) => {
  return `${code || ''}${code && name ? ' - ' : ' '}${name}`.trim()
}

export const formatFamilyLabel = (item?: IFamily) => {
  return `${item?.linkedFamily?.name ? `${item?.linkedFamily?.name} > ` : ''}${item?.name ? item?.name : '-'}`
}

export const formatSizesLabel = (sizes?: ProductSize[]) => {
  if(!sizes) return '-'
  if(!sizes.length) return '-'

  return sizes.map(size => size.name).join(', ')
}
