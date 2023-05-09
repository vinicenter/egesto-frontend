const saveTenant = (tenant: string) => {
  localStorage.setItem('tenant', tenant)
}

const getTenant = () => {
  return localStorage.getItem('tenant')
}

const removeTenant = () => {
  localStorage.removeItem('tenant')
}

export {
  saveTenant,
  getTenant,
  removeTenant
}