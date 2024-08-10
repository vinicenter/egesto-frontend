import { tableParams } from '@/src/core/types/pagination-types'
import axios from '~utils/axios'
import { IProduct, ProductDescriptionPromptParams } from '../types/product'

export const getProducts = async (params: tableParams & IProduct.Filters) => {
  const { data } = await axios.get('/products', { params })

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

export const generateProductDescriptionAi = async (params: ProductDescriptionPromptParams) => {
  const { data } = await axios.get<string>('/products/generate-description-ai', { params })

  return data
}

export const generateProductReport = async () => {
  const { data } = await axios.get<Blob>('/products/report', { responseType: 'blob' })

  return data
}

export const verifyProductCodeAvailability = async (code: string, productIdToExclude?: string) => {
  const { data } = await axios.get<{ available: boolean }>('/products/verify-code-availability', {
    params: { code, productIdToExclude }
  })

  return data
}