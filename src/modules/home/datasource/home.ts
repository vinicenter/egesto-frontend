import axios from '~utils/axios'

export const apiHealthCheck = async () => {
  const { data } = await axios.get<string>('/')

  return data
}
