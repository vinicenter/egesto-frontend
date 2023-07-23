export interface IFamily {
  _id?: string,
  name: string,
  costs: { name: string, value: number }[] | any[],
}