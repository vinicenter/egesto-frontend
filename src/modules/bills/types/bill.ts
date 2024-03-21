import { Dayjs } from "dayjs";
import { IPeople } from "../../people/types/people";

export interface IBill {
  _id?: string,
  dueDate: string,
  recipient?: IPeople | null,
  type: 'BOLETO' | 'CHEQUE' | 'PIX' | 'TRANSFERENCIA_BANCARIA' | 'DINHEIRO',
  reference?: string,
  amount: number,
  observations?: string,
  isPaid?: boolean
}

export interface IBillRoot {
  createdAt: string,
  dueDate: string,
  recipient?: IPeople,
  type: 'BOLETO' | 'CHEQUE' | 'PIX' | 'TRANSFERENCIA_BANCARIA' | 'DINHEIRO',
  reference?: string,
  amount: number,
  observations?: string,
  isPaid: boolean
  updatedAt: string,
}

export interface IBillFilters {
  startDueDate?: string | Dayjs,
  endDueDate?: string | Dayjs,
  type?: 'BOLETO' | 'CHEQUE' | 'PIX' | 'TRANSFERENCIA_BANCARIA' | 'DINHEIRO',
  recipient?: string,
  isPaid?: boolean | string
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
