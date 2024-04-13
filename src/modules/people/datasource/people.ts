import { tableParams } from '@/src/core/types/pagination-types'
import axios from '~utils/axios'
import { ConsultCnpjData } from '../types/consult-cnpj-data'

export const getPeople = async (params: tableParams) => {
  const { data } = await axios.get('/people', { params })

  return data
}

export const getPerson = async (id: string) => {
  const { data } = await axios.get(`/people/${id}`)

  return data
}

export const createPerson = async (dataForm: any) => {
  const { data } = await axios.post('/people', dataForm)

  return data
}

export const updatePerson = async (id: string, dataForm: any) => {
  const { data } = await axios.patch(`/people/${id}`, dataForm)

  return data
}

export const deletePerson = async (id: string) => {
  const { data } = await axios.delete(`/people/${id}`)

  return data
}

export const generatePeopleReport = async () => {
  const { data } = await axios.get<Blob>('/people/report', { responseType: 'blob' })

  return data
}

export const consultCnpjData = async (cnpj: string) => {
  const { data } = await axios.get<ConsultCnpjData.Root>(`/people/consult-cnpj/${cnpj}`)

  return data
}
