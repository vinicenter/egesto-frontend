import axios from '~utils/axios'
import { BankingInstitutions } from '../types/banking-institutions'

export const getBankingInstitutions = async () => {
  const { data } = await axios.get<BankingInstitutions[]>('/banks/banking-institutions')

  return data
}
