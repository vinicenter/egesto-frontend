import axios from '~utils/axios'

export const createLogin = async (username: string, password: string) => {
  const { data } = await axios.post('/auth/login', { username, password })

  return data
}

export const createUser = async (username: string, password: string, name: string, email: string) => {
  const { data } = await axios.post('/auth/register', { username, password, name, email })

  return data
}

interface tableParams { page: number, perPage: number, search?: string }

export const getUsers = async ({ page, perPage, search }: tableParams) => {
  const { data } = await axios.get('/auth/users', { params: { page, perPage, search } })

  return data
}
