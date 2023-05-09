const saveToken = (token: string) => {
  localStorage.setItem('token', token);
}

const getToken = () => {
  return localStorage.getItem('token');
}

const removeToken = () => {
  localStorage.removeItem('token');
}

const isTokenSaved = () => {
  return !!getToken();
}

export {
  saveToken,
  getToken,
  removeToken,
  isTokenSaved,
}