export interface IPeople {
  _id?: string
  document: string
  stateRegistration?: string
  corporateName: string
  fantasyName: string
  phone?: string
  email?: string
  observation?: string
  expenses?: {
    contract?: number
    marketing?: number
    additional?: number
  }
  address: {
    street?: string
    complement?: string
    number?: string
    neighborhood?: string
    city?: string
    federativeUnit?: string
    zipCode?: string
  }
  [key: string]: any
}