import { tableParams } from '@/src/core/types/pagination-types'
import type { IBrand, IBrandRoot } from '../types/brand'
import type { paginationRoot } from '@/src/core/types/pagination-types'
import axios from '~utils/axios'

export const createBrand = async (params: IBrand): Promise<IBrandRoot> => {
  const { data } = await axios.post('/brands', { ...params })

  return data
}

export const updateBrand = async (id: string, params: IBrand): Promise<IBrandRoot> => {
  const { data } = await axios.patch(`/brands/${id}`, { ...params })

  return data
}

export const deleteBrand = async (id: string): Promise<IBrandRoot> => {
  const { data } = await axios.delete(`/brands/${id}`)

  return data
}

export const getBrand = async (id: string): Promise<IBrandRoot> => {
  const { data } = await axios.get(`/brands/${id}`)

  return data
}

export const getBrands = async ({ page, limit, search }: tableParams): Promise<paginationRoot<IBrandRoot>> => {
  const { data } = await axios.get('/brands', { params: { page, limit, search } })

  return data
}
