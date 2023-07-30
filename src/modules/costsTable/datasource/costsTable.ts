import { tableParams } from '@/src/core/types/pagination-types'
import axios from '~utils/axios'
import { ICostsTable } from '../types/costsTable'

export const getAllCostsTable = async ({ page, limit, search }: tableParams) => {
  const { data } = await axios.get('/costs-table', { params: { page, limit, search } })

  return data
}

export const getCostsTable = async (id: string): Promise<ICostsTable.Root> => {
  const { data } = await axios.get(`/costs-table/${id}`)

  return data
}

export const createCostsTable = async (dataForm: any) => {
  const { data } = await axios.post('/costs-table', dataForm)

  return data
}

export const updateCostsTable = async (id: string, dataForm: any) => {
  const { data } = await axios.patch(`/costs-table/${id}`, dataForm)

  return data
}

export const deleteCostsTable = async (id: string) => {
  const { data } = await axios.delete(`/costs-table/${id}`)

  return data
}
