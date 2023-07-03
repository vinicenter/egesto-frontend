import { tableParams } from '@/src/core/types/pagination-types'
import axios from '~utils/axios'

export const getPeople = async ({ page, limit, search }: tableParams) => {
  const { data } = await axios.get('/people', { params: { page, limit, search } })

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
