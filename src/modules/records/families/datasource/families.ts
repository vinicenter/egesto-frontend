import { tableParams } from '@/src/core/types/pagination-types'
import axios from '~utils/axios'

export const getFamilies = async ({ page, limit, search }: tableParams) => {
  const { data } = await axios.get('/families', { params: { page, limit, search } })

  return data
}

export const getFamily = async (id: string) => {
  const { data } = await axios.get(`/families/${id}`)

  return data
}

export const createFamily = async (dataForm: any) => {
  const { data } = await axios.post('/families', dataForm)

  return data
}

export const updateFamily = async (id: string, dataForm: any) => {
  const { data } = await axios.patch(`/families/${id}`, dataForm)

  return data
}

export const deleteFamily = async (id: string) => {
  const { data } = await axios.delete(`/families/${id}`)

  return data
}
