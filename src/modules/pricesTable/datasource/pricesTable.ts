import { tableParams } from '@/src/core/types/pagination-types'
import axios from '~utils/axios'
import { IPricesTable } from '../types/pricesTable'

export const getAllPricesTable = async (params: tableParams) => {
  const { data } = await axios.get('/prices-table', { params: params })

  return data
}

export const getPricesTable = async (id: string): Promise<IPricesTable.Root> => {
  const { data } = await axios.get(`/prices-table/${id}`)

  return data
}

export const createPricesTable = async (dataForm: any) => {
  const { data } = await axios.post('/prices-table', dataForm)

  return data
}

export const updatePricesTable = async (id: string, dataForm: any) => {
  const { data } = await axios.patch(`/prices-table/${id}`, dataForm)

  return data
}

export const deletePricesTable = async (id: string) => {
  const { data } = await axios.delete(`/prices-table/${id}`)

  return data
}
