import { tableParams } from '@/src/core/types/pagination-types'
import axios from '~utils/axios'
import { IProduct } from '../types/product'

export const getProducts = async ({ page, limit, search }: tableParams) => {
  const { data } = await axios.get('/products', { params: { page, limit, search } })

  return data
}

export const getProduct = async (id: string): Promise<IProduct.Root> => {
  const { data } = await axios.get(`/products/${id}`)

  return data
}

export const createProduct = async (dataForm: any) => {
  const { data } = await axios.post('/products', dataForm)

  return data
}

export const updateProduct = async (id: string, dataForm: any) => {
  const { data } = await axios.patch(`/products/${id}`, dataForm)

  return data
}

export const deleteProduct = async (id: string) => {
  const { data } = await axios.delete(`/products/${id}`)

  return data
}
