import { tableParams } from '@/src/core/types/pagination-types'
import type { PersonType } from '@/functions/api/v1/records/model/people.schemas.ts'
import axios from '~utils/axios'

export const getPeople = async ({ page, perPage, search }: tableParams) => {
  const { data } = await axios.get('/records/people', { params: { page, perPage, search } })

  return data
}

export const getPerson = async (id: string) => {
  const { data } = await axios.get(`/records/people/${id}`)

  return data
}

export const createPerson = async (dataForm: any) => {
  const { data } = await axios.post('/records/people', dataForm)

  return data
}

export const updatePerson = async (id: string, dataForm: any) => {
  const { data } = await axios.patch(`/records/people/${id}`, dataForm)

  return data
}

export const deletePerson = async (id: string) => {
  const { data } = await axios.delete(`/records/people/${id}`)

  return data
}