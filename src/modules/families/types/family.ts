export interface IFamily {
  _id?: string,
  name: string,
  totalCosts?: number,
  linkedFamily?: IFamily,
  costs: { name: string, value: number }[] | any[],
}
