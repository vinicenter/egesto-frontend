import { tableParams } from '@/src/core/types/pagination-types'
import axios from '~utils/axios'

export const getFeedStocks = async (params: tableParams) => {
  const { data } = await axios.get('/feedstocks', { params })

  return data
}

export const getFeedStock = async (id: string) => {
  const { data } = await axios.get(`/feedstocks/${id}`)

  return data
}

export const createFeedStock = async (dataForm: any) => {
  const { data } = await axios.post('/feedstocks', dataForm)

  return data
}

export const updateFeedStock = async (id: string, dataForm: any) => {
  const { data } = await axios.patch(`/feedstocks/${id}`, dataForm)

  return data
}

export const deleteFeedStock = async (id: string) => {
  const { data } = await axios.delete(`/feedstocks/${id}`)

  return data
}

export const generateFeedstockReport = async () => {
  const { data } = await axios.get<Blob>('/feedstocks/report', { responseType: 'blob' })

  return data
}
