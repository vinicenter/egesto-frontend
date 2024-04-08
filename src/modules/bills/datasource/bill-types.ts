import { paginationRoot, tableParams } from "@/src/core/types/pagination-types"
import { IBillTagRoot } from "@/src/modules/bills/types/bill-tags"
import axios from '~utils/axios'

export const getBillTags = async (params: tableParams): Promise<paginationRoot<IBillTagRoot>> => {
  const { data } = await axios.get('/bills/tags', { params })

  return data
}

export const createBillTag = async (data: IBillTagRoot): Promise<IBillTagRoot> => {
  const response = await axios.post('/bills/tags', data)

  return response.data
}

export const updateBillTag = async (id: string, data: IBillTagRoot): Promise<IBillTagRoot> => {
  const response = await axios.patch(`/bills/tags/${id}`, data)

  return response.data
}

export const deleteBillTag = async (id: string): Promise<IBillTagRoot> => {
  const response = await axios.delete(`/bills/tags/${id}`)

  return response.data
}
