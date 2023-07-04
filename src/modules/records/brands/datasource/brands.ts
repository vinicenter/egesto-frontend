import { tableParams } from '@/src/core/types/pagination-types'
import type { IBrand } from '../types/brand'
import axios from '~utils/axios'

export const createBrand = async (params: IBrand) => {
  const { data } = await axios.post('/brands', { ...params })

  return data
}

export const updateBrand = async (id: string, params: IBrand) => {
  const { data } = await axios.patch(`/brands/${id}`, { ...params })

  return data
}

export const deleteBrand = async (id: string) => {
  const { data } = await axios.delete(`/brands/${id}`)

  return data
}

export const getBrand = async (id: string) => {
  const { data } = await axios.get(`/brands/${id}`)

  return data
}

export const getBrands = async ({ page, limit, search }: tableParams) => {
  const { data } = await axios.get('/brands', { params: { page, limit, search } })

  return data
}
