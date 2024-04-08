import { IPeople } from "../../people/types/people";
import { IBillTagRoot } from "./bill-tags";

export type BillPaymentMethods = 'BOLETO' | 'CHEQUE' | 'PIX' | 'TRANSFERENCIA_BANCARIA' | 'DINHEIRO'

export interface IBill {
  _id?: string,
  dueDate: string,
  recipient?: IPeople | null,
  paymentMethod: BillPaymentMethods,
  reference?: string,
  amount: number,
  tags: IBillTagRoot[],
  observations?: string,
  isPaid?: boolean
}

export interface IBillRoot {
  createdAt: string,
  dueDate: string,
  recipient?: IPeople,
  paymentMethod: BillPaymentMethods,
  reference?: string,
  amount: number,
  observations?: string,
  isPaid: boolean
  updatedAt: string,
}

export interface IBillFilters {
  startDueDate?: string,
  endDueDate?: string,
  paymentMethod?: BillPaymentMethods[],
  recipient?: string,
  isPaid?: boolean | string
  tags: string[]
}

export interface IBillsSummary {
  billsCount: number,
  billsPaidAmount: number,
  billsUnpaidAmount: number,
  billsAmount: number,
}

export interface IBillsCumulativeParams {
  startDate: string
  endDate: string
  isPaid?: boolean | string
}

export interface IBillsCumulative {
  [date: string]: {
    totalBills: number;
    paid: number;
    unpaid: number;
    accumulativePaid: number;
    accumulativeUnpaid: number;
  };
}
