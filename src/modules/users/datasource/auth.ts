import { tableParams } from '@/src/core/types/pagination-types'
import type { IUser } from '../types/auth'
import axios from '~utils/axios'

export const createLogin = async (username: string, password: string) => {
  const { data } = await axios.post('/auth/login', { username, password })

  return data
}

export const updateUser = async (id: string, params: IUser) => {
  const { data } = await axios.patch(`/auth/users/${id}`, { ...params })

  return data
}

export const deleteUser = async (id: string) => {
  const { data } = await axios.delete(`/auth/users/${id}`)

  return data
}

export const createUser = async (params: IUser) => {
  const { data } = await axios.post('/auth/users', { ...params })

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
