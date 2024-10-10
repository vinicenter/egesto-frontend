import { tableParams } from '@/src/core/types/pagination-types'
import axios from '~utils/axios'
import { ProductSize, ProductSizeForm } from '../types/productSize'

export const getProductsSize = async (params: tableParams) => {
  const { data } = await axios.get('/products/sizes', { params })

  return data
}

export const getProductSize = async (id: string): Promise<ProductSize> => {
  const { data } = await axios.get(`/products/sizes/${id}`)

  return data
}

export const createProductSize = async (dataForm: ProductSizeForm) => {
  const { data } = await axios.post('/products/sizes', dataForm)

  return data
}

export const updateProductSize = async (id: string, dataForm: ProductSizeForm) => {
  const { data } = await axios.patch(`/products/sizes/${id}`, dataForm)

  return data
}

export const deleteProductSize = async (id: string) => {
  const { data } = await axios.delete(`/products/sizes/${id}`)

  return data
}
