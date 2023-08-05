import { tableParams } from '@/src/core/types/pagination-types'
import type { IUser } from '../types/auth'
import axios from '~utils/axios'

export const createLogin = async (username: string, password: string) => {
  const { data } = await axios.post('/auth/login', { username, password })

  return data
}

export const updateUser = async (id: string, params: IUser) => {
  const { data } = await axios.patch(`/users/${id}`, { ...params })

  return data
}

export const deleteUser = async (id: string) => {
  const { data } = await axios.delete(`/users/${id}`)

  return data
}

export const createUser = async (params: IUser) => {
  const { data } = await axios.post('/users', { ...params })

  return data
}

export const getUser = async (id: string) => {
  const { data } = await axios.get(`/users/${id}`)

  return data
}

export const getUsers = async (params: tableParams) => {
  const { data } = await axios.get('/users', { params })

  return data
}
