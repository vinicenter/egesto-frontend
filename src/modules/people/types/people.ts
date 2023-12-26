export interface IPeople {
  _id?: string
  document: string
  stateRegistration?: string
  corporateName: string
  fantasyName: string
  phone?: string
  email?: string
  observation?: string
  contractExpenses?: number
  address: {
    street?: string
    complement?: string
    number?: string
    neighborhood?: string
    city?: string
    federativeUnit?: string
    zipCode?: string
  }
}