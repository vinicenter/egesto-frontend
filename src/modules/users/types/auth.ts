export interface IUser {
  username: string,
  password?: string,
  name: string,
  email?: string | null,
}

export interface IAuth {
  token: string,
  username: string,
  email: string,
  name: string
}
