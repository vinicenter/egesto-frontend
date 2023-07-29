export interface IPeople {
  document: string
  stateRegistration?: string
  corporateName: string
  fantasyName: string
  phone?: string
  email?: string
  observation?: string
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