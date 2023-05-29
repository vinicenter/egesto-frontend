export const required = (v: string) => !!v || 'Campo obrigatório';

export const emailValidation = (value: string) => {
  if(!value) return true 

  if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

  return 'Deve ser um email válido'
}
