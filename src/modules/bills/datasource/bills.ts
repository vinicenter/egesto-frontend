import { tableParams } from '@/src/core/types/pagination-types'
import type { IBill, IBillFilters, IBillRoot, IBillsSummary } from '../types/bill'
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

export const getbills = async (params: tableParams & IBillFilters): Promise<paginationRoot<IBillRoot>> => {
  const { data } = await axios.get('/bills', { params })

  return data
}

export const getSummaryBills = async (params: IBillFilters): Promise<IBillsSummary> => {
  const { data } = await axios.get('/bills/summary', { params })

  return data
}

export const exportBills = async () => {
  const { data } = await axios.get<Blob>('/bills/export', { responseType: 'blob' })

  return data
}
