export interface IFeedstock {
  name: string,
  price: number,
  icms: number,
  priceWithoutIcms: number,
  brand: { _id: string },
  ncm: string,
}