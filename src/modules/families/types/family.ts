export interface IFamily {
  _id?: string,
  name: string,
  totalCosts?: number,
  costs: { name: string, value: number }[] | any[],
}