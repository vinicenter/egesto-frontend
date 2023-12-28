import { IFamily } from "../../families/types/family"

export const formatProductNameWithCode = (name?: string, code?: string) => {
  return `${code || ''}${code && name ? ' - ' : ' '}${name}`.trim()
}

export const formatFamilyLabel = (item?: IFamily) => {
  return `${item?.linkedFamily?.name ? `${item?.linkedFamily?.name} > ` : ''}${item?.name}`
}
