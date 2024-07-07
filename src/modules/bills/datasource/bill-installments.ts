import axios from '~utils/axios'
import { IBillInstallment, IBillInstallmentForm } from '../types/bill-installment'
import { tableParams } from '@/src/core/types/pagination-types'

export const getInstallments = async (params: tableParams): Promise<Omit<IBillInstallment, 'bills'>[]> => {
  const response = await axios.get('/bills/installments', { params })

  return response.data
}

export const createInstallment = async (data: IBillInstallmentForm): Promise<IBillInstallment> => {
  const response = await axios.post('/bills/installments', data)

  return response.data
}

export const updateInstallment = async (id: string, data: IBillInstallmentForm): Promise<IBillInstallment> => {
  const response = await axios.patch(`/bills/installments/${id}`, data)

  return response.data
}

export const getInstallment = async (id: string): Promise<IBillInstallment> => {
  const response = await axios.get(`/bills/installments/${id}`)

  return response.data
}

export const deleteInstallment = async (id: string): Promise<void> => {
  await axios.delete(`/bills/installments/${id}`)
}
