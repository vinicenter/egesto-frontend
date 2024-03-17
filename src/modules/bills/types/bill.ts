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
  startDueDate?: string,
  endDueDate?: string,
  type?: 'BOLETO' | 'CHEQUE' | 'PIX' | 'TRANSFERENCIA_BANCARIA' | 'DINHEIRO',
  recipient?: string,
  isPaid?: boolean
}

export interface IBillsSummary {
  billsCount: number,
  billsPaidAmount: number,
  billsUnpaidAmount: number,
  billsAmount: number,
}
