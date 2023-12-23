import { cnpj, cpf } from 'cpf-cnpj-validator'; 

export const required = (v: any) => {
  if(v === undefined || v === null || v === '') return 'Campo obrigatório'

  return true
};

export const emailValidation = (value: string) => {
  if(!value) return true 

  if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

  return 'Deve ser um email válido'
}

export const cpfCnpjValidator = (value: string) => {
  const validateCnpj = cnpj.isValid(value)
  const validateCpf = cpf.isValid(value)

  if(!value) return true

  if(validateCnpj || validateCpf) return true

  return 'Deve ser um CPF ou CNPJ válido'
}