import type { paginationRoot } from '@/src/core/types/pagination-types'
import { tableParams } from '@/src/core/types/pagination-types'
import axios from '~utils/axios'
import type { IBillCreateEdit, IBillPaginationFilters, IBillRoot, IBillsCumulative, IBillsCumulativeParams, IBillsDailyReport, IBillsDailyReportParams, IBillsSummary } from '../types/bill'

export const createBill = async (params: IBillCreateEdit): Promise<IBillRoot> => {
  const { data } = await axios.post('/bills', { ...params })

  return data
}

export const updateBill = async (id: string, params: Partial<IBillCreateEdit>): Promise<IBillRoot> => {
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

export const exportBills = async (params: IBillPaginationFilters) => {
  const { data } = await axios.get<Blob>('/bills/export', { params, responseType: 'blob' })

  return data
}

export const getCumulativeBills = async (params: IBillsCumulativeParams) => {
  const { data } = await axios.get<IBillsCumulative>('/bills/cumulative', { params })

  return data
}

export const getDailyReportBills = async (params: IBillsDailyReportParams) => {
  const { data } = await axios.get<IBillsDailyReport[]>('/bills/daily-report', { params })

  return data
}

export const exportDailyReportBills = async (params: IBillsDailyReportParams) => {
  const { data } = await axios.get<Blob>('/bills/daily-report-csv', { params, responseType: 'blob' })

  return data
}
