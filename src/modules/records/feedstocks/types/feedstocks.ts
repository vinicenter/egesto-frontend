export interface IFeedstock {
  _id?: string,
  name: string,
  price: number,
  icms: number,
  priceWithoutIcms: number,
  brand?: { _id: string },
  ncm: string,
}