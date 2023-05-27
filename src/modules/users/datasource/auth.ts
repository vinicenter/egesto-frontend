import { tableParams } from '@/src/core/types/pagination-types'
import axios from '~utils/axios'

export const createLogin = async (username: string, password: string) => {
  const { data } = await axios.post('/auth/login', { username, password })

  return data
}

export const createUser = async (username: string, password: string, name: string, email: string) => {
  const { data } = await axios.post('/auth/register', { username, password, name, email })

  return data
}

export const getUser = async (id: string) => {
  const { data } = await axios.get(`/auth/users/${id}`)

  return data
}

export const getUsers = async ({ page, perPage, search }: tableParams) => {
  const { data } = await axios.get('/auth/users', { params: { page, perPage, search } })

  return data
}
