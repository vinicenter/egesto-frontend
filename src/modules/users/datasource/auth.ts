import axios from '~utils/axios'

export const createLogin = async (username: string, password: string) => {
  const { data } = await axios.post('/auth/login', { username, password })

  return data
}

export const createUser = async (username: string, password: string, name: string, email: string) => {
  const { data } = await axios.post('/auth/register', { username, password, name, email })

  return data
}
