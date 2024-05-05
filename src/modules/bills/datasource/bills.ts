import { tableParams } from '@/src/core/types/pagination-types'
import type { IBill, IBillPaginationFilters, IBillRoot, IBillsCumulative, IBillsCumulativeParams, IBillsSummary } from '../types/bill'
import type { paginationRoot } from '@/src/core/types/pagination-types'
import axios from '~utils/axios'

export const createBill = async (params: IBill): Promise<IBillRoot> => {
  const { data } = await axios.post('/bills', { ...params })

  return data
}

export const updateBill = async (id: string, params: Partial<IBill>): Promise<IBillRoot> => {
  const { data } = await axios.patch(`/bills/${id}`, { ...params })

  return data
}

export const deleteBill = async (id: string): Promise<IBillRoot> => {
  const { data } = await axios.delete(`/bills/${id}`)

  return data
}

export const getBill = async (id: string): Promise<IBillRoot> => {
  const { data } = await axios.get(`/bills/${id}`)

  return data
}

export const getBills = async (params: tableParams & IBillPaginationFilters): Promise<paginationRoot<IBillRoot>> => {
  const { data } = await axios.get('/bills', { params })

  return data
}

export const getSummaryBills = async (params: Partial<IBillPaginationFilters>): Promise<IBillsSummary> => {
  const { data } = await axios.get('/bills/summary', { params })

  return data
}

export const exportBills = async () => {
  const { data } = await axios.get<Blob>('/bills/export', { responseType: 'blob' })

  return data
}

export const getCumulativeBills = async (params: IBillsCumulativeParams) => {
  const { data } = await axios.get<IBillsCumulative>('/bills/cumulative', { params })

  return data
}
