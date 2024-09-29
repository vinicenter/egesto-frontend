import { Bank } from "../../banks/types/bank";
import { IPeople } from "../../people/types/people";
import { IBillTagRoot } from "./bill-tags";

export type BillPaymentMethods = 'BOLETO' | 'CHEQUE' | 'PIX' | 'TRANSFERENCIA_BANCARIA' | 'DINHEIRO'

export interface IBillCreateEdit {
  _id?: string,
  dueDate: string,
  paymentDate?: string,
  paymentBank?: string | null,
  recipient?: IPeople | null,
  paymentMethod: BillPaymentMethods,
  reference?: string,
  amount: number,
  tags: IBillTagRoot[],
  installment?: BillInstallment | null,
  observations?: string,
  isPaid?: boolean
}

export interface IBill {
  _id?: string,
  dueDate: string,
  paymentDate?: string,
  paymentBank?: Bank | null,
  recipient?: IPeople | null,
  paymentMethod: BillPaymentMethods,
  reference?: string,
  amount: number,
  tags: IBillTagRoot[],
  installment?: BillInstallment | null,
  observations?: string,
  isPaid?: boolean
}

export interface IBillRoot {
  _id?: string,
  createdAt: string,
  dueDate: string,
  paymentDate?: string,
  paymentBank?: Bank,
  recipient?: IPeople,
  paymentMethod: BillPaymentMethods,
  reference?: string,
  amount: number,
  observations?: string,
  isPaid: boolean,
  installment?: BillInstallment,
  updatedAt: string,
}

export interface BillInstallment {
  _id?: string,
  name: string,
  description?: string,
  deletedAt?: string,
}

export interface IBillFilters {
  paymentMethod?: BillPaymentMethods[],
  recipient?: string,
  installment?: string,
  isPaid?: boolean | string
  tags?: string[]
  tagsFilterType?: 'AND' | 'OR'
}

export interface IBillPaginationFilters extends IBillFilters {
  startDueDate?: string,
  endDueDate?: string,
}

export interface IBillsSummary {
  billsCount: number,
  billsPaidAmount: number,
  billsUnpaidAmount: number,
  billsAmount: number,
}

export interface IBillsCumulativeParams extends IBillFilters {
  startDate: string
  endDate: string
  isPaid?: boolean | string
}

export interface IBillsDailyReportParams extends IBillFilters {
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

export interface IBillsDailyReport {
  date: string;
  values: {
    [tagId: string]: {
      tag: IBillTagRoot;
      amount: number;
    };
  }
}
