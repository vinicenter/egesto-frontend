import { tableParams } from "@/src/core/types/pagination-types"
import axios from '~utils/axios'
import { Bank } from "../types/bank"

export const getBanks = async (params: tableParams) => {
  const { data } = await axios.get('/banks', { params: params })

  return data
}

export const getBank = async (id: string) => {
  const { data } = await axios.get<Bank>(`/banks/${id}`)

  return data
}

export const createBank = async (bank: Bank) => {
  const { data } = await axios.post<Bank>('/banks', bank)

  return data
}

export const updateBank = async (id: string, updatedBank: Bank) => {
  const { data } = await axios.patch<Bank>(`/banks/${id}`, updatedBank)

  return data
}

export const deleteBank = async (id: string) => {
  const { data } = await axios.delete(`/banks/${id}`)

  return data
}