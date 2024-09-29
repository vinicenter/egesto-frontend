import { IPeople } from "../../people/types/people"
import { BillPaymentMethods, IBill, IBillCreateEdit } from "./bill"
import { IBillTagRoot } from "./bill-tags"

export interface IBillInstallmentForm {
  _id?: string
  name: string
  recipient: IPeople | null
  paymentMethod: BillPaymentMethods
  observations: string
  tags: IBillTagRoot[]
  bills: IBill[]
}

export interface IBillInstallment {
  _id?: string
  name: string
  recipient?: string | null,
  paymentMethod: BillPaymentMethods,
  observations?: string,
  tags: string[],
  bills: IBillCreateEdit[],
}
